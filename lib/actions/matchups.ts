"use server";

import { db } from "@/drizzle/db";
import { Matchup, matchups, Pick, picks } from "@/drizzle/schema";
import { redis } from "@/lib/redis";
import { getPacifictime } from "@/lib/utils";
import { eq, inArray } from "drizzle-orm";

export async function getMatchups() {
  const date = getPacifictime();
  const key = `MATCHUPS:${date.redis}`;
  const matchups = await redis.hgetall(key);
  let matchupsArray: Matchup[] = Object.values(
    matchups ? matchups : [],
  ) as Matchup[];
  return matchupsArray;
}

type MatchupWithPicks = Matchup & { picks: Pick[] };

export async function getMatchupsWithPicks() {
  const date = getPacifictime();
  const key = `MATCHUPS:${date.redis}`;
  const redisMatchups = await redis.hgetall(key);
  let matchupsArray: MatchupWithPicks[] = Object.values(
    redisMatchups ? redisMatchups : [],
  ) as MatchupWithPicks[];
  const matchupDbIds = matchupsArray.map((matchup) => matchup.id);
  const dbPicks = await db.query.picks.findMany({
    where: inArray(picks.matchup_id, matchupDbIds),
  });
  //merge picks into matchups
  const matchupsWithPicks = matchupsArray.map((matchup) => {
    matchup.picks = dbPicks.filter((pick) => pick.matchup_id === matchup.id);
    return matchup;
  });
  return matchupsWithPicks;
}
