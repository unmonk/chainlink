import { getPacifictime } from "@/lib/utils";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const date = getPacifictime();
  const key = `MATCHUPS:${date.redis}`;

  const matchups = await redis.hgetall(key);

  return NextResponse.json(matchups, { status: 200 });
}
