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
  const ourData = currentMatchupsRes.value;

  //loop through our data and update with espn data
  const changedMatchups: Matchup[] = [];
  const changedFields = [];
  for (const game_id in ourData) {
    let changed = false;
    const matchup = ourData[game_id] as Matchup;
    //TODO: Type for event
    const dataMatchup = data.events.find(
      (event: any) => event.id === matchup.game_id,
    );
    if (!dataMatchup) {
      continue;
    }
    //compare status, score, push to changedMatchups if changed
    if (matchup.status.toString() !== dataMatchup.status.type.name.toString()) {
      console.log(
        "status changed",
        matchup.status,
        dataMatchup.status.type.name,
        matchup.game_id,
      );
      matchup.status = dataMatchup.status.type.name as MatchupStatus;
      changed = true;
      changedFields.push("status");
    }
    if (
      matchup.home_value !=
      parseInt(dataMatchup.competitions[0].competitors[0].score)
    ) {
      console.log(
        "home_value changed",
        matchup.home_value,
        dataMatchup.competitions[0].competitors[0].score,
        matchup.game_id,
      );
      matchup.home_value = dataMatchup.competitions[0].competitors[0].score;
      changed = true;
      changedFields.push("home_value");
    }
    if (
      matchup.away_value !=
      parseInt(dataMatchup.competitions[0].competitors[1].score)
    ) {
      console.log(
        "away_value changed",
        matchup.away_value,
        dataMatchup.competitions[0].competitors[1].score,
        matchup.game_id,
      );
      matchup.away_value = dataMatchup.competitions[0].competitors[1].score;
      changed = true;
      changedFields.push("away_value");
    }
    if (changed) {
      changedMatchups.push(matchup);
    }
  }

  let results: unknown[] = [];
  if (changedMatchups.length > 0) {
    const dbPromises = [];
    for (let matchup of changedMatchups) {
      if (matchup.status === "STATUS_IN_PROGRESS") {
        const pickUpdates = handleStatusInProgress(matchup);
        dbPromises.push(pickUpdates);
      }
      if (matchup.status === "STATUS_FINAL") {
        const updateMatchup = handleStatusFinal(matchup);
        //handle picks per matchup
        const fetchedPicks = await getMatchupPicks(matchup.id);
        const pickUpdates = fetchedPicks.map((pick) => {
          if (
            (pick.pick_type === "AWAY" &&
              matchup.winner_id === matchup.away_id) ||
            (pick.pick_type === "HOME" && matchup.winner_id === matchup.home_id)
          ) {
            pick.pick_status = "WIN";
          }
          if (
            (pick.pick_type === "AWAY" &&
              matchup.winner_id === matchup.home_id) ||
            (pick.pick_type === "HOME" && matchup.winner_id === matchup.away_id)
          ) {
            pick.pick_status = "LOSS";
          }
          if (matchup.winner_id === null) {
            pick.pick_status = "PUSH";
          }
          const streakPromise = getPromiseByPick(pick);
          dbPromises.push(streakPromise);

          return db.update(picks).set({
            pick_status: pick.pick_status,
            active: false,
          });
        });

        dbPromises.push(...pickUpdates);

        const dbPromise = db.update(matchups).set({
          away_value: updateMatchup.away_value,
          home_value: updateMatchup.home_value,
          status: updateMatchup.status,
          winner_id: updateMatchup.winner_id,
        });
        dbPromises.push(dbPromise);
      }
      redisPipeline.hset(`MATCHUPS:${date.redis}`, {
        [matchup.game_id]: JSON.stringify(matchup),
      });
    }
    console.log("Promises for DB:", dbPromises.length);
    //REDIS: do all redis writes
    results = await Promise.all([redisPipeline.exec(), ...dbPromises]);
  } else {
    console.log("No Changes, skipped DB writes");
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
