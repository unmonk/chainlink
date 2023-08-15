import { League, MatchupStatus, Matchup } from "@/drizzle/schema";
import { supportedLeagues } from "@/lib/config";
import { getPacifictime } from "@/lib/utils";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
//REDIS: setup redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

  //Get current chicago date
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
    if (matchup.status !== dataMatchup.status.type.name) {
      matchup.status = dataMatchup.status.type.name as MatchupStatus;
      changed = true;
      changedFields.push("status");
    }
    if (
      matchup.home_value !==
      parseInt(dataMatchup.competitions[0].competitors[0].score)
    ) {
      matchup.home_value = dataMatchup.competitions[0].competitors[0].score;
      changed = true;
      changedFields.push("home_value");
    }
    if (
      matchup.away_value !==
      parseInt(dataMatchup.competitions[0].competitors[1].score)
    ) {
      matchup.away_value = dataMatchup.competitions[0].competitors[1].score;
      changed = true;
      changedFields.push("away_value");
    }
    if (changed) {
      changedMatchups.push(matchup);
    }
  }

  //REDIS: update changed matchups
  let results: unknown[] = [];
  if (changedMatchups.length > 0) {
    for (const matchup of changedMatchups) {
      redisPipeline.hset(`MATCHUPS:${date.redis}`, {
        [matchup.game_id]: JSON.stringify(matchup),
      });
    }
    //REDIS: do all redis writes
    results = await redisPipeline.exec();
  }

  return NextResponse.json(results, { status: 200 });
}

function getScoreboardUrl(league: League, param: string | number) {
  const limit = 100;
  switch (league) {
    case "MLB":
      return `http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${param}&limit=${limit}`;
    default:
      throw new Error("Invalid league");
  }
}
