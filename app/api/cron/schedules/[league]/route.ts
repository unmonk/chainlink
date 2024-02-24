import { db } from "@/drizzle/db"
import { League, NewMatchup, matchups, Matchup } from "@/drizzle/schema"
import { supportedLeagues } from "@/lib/config"
import {
  getScheduleVariables,
  makeWhoWillWinQuestions,
} from "@/lib/matchupUtils"
import { redis } from "@/lib/redis"
import { getPacifictime } from "@/lib/utils"
import { and, gte, lte } from "drizzle-orm"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(
  request: Request,
  { params }: { params: { league: string } }
) {
  //Check for cron key
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: 401, message: "Unauthorized" })
  }
  let localTesting = true
  const test = searchParams.get("test")
  if (test) {
    localTesting = true
  }

  //valid league present
  const league = params.league.toUpperCase() as League
  if (!supportedLeagues.includes(league)) {
    return NextResponse.json({ status: 400, message: "Invalid league" })
  }

  //REDIS: setup redis client
  const redisPipeline = redis.pipeline()

  //Get current date
  const date = new Date()
  const year = date.getFullYear()

  //get yesterday's date
  const previousDate = new Date(date)
  previousDate.setDate(previousDate.getDate() - 1)
  const previousDateString = getPacifictime(previousDate)
  //REDIS: Delete yesterday's matchups from redis
  redisPipeline.del(`MATCHUPS:${previousDateString.redis}`)

  //Fetch schedule data
  let url = ""
  if (league === "MLS") {
    url = `http://cdn.espn.com/core/soccer/schedule/_/league/usa.1??dates=${year}&xhr=1&render=false&device=desktop&userab=18`
  } else {
    url = `http://cdn.espn.com/core/${league.toLowerCase()}/schedule?dates=${year}&xhr=1&render=false&device=desktop&userab=18`
  }

  const res = await fetch(url, {
    next: {
      revalidate: 0,
    },
  })

  const resJson = await res.json()
  const schedule = resJson.content?.schedule
  if (!schedule) {
    return NextResponse.json({ status: 400, message: "No schedule data" })
  }

  //Transform Schedule Data into Matchups
  let formattedSchedules = getScheduleVariables(schedule, league)
  const formattedMatchups = makeWhoWillWinQuestions(
    formattedSchedules
  ) as NewMatchup[]

  formattedMatchups.sort((a, b) => {
    return a.start_time!.getTime() - b.start_time!.getTime()
  })

  //get the date range of formattedMatchups
  const firstStartTime = formattedMatchups[0].start_time
  const lastStartTime =
    formattedMatchups[formattedMatchups.length - 1].start_time

  //get all matchups from database that are within the date range
  const dbMatchups: Matchup[] = await db.query.matchups.findMany({
    where: and(
      gte(matchups.start_time, firstStartTime),
      lte(matchups.start_time, lastStartTime)
    ),
  })

  //compare dbMatchups and formattedMatchups only keep matchups that are not in db or have different any different key/value pairs
  const updatedMatchups: Matchup[] = []
  const newMatchups = formattedMatchups.filter((formattedMatchup) => {
    let isUpdated = false
    //Check if matchup exists in db
    const dbMatchup = dbMatchups.find(
      (dbMatchup) => dbMatchup.game_id === formattedMatchup.game_id
    )
    //If not, add to newMatchups
    if (!dbMatchup) return true

    //Check for updated matchups
    //TODO: Check start time
    if (formattedMatchup.status !== dbMatchup.status) {
      dbMatchup.status = formattedMatchup.status!
      isUpdated = true
    }
    if (formattedMatchup.network !== dbMatchup.network) {
      dbMatchup.network = formattedMatchup.network!
      isUpdated = true
    }
    if (isUpdated) updatedMatchups.push(dbMatchup)
    return false
  })

  for (let matchup of newMatchups) {
    //write to database and get database id
    const matchup_id = (await db.insert(matchups).values(matchup)).insertId
    matchup.id = Number(matchup_id)
  }

  //REDIS: write to redis pipeline
  for (const matchup of [...updatedMatchups, ...newMatchups]) {
    const dateKey = getPacifictime(matchup.start_time!).redis
    redisPipeline.hset(`MATCHUPS:${dateKey}`, {
      [matchup.game_id]: JSON.stringify(matchup),
    })
  }

  //REDIS: do all redis writes
  if (!localTesting) {
    await redisPipeline.exec()
  }

  return NextResponse.json({
    status: 200,
    message: "Success",
    newMatchups,
    updatedMatchups,
  })
}
