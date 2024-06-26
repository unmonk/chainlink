"use server"

import { getActiveCampaign } from "./campaign"
import { sendDiscordStreakNotification } from "./discord-notifications"
import { db } from "@/drizzle/db"
import { NewStreak, PickWithStreak, Streak, streaks } from "@/drizzle/schema"
import { auth, clerkClient } from "@clerk/nextjs"
import { and, eq, gt } from "drizzle-orm"

export async function getStreak(userId?: string | null) {
  if (!userId) {
    userId = auth().userId
  }
  if (!userId) return null
  let streak = await db.query.streaks.findFirst({
    where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
  })
  if (!streak) {
    await createStreak(userId)
  }
  streak = await db.query.streaks.findFirst({
    where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
  })

  return streak
}

export async function createStreak(userId?: string | null) {
  if (!userId) {
    userId = auth().userId
  }
  if (!userId) {
    throw new Error("No user id")
  }
  const streak = await db.query.streaks.findFirst({
    where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
  })
  if (streak) {
    console.log("STREAK ALREADY EXISTS")
    return
  }
  const campaign = await getActiveCampaign()
  if (!campaign) {
    throw new Error("No active campaign")
  }
  const newStreak: NewStreak = {
    campaign_id: campaign.id,
    user_id: userId,
  }
  await db.insert(streaks).values(newStreak)
}

export async function getPromiseByPick(pick: PickWithStreak) {
  if (pick.pick_status === "WIN") {
    console.log("PICK WIN", pick.streak.wins, pick.streak.wins + 1)
    //if streak is less than 0, reset to 1, otherwise increment by 1
    pick.streak.streak = pick.streak.streak < 0 ? 1 : pick.streak.streak + 1
    //Increment wins by 1
    pick.streak.wins = pick.streak.wins + 1
  }
  if (pick.pick_status === "LOSS") {
    console.log("PICK LOSS", pick.streak.losses, pick.streak.losses + 1)
    //if streak is greater than 0, reset to -1, otherwise decrement by 1
    pick.streak.streak = pick.streak.streak > 0 ? -1 : pick.streak.streak - 1
    //Increment losses by 1
    pick.streak.losses = pick.streak.losses + 1
  }
  if (pick.pick_status === "PUSH") {
    pick.streak.pushes = pick.streak.pushes + 1
  }
  return db
    .update(streaks)
    .set({
      streak: pick.streak.streak,
      wins: pick.streak.wins,
      losses: pick.streak.losses,
      pushes: pick.streak.pushes,
      updated_at: new Date(),
    })
    .where(eq(streaks.id, pick.streak.id))
}

export async function incrementStreak(streak: Streak) {
  streak.streak = streak.streak < 0 ? 1 : streak.streak + 1
  streak.wins = streak.wins + 1
  await db
    .update(streaks)
    .set({
      streak: streak.streak,
      wins: streak.wins,
      updated_at: new Date(),
    })
    .where(eq(streaks.id, streak.id))
  await sendDiscordStreakNotification(streak.user_id, "WIN")
}

export async function decrementStreak(streak: Streak) {
  streak.streak = streak.streak > 0 ? -1 : streak.streak - 1
  streak.losses = streak.losses + 1
  await db
    .update(streaks)
    .set({
      streak: streak.streak,
      losses: streak.losses,
      updated_at: new Date(),
    })
    .where(eq(streaks.id, streak.id))

  //do discord notification if user has connected account
  await sendDiscordStreakNotification(streak.user_id, "LOSS")
}

export async function pushStreak(streak: Streak) {
  streak.pushes = streak.pushes + 1
  await db
    .update(streaks)
    .set({
      pushes: streak.pushes,
      updated_at: new Date(),
    })
    .where(eq(streaks.id, streak.id))
  await sendDiscordStreakNotification(streak.user_id, "PUSH")
}
