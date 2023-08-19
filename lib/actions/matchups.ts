"use server";

import { Matchup } from "@/drizzle/schema";
import { redis } from "@/lib/redis";
import { getPacifictime } from "@/lib/utils";

export async function getMatchups() {
  const date = getPacifictime();
  const key = `MATCHUPS:${date.redis}`;
  const matchups = await redis.hgetall(key);
  let matchupsArray: Matchup[] = Object.values(
    matchups ? matchups : [],
  ) as Matchup[];
  return matchupsArray;
}
