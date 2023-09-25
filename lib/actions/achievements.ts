"use server";

import { db } from "@/drizzle/db";

export async function getAchievementList() {
  const achievements = await db.query.achievements.findMany();
  if (!achievements) return [];
  return achievements;
}
