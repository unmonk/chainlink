import { db } from "@/drizzle/db";
import {
  League,
  NewMatchup,
  MatchupStatus,
  matchups,
  Matchup,
} from "@/drizzle/schema";
import { supportedLeagues } from "@/lib/config";
import { getPacifictime } from "@/lib/utils";
import { Redis } from "@upstash/redis";
import { and, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

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

  //REDIS: setup redis client
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  const redisPipeline = redis.pipeline();

  //Get current date
  const date = new Date();
  const year = date.getFullYear();

  //get yesterday's date
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 1);
  const previousDateString = getPacifictime(previousDate);
  //REDIS: Delete yesterday's matchups from redis
  redisPipeline.del(`MATCHUPS:${previousDateString.redis}`);

  //Fetch schedule data
  const url = `http://cdn.espn.com/core/${league.toLowerCase()}/schedule?dates=${year}&xhr=1&render=false&device=desktop&userab=18`;
  const res = await fetch(url, {
    next: {
      revalidate: 0,
    },
  });

  const resJson = await res.json();
  const schedule = resJson.content?.schedule;
  if (!schedule) {
    return NextResponse.json({ status: 400, message: "No schedule data" });
  }

  //Transform Schedule Data into Matchups
  let formattedSchedules = getScheduleVariables(schedule, league);
  formattedSchedules = makeWhoWillWinQuestions(formattedSchedules);
  const formattedMatchups = formattedSchedules.map((matchup) => {
    return {
      ...matchup,
    } as NewMatchup;
  });

  //get the date range of formattedMatchups
  const firstStartTime = formattedMatchups[0].start_time;
  const lastStartTime =
    formattedMatchups[formattedMatchups.length - 1].start_time;

  //get all matchups from database that are within the date range
  const dbMatchups: Matchup[] = await db.query.matchups.findMany({
    where: and(
      gte(matchups.start_time, firstStartTime),
      lte(matchups.start_time, lastStartTime),
    ),
  });

  //compare dbMatchups and formattedMatchups only keep matchups that are not in db or have different any different key/value pairs
  const updatedMatchups: Matchup[] = [];
  const newMatchups = formattedMatchups.filter((formattedMatchup) => {
    let isUpdated = false;
    const dbMatchup = dbMatchups.find(
      (dbMatchup) => dbMatchup.game_id === formattedMatchup.game_id,
    );
    if (!dbMatchup) return true;
    //Check for updated matchups
    //TODO: Check start time
    if (formattedMatchup.status !== dbMatchup.status) {
      dbMatchup.status = formattedMatchup.status!;
      console.log("status updated");
      isUpdated = true;
    }
    if (formattedMatchup.network !== dbMatchup.network) {
      dbMatchup.network = formattedMatchup.network!;
      console.log("network updated");
      isUpdated = true;
    }
    if (isUpdated) updatedMatchups.push(dbMatchup);
    return false;
  });

  console.log(updatedMatchups);
  console.log(newMatchups);

  for (let matchup of newMatchups) {
    //write to database and get database id
    const matchup_id = (await db.insert(matchups).values(matchup)).insertId;
    matchup.id = Number(matchup_id);
  }

  //REDIS: write to redis pipeline
  for (const matchup of [...updatedMatchups, ...newMatchups]) {
    const dateKey = getPacifictime(matchup.start_time!).redis;
    redisPipeline.hset(`MATCHUPS:${dateKey}`, {
      [matchup.game_id]: JSON.stringify(matchup),
    });
  }

  //REDIS: do all redis writes
  const pipelineResults = await redisPipeline.exec();

  return NextResponse.json(pipelineResults);
}

//TODO type schedule and competitor
function getScheduleVariables(schedule: any, league: League) {
  const output = [];
  for (const day in schedule) {
    if (!schedule[day].games) continue;
    for (const game of schedule[day].games) {
      const matchup: Partial<NewMatchup> = {};
      const competition = game.competitions[0];
      //Skip if no competition data or if game is not scheduled
      if (!competition) continue;
      matchup.status =
        (competition.status.type.name as MatchupStatus) ?? "STATUS_SCHEDULED";
      if (matchup.status !== "STATUS_SCHEDULED") continue;

      matchup.start_time = new Date(competition.startDate);
      matchup.game_id = game.id as string;
      matchup.league = league;
      matchup.network = competition.geoBroadcasts[0]?.media?.shortName ?? "N/A";
      competition.competitors.forEach((competitor: any) => {
        if (competitor.homeAway === "home") {
          matchup.home_team = competitor.team.displayName;
          matchup.home_id = competitor.id;
          matchup.home_image = competitor.team.logo;
          matchup.home_value = 0;
        } else if (competitor.homeAway === "away") {
          matchup.away_team = competitor.team.displayName;
          matchup.away_id = competitor.id;
          matchup.away_image = competitor.team.logo;
          matchup.away_value = 0;
        }
      });
      output.push(matchup);
    }
  }
  return output;
}

function makeWhoWillWinQuestions(
  matchups: Partial<NewMatchup>[],
): Partial<NewMatchup>[] {
  return matchups.map((matchup) => {
    matchup.question = `Who will win this matchup? ${matchup.away_team} @ ${matchup.home_team}?`;
    matchup.home_win_condition = "score";
    matchup.away_win_condition = "score";
    matchup.operator = "GREATER_THAN";
    return matchup;
  });
}
