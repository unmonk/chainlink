import { db } from "@/drizzle/db"
import { AchievementType, NewCampaign, campaigns } from "@/drizzle/schema"
import {
  assignAchievement,
  createMonthlyAchievements,
  getAchievementByWeightAndType,
} from "@/lib/actions/achievements"
import { completeActiveCampaign } from "@/lib/actions/campaign"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // const cronSecret = request.headers.get("x-merc-cron-secret");
  // if (cronSecret !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ status: 401, message: "Unauthorized" });
  // }
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: 401, message: "Unauthorized" })
  }

  //Complete Last month's campaign and assign winners
  const completedCampaign = await completeActiveCampaign()

  //Create new campaign for this month
  const nextMonth = new Date()
  let year = nextMonth.getFullYear()

  const month = nextMonth.toLocaleString("en-US", { month: "long" })

  const startTimeOfMonth = new Date(year, nextMonth.getMonth(), 1)
  const endTimeOfMonth = new Date(year, nextMonth.getMonth() + 1, 0)

  const campaign: NewCampaign = {
    name: `${month} ${year} Streak Campaign`,
    start_date: startTimeOfMonth,
    end_date: endTimeOfMonth,
    created_by: "SYSTEM",
    active: true,
  }

  const dbInsert = await db.insert(campaigns).values(campaign)

  //Create Achievements for this month
  await createMonthlyAchievements()

  const response = {
    completedCampaign,
    newCampaign: dbInsert,
  }

  return NextResponse.json(response, { status: 200 })
}

export const revalidate = 0
