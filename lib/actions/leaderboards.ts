import { db } from "@/drizzle/db";
import { Campaign, Streak, streaks } from "@/drizzle/schema";
import { clerkClient } from "@clerk/nextjs";
import { and, asc, desc, eq, sql } from "drizzle-orm";

export type StreakWithUsers = Streak & {
  user: {
    username: string;
    image: string;
  };
};

export type AllTimeWithUsers = {
  user_id: string;
  wins: number;
  id: number;
  user: {
    username: string;
    image: string;
  };
};

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
    .limit(25)) as AllTimeWithUsers[];

  const userIds = result.map((streak) => streak.user_id);
  //get matching users from clerk
  const users = await clerkClient.users.getUserList({
    userId: userIds,
  });
  result.forEach((streak) => {
    const user = users.find((user) => user.id === streak.user_id);
    streak.user = {
      username:
        user?.username ||
        user?.externalAccounts[0]?.username ||
        user?.firstName ||
        "",
      image: user?.imageUrl || "",
    };
  });

  return result;
}

export async function getCurrentLeaderboardByStreak() {
  //Get current streaks
  const result = (await db.query.streaks.findMany({
    where: eq(streaks.active, true),
    orderBy: desc(streaks.streak),
    limit: 25,
  })) as StreakWithUsers[];

  const userIds = result.map((streak) => streak.user_id);
  //get matching users from clerk
  const users = await clerkClient.users.getUserList({
    userId: userIds,
  });
  result.forEach((streak) => {
    const user = users.find((user) => user.id === streak.user_id);
    streak.user = {
      username:
        user?.username ||
        user?.externalAccounts[0]?.username ||
        user?.firstName ||
        "",
      image: user?.imageUrl || "",
    };
  });
  console.log(result);
  return result;
}

export async function getCurrentLeaderboardByWins() {
  //Get current streaks
  const result = (await db.query.streaks.findMany({
    where: eq(streaks.active, true),
    orderBy: desc(streaks.wins),
    limit: 25,
  })) as StreakWithUsers[];

  const userIds = result.map((streak) => streak.user_id);
  //get matching users from clerk
  const users = await clerkClient.users.getUserList({
    userId: userIds,
  });
  result.forEach((streak) => {
    const user = users.find((user) => user.id === streak.user_id);
    streak.user = {
      username:
        user?.username ||
        user?.externalAccounts[0]?.username ||
        user?.firstName ||
        "",
      image: user?.imageUrl || "",
    };
  });

  return result;
}
