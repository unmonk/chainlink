"use server";

import { getActiveCampaign } from "./campaign";
import { db } from "@/drizzle/db";
import { NewStreak, streaks } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

export async function getStreak() {
  const { userId } = auth();
  if (!userId) return null;
  let streak = await db.query.streaks.findFirst({
    where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
  });
  if (!streak) {
    await createStreak();
    streak = await db.query.streaks.findFirst({
      where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
    });
  }
  return streak;
}

export async function createStreak(userId?: string | null) {
  if (!userId) {
    userId = auth().userId;
  }
  if (!userId) {
    throw new Error("No user id");
  }
  const campaign = await getActiveCampaign();
  if (!campaign) {
    throw new Error("No active campaign");
  }

  const newStreak: NewStreak = {
    campaign_id: campaign.id,
    user_id: userId,
  };
  await db.insert(streaks).values(newStreak);
}

export async function adjustStreak(type: "WIN" | "LOSS" | "PUSH") {
  let streak = await getStreak();
  if (!streak) {
    throw new Error("No active streak");
  }
  if (type === "WIN") {
    //if streak is negative, reset to 1, otherwise increment by 1
    //Increment wins by 1
    streak.streak = streak.streak < 0 ? 1 : streak.streak + 1;
    streak.wins = streak.wins + 1;
  }
  if (type === "LOSS") {
    //if streak is positive, reset to -1, otherwise decrement by 1
    //Increment losses by 1
    streak.streak = streak.streak > 0 ? -1 : streak.streak - 1;
    streak.losses = streak.losses + 1;
  }
  if (type === "PUSH") {
    streak.pushes = streak.pushes + 1;
  }
  await db.update(streaks).set(streak).where(eq(streaks.id, streak.id));
}
