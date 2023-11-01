import { db } from "@/drizzle/db"
import {
  ProfileAchievementWithAchievement,
  matchups,
  profileAchievements,
  profiles,
  streaks,
} from "@/drizzle/schema"
import { clerkClient, currentUser, redirectToSignIn } from "@clerk/nextjs"
import { eq, sql } from "drizzle-orm"

export const getUserProfile = async (userId?: string) => {
  const user = userId
    ? await clerkClient.users.getUser(userId)
    : await currentUser()
  if (!user) {
    return redirectToSignIn()
  }

  //get profile
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.user_id, user.id),
    with: {
      achievements: {
        with: {
          achievement: true,
        },
      },
      ownedSquads: true,
      squads: true,
      picks: {
        with: {
          matchup: true,
        },
      },
    },
  })

  if (profile) {
    return profile
  }

  // Doesnt exist, create new profile
  await db.insert(profiles).values({
    user_id: user.id,
  })

  const newProfile = await db.query.profiles.findFirst({
    where: eq(profiles.user_id, user.id),
    with: {
      achievements: true,
      ownedSquads: true,
      squads: true,
      picks: {
        with: {
          matchup: true,
        },
      },
    },
  })
  return newProfile
}

export const createProfile = async (userId: string) => {
  const profile = await db.insert(profiles).values({
    user_id: userId,
  })
  return profile
}

export const getUserAchievements = async (userId: string) => {
  const achievements = await db.query.profileAchievements.findMany({
    where: eq(profileAchievements.profile_id, userId),
    with: {
      achievement: true,
    },
  })

  if (!achievements) {
    return []
  }

  const filteredAchievements = []

  //filter to the highest value achievement in each type
  const monthlyStreakWins = achievements
    .filter(
      (achievement: ProfileAchievementWithAchievement) =>
        achievement.achievement.type === "MONTHLYSTREAKWIN"
    )
    .sort((a, b) => b.achievement.value - a.achievement.value)

  if (monthlyStreakWins.length > 0) {
    filteredAchievements.push(monthlyStreakWins[0])
  }

  const monthlyWins = achievements
    .filter(
      (achievement: ProfileAchievementWithAchievement) =>
        achievement.achievement.type === "MONTHLYWIN"
    )
    .sort((a, b) => b.achievement.value - a.achievement.value)
  if (monthlyWins.length > 0) {
    filteredAchievements.push(monthlyWins[0])
  }

  const streakWins = achievements
    .filter(
      (achievement: ProfileAchievementWithAchievement) =>
        achievement.achievement.type === "STREAKWIN"
    )
    .sort((a, b) => b.achievement.value - a.achievement.value)
  if (streakWins.length > 0) {
    filteredAchievements.push(streakWins[0])
  }

  const streakLosses = achievements
    .filter(
      (achievement: ProfileAchievementWithAchievement) =>
        achievement.achievement.type === "STREAKLOSS"
    )
    .sort((a, b) => b.achievement.value - a.achievement.value)
  if (streakLosses.length > 0) {
    filteredAchievements.push(streakLosses[0])
  }

  const referrals = achievements
    .filter(
      (achievement: ProfileAchievementWithAchievement) =>
        achievement.achievement.type === "REFERRAL"
    )
    .sort((a, b) => b.achievement.value - a.achievement.value)
  if (referrals.length > 0) {
    filteredAchievements.push(referrals[0])
  }

  const otherAchievements = achievements.filter(
    (achievement: ProfileAchievementWithAchievement) =>
      achievement.achievement.type !== "MONTHLYSTREAKWIN" &&
      achievement.achievement.type !== "MONTHLYWIN" &&
      achievement.achievement.type !== "STREAKWIN" &&
      achievement.achievement.type !== "STREAKLOSS" &&
      achievement.achievement.type !== "REFERRAL"
  )

  //push remaining achievements not already pushed
  filteredAchievements.push(...otherAchievements)

  // return the highest value achievement in each type and then the remaining achievements
  return filteredAchievements
}

export const getUserStats = async (userId: string) => {
  interface LeagueStats {
    leagues: string
    win_count: number
  }

  const query = sql`SELECT m.leagues, COUNT(p.id) AS win_count
FROM matchups as m
INNER JOIN picks AS p on m.id = p.matchup_id
WHERE p.user_id = ${userId} AND p.pick_status = 'WIN'
GROUP BY m.leagues
ORDER BY win_count DESC;`

  const stats = await db.execute(query)
  return stats.rows as LeagueStats[]
}
