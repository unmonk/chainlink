"use server"

import { db } from "@/drizzle/db"
import {
  Achievement,
  AchievementType,
  NewAchievement,
  achievements,
  profileAchievements,
} from "@/drizzle/schema"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import format from "date-fns/format"

export async function getAchievementList() {
  const data = await db.query.achievements.findMany({
    orderBy: [desc(achievements.name)],
  })
  if (!data) return []
  return data
}

export async function addAchievement(achievement: NewAchievement) {
  await db.insert(achievements).values(achievement)
  revalidatePath("/admin/achievements")
}

export async function editAchievement(achievement: Achievement) {
  if (!achievement.id) return
  await db
    .update(achievements)
    .set(achievement)
    .where(eq(achievements.id, achievement.id))
  revalidatePath("/admin/achievements")
}

export async function createMonthlyAchievements() {
  const date = new Date()
  const month = format(date, "MMMM")
  const month_number = format(date, "MM")
  const year = format(date, "yyyy")

  const month_year = `${month} ${year}`

  const weight = Number(`${month_number}${year}`)

  const monthly_chain_winner: NewAchievement = {
    name: `${month_year} Chain Winner`,
    description: `The user with the longest winning chain in ${month_year}`,
    type: "MONTHLYSTREAKWIN",
    value: weight,
    image: "https://utfs.io/f/ed40f607-cbbc-497b-8369-2ff8389e91f5-mfokgu.png",
  }

  const monthly_win_winner: NewAchievement = {
    name: `${month_year} Most Wins`,
    description: `The user with the most wins in ${month_year}`,
    type: "MONTHLYWIN",
    value: weight,
    image: "https://utfs.io/f/2f45cd91-68f4-45dd-b867-320ebcc81a23-o42pou.png",
  }

  await addAchievement(monthly_chain_winner)
  await addAchievement(monthly_win_winner)
}

export async function assignAchievement(userId: string, achievementId: number) {
  await db.insert(profileAchievements).values({
    achievement_id: achievementId,
    profile_id: userId,
  })
}

export async function getAchievementByWeightAndType(
  weight: number,
  type: AchievementType
) {
  const achievement = await db.query.achievements.findFirst({
    where: and(eq(achievements.type, type), eq(achievements.value, weight)),
  })
  return achievement
}
