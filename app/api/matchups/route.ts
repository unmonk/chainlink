import { db } from "@/drizzle/db"
import { matchups } from "@/drizzle/schema"
import { getPacifictime } from "@/lib/utils"
import { auth } from "@clerk/nextjs"
import { Redis } from "@upstash/redis"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const revalidate = 0

export async function GET(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 403 })
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  const date = getPacifictime()
  const key = `MATCHUPS:${date.redis}`

  const matchups = await redis.hgetall(key)

  return NextResponse.json(matchups, { status: 200 })
}

export async function PUT(request: Request) {
  const matchup = await request.json()

  //write to db
  const res = await db
    .update(matchups)
    .set(matchup)
    .where(eq(matchups.id, matchup.id))

  console.log(res)
  return NextResponse.json(res, { status: 200 })
}
