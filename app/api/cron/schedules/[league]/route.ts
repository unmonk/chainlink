import { League, NewMatchup, MatchupStatus } from "@/drizzle/schema";
import { supportedLeagues } from "@/lib/config";
import { Redis } from "@upstash/redis";
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
  const previousDateString = previousDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Chicago",
  });

  //REDIS: Delete yesterday's matchups from redis
  redisPipeline.del(`MATCHUPS:${previousDateString}`);

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
  //Transform Matchups into Redis Hash
  for (const matchup of formattedMatchups) {
    //group matchups by date
    const dateKey = matchup.start_time.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Los_Angeles",
    });
    redisPipeline.hsetnx(`MATCHUPS:${dateKey}`, matchup.game_id!, matchup);
  }

  //REDIS: do all redis writes
  const pipelineResults = await redisPipeline.exec();

  return NextResponse.json(pipelineResults);
}

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
