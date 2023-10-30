"use server";

import { db } from "@/drizzle/db";
import { NewAchievement, achievements } from "@/drizzle/schema";
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
