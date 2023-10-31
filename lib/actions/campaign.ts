"use server"

import { sendDiscordCampaignWinNotification } from "./discord-notifications"
import { db } from "@/drizzle/db"
import { AchievementType, campaigns, streaks } from "@/drizzle/schema"
import { desc, eq } from "drizzle-orm"
import {
  getAchievementByWeightAndType,
  assignAchievement,
} from "./achievements"

export async function getActiveCampaign() {
  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.active, true),
  })
  return campaign
}

export async function getActiveCampaignId() {
  const campaign = await db
    .select({
      id: campaigns.id,
    })
    .from(campaigns)
    .where(eq(campaigns.active, true))
    .limit(1)

  return campaign[0].id
}

export async function completeActiveCampaign() {
  const campaign = await getActiveCampaign()
  if (!campaign) {
    return
  }
  //Set inactive
  campaign.active = false

  //Determine Winners
  const streak_winner_id = await getStreakWinner(campaign.id)
  const win_winner_id = await getWinWinner(campaign.id)

  //set winners
  campaign.streak_winner_id = streak_winner_id
  campaign.winner_id = win_winner_id

  await db.update(campaigns).set(campaign).where(eq(campaigns.id, campaign.id))

  //Set all streaks to inactive
  await db.update(streaks).set({ active: false })

  //Assign Achievements
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const lastMonthYear = lastMonth.getFullYear()
  const lastMonthNumber = lastMonth.getMonth() + 1
  const weight = Number(`${lastMonthNumber}${lastMonthYear}`)
  if (campaign.streak_winner_id) {
    const lastMonthChainAchievement = await getAchievementByWeightAndType(
      weight,
      AchievementType.MONTHLYSTREAKWIN
    )
    if (lastMonthChainAchievement) {
      await assignAchievement(streak_winner_id, lastMonthChainAchievement.id)
      await sendDiscordCampaignWinNotification(
        streak_winner_id,
        campaign.name,
        "streak",
        lastMonthChainAchievement?.image || ""
      )
    }
  }

  if (campaign.winner_id) {
    const lastMonthWinAchievement = await getAchievementByWeightAndType(
      weight,
      AchievementType.MONTHLYWIN
    )
    if (lastMonthWinAchievement) {
      await assignAchievement(win_winner_id, lastMonthWinAchievement.id)
      await sendDiscordCampaignWinNotification(
        win_winner_id,
        campaign.name,
        "wins",
        lastMonthWinAchievement?.image || ""
      )
    }
  }

  return campaign
}

async function getStreakWinner(campaign_id: number) {
  const winning_streak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.campaign_id, campaign_id))
    .orderBy(desc(streaks.streak), desc(streaks.wins), desc(streaks.pushes))
    .limit(1)

  return winning_streak[0].user_id
}

async function getWinWinner(campaign_id: number) {
  const winning_streak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.campaign_id, campaign_id))
    .orderBy(desc(streaks.wins), desc(streaks.streak), desc(streaks.pushes))
    .limit(1)

  return winning_streak[0].user_id
}
