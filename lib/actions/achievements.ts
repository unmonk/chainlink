"use server";

import { db } from "@/drizzle/db";
import { Achievement, NewAchievement, achievements } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAchievementList() {
  const achievements = await db.query.achievements.findMany();
  if (!achievements) return [];
  return achievements;
}

export async function addAchievement(achievement: NewAchievement) {
  await db.insert(achievements).values(achievement);
  revalidatePath("/admin/achievements");
}

export async function editAchievement(achievement: Achievement) {
  if (!achievement.id) return;
  await db
    .update(achievements)
    .set(achievement)
    .where(eq(achievements.id, achievement.id));
  revalidatePath("/admin/achievements");
}
