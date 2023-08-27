import { db } from "@/drizzle/db";
import {
  League,
  MatchupStatus,
  Matchup,
  matchups,
  picks,
} from "@/drizzle/schema";
import { getMatchupPicks } from "@/lib/actions/picks";
import { getPromiseByPick } from "@/lib/actions/streaks";
import { supportedLeagues } from "@/lib/config";
import { handleStatusFinal, handleStatusInProgress } from "@/lib/matchupUtils";
import { redis } from "@/lib/redis";
import { getPacifictime } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
//REDIS: setup redis client

export async function GET(
  request: Request,
  { params }: { params: { league: string } },
) {
  //Check for cron key
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  //valid league present
  const league = params.league.toUpperCase() as League;
  if (!supportedLeagues.includes(league)) {
    return NextResponse.json({ status: 400, message: "Invalid league" });
  }

  //Get current date
  const date = getPacifictime();

  //Fetch Scoreboard and currentMatchups Data
  const url = getScoreboardUrl(league, date.url);
  const scoreboardPromise = fetch(url, { next: { revalidate: 0 } });

  //Fetch

  //Setup Redis Pipeline
  const redisPipeline = redis.pipeline();
  const currentMatchupsPromise = redis.hgetall(`MATCHUPS:${date.redis}`);

  const [scoreboardRes, currentMatchupsRes] = await Promise.allSettled([
    scoreboardPromise,
    currentMatchupsPromise,
  ]);
  if (
    scoreboardRes.status !== "fulfilled" ||
    currentMatchupsRes.status !== "fulfilled" ||
    !currentMatchupsRes.value
  ) {
    return NextResponse.json({
      status: 400,
      message: "Failed to fetch scoreboard or current matchups",
    });
  }

  const data = await scoreboardRes.value.json();
  const redisData = currentMatchupsRes.value;

  //loop through our redis matchups and compare with scoreboard matchups
  const changedMatchups: Matchup[] = [];
  const changedFields = [];
  for (const game_id in redisData) {
    let changed = false;
    const matchup = redisData[game_id] as Matchup;
    //TODO: Type for event
    const dataMatchup = data.events.find(
      (event: any) => event.id === matchup.game_id,
    );
    if (!dataMatchup) {
      //no scoreboard matchup found, skip
      continue;
    }

    //Variables from scoreboard matchup
    const homeTeam = dataMatchup.competitions[0].find(
      (team: any) => team.homeAway === "home",
    );
    const awayTeam = dataMatchup.competitions[0].find(
      (team: any) => team.homeAway === "away",
    );
    const dataStatus = dataMatchup.status.type.name as MatchupStatus;
    const homeScore = homeTeam.score as number;
    const awayScore = awayTeam.score as number;

    //compare status, score, push to changedMatchups if changed
    if (matchup.status !== dataStatus) {
      console.log(
        "status changed",
        "OLD:",
        matchup.status,
        "NEW:",
        dataMatchup.status.type.name,
        "GAME ID:",
        matchup.game_id,
      );
      matchup.status = dataStatus;
      changed = true;
      changedFields.push("status");
    }
    if (matchup.home_value !== homeScore) {
      console.log(
        "home_value changed",
        "OLD:",
        matchup.home_value,
        "NEW:",
        homeScore,
        "GAME ID:",
        matchup.game_id,
      );
      matchup.home_value = homeScore;
      changed = true;
      changedFields.push("home_value");
    }
    if (matchup.away_value !== awayScore) {
      console.log(
        "away_value changed",
        "OLD:",
        matchup.away_value,
        "NEW:",
        awayScore,
        "GAME ID:",
        matchup.game_id,
      );
      matchup.away_value = awayScore;
      changed = true;
      changedFields.push("away_value");
    }
    if (changed) {
      changedMatchups.push(matchup);
    }
  }

  //LOOP THROUGH CHANGED MATCHUPS ONLY
  let results: unknown[] = [];
  if (changedMatchups.length > 0) {
    const dbPromises = [];
    for (let matchup of changedMatchups) {
      //HANDLE MATCHUPS THAT RE STATUS_IN_PROGRESS
      if (matchup.status === "STATUS_IN_PROGRESS") {
        const pickUpdates = handleStatusInProgress(matchup);
        dbPromises.push(pickUpdates);
      }

      //HANDLE MATCHUPS THAT ARE STATUS_FINAL
      if (matchup.status === "STATUS_FINAL") {
        //GET UPDATED MATCHUP
        const updateMatchup = handleStatusFinal(matchup);
        //handle picks per matchup
        const fetchedPicks = await getMatchupPicks(matchup.id);
        fetchedPicks.forEach((pick) => {
          if (
            (pick.pick_type === "AWAY" &&
              updateMatchup.winner_id === updateMatchup.away_id) ||
            (pick.pick_type === "HOME" &&
              updateMatchup.winner_id === updateMatchup.home_id)
          ) {
            pick.pick_status = "WIN";
          }
          if (
            (pick.pick_type === "AWAY" &&
              updateMatchup.winner_id === updateMatchup.home_id) ||
            (pick.pick_type === "HOME" &&
              updateMatchup.winner_id === updateMatchup.away_id)
          ) {
            pick.pick_status = "LOSS";
          }
          if (updateMatchup.winner_id === null) {
            pick.pick_status = "PUSH";
          }
          const streakPromise = getPromiseByPick(pick);
          const pickPromise = db
            .update(picks)
            .set({
              pick_status: pick.pick_status,
              active: false,
              updated_at: new Date(),
            })
            .where(eq(picks.id, pick.id));
          dbPromises.push(streakPromise);
          dbPromises.push(pickPromise);
        });

        const dbPromise = db
          .update(matchups)
          .set({
            away_value: updateMatchup.away_value,
            home_value: updateMatchup.home_value,
            status: updateMatchup.status,
            winner_id: updateMatchup.winner_id,
            updated_at: new Date(),
          })
          .where(eq(matchups.id, updateMatchup.id));
        dbPromises.push(dbPromise);
        //END FINAL MATCHUP HANDLING
      }

      //REDIS SET MATCHUP
      redisPipeline.hset(`MATCHUPS:${date.redis}`, {
        [matchup.game_id]: JSON.stringify(matchup),
      });
    }
    //REDIS: do all redis writes
    results = await Promise.all([redisPipeline.exec(), ...dbPromises]);
  }
  return NextResponse.json(results, { status: 200 });
}

function getScoreboardUrl(league: League, param: string | number) {
  const limit = 100;
  switch (league) {
    case "MLB":
      return `http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${param}&limit=${limit}`;
    case "WNBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${param}&limit=${limit}`;
    case "NFL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${param}&limit=${limit}`;
    case "NBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${param}&limit=${limit}`;
    case "NHL":
      return `http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${param}&limit=${limit}`;
    default:
      throw new Error("Invalid league");
  }
}
