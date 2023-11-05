import { redis } from "../redis"
import { db } from "@/drizzle/db"
import {
  Achievement,
  Campaign,
  ProfileAchievement,
  Streak,
  achievements,
  profileAchievements,
  streaks,
} from "@/drizzle/schema"
import { clerkClient, redirectToSignIn } from "@clerk/nextjs"
import { format } from "date-fns"
import { and, asc, desc, eq, or, sql } from "drizzle-orm"
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants"

export type StreakWithUsers = Streak & {
  user: {
    username: string
    image: string
  }
}

export type AllTimeWithUsers = {
  user_id: string
  wins: number
  id: number
  user: {
    username: string
    image: string
  }
}

export async function getAllTimeWinsLeaderboard() {
  //get all time wins
  //count wins from all streaks for all users
  const result = (await db
    .select({
      user_id: streaks.user_id,
      wins: sql<number>`sum(${streaks.wins})`,
    })
    .from(streaks)
    .groupBy(streaks.user_id)
    .orderBy(desc(sql<number>`sum(${streaks.wins})`))
    .limit(25)) as AllTimeWithUsers[]

  const userIds = result.map((streak) => streak.user_id)

  //get matching users from clerk
  const users = await clerkClient.users.getUserList({
    userId: userIds,
    limit: 25,
  })

  result.forEach((streak) => {
    const user = users.find((user) => user.id === streak.user_id)
    streak.user = {
      username:
        user?.username ||
        user?.externalAccounts[0]?.username ||
        user?.firstName ||
        user?.id ||
        "",
      image: user?.imageUrl ?? "",
    }
  })

  //Remove Test Account

  return result
}

export async function getCurrentLeaderboardByStreak() {
  //Get current streaks
  const result = (await db.query.streaks.findMany({
    where: eq(streaks.active, true),
    orderBy: desc(streaks.streak),
    limit: 25,
  })) as StreakWithUsers[]

  const userIds = result.map((streak) => streak.user_id)
  //get matching users from clerk
  const users = await clerkClient.users.getUserList({
    userId: userIds,
    limit: 25,
  })
  result.forEach((streak) => {
    const user = users.find((user) => user.id === streak.user_id)
    streak.user = {
      username:
        user?.username ||
        user?.externalAccounts[0]?.username ||
        user?.firstName ||
        user?.id ||
        "",
      image: user?.imageUrl ?? "",
    }
  })
  return result
}

export async function getCurrentLeaderboardByWins() {
  //Get current streaks
  const result = (await db.query.streaks.findMany({
    where: eq(streaks.active, true),
    orderBy: desc(streaks.wins),
    limit: 25,
  })) as StreakWithUsers[]

  const userIds = result.map((streak) => streak.user_id)

  //get matching users from clerk
  const users = await clerkClient.users.getUserList({
    userId: userIds,
    limit: 25,
  })
  result.forEach((streak) => {
    const user = users.find((user) => user.id === streak.user_id)
    streak.user = {
      username:
        user?.username ||
        user?.externalAccounts[0]?.username ||
        user?.firstName ||
        "",
      image: user?.imageUrl ?? "",
    }
  })

  return result
}

export async function getLastMonthsWinners() {
  type LastMonthWinners = {
    profile_id: string
    achievement: Achievement
  }
  const date = new Date()
  //subtract a month
  date.setMonth(date.getMonth() - 1)
  const month_number = format(date, "MM")
  const year = format(date, "yyyy")
  const weight = Number(`${month_number}${year}`)

  const result = (await db
    .select({
      profile_id: profileAchievements.profile_id,
      achievement: achievements,
    })
    .from(profileAchievements)
    .innerJoin(
      achievements,
      eq(profileAchievements.achievement_id, achievements.id)
    )
    .where(
      or(
        and(
          eq(achievements.type, "MONTHLYWIN"),
          eq(achievements.value, weight)
        ),
        and(
          eq(achievements.type, "MONTHLYSTREAKWIN"),
          eq(achievements.value, weight)
        )
      )
    )) as LastMonthWinners[]

  return result
}
