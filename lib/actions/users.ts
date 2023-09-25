import { getStreak } from "./streaks";
import { clerkClient } from "@clerk/nextjs/server";

export async function getUserByUsername(username: string) {
  const user = await clerkClient.users.getUserList({
    username: [username],
    limit: 1,
  });

  if (user.length === 0) {
    throw Error("No user found");
  }
  return user[0];
}

export async function getUserAndStreakByUsername(username: string) {
  const user = await clerkClient.users.getUserList({
    username: [username],
    limit: 1,
  });

  if (user.length === 0) {
    throw Error("No user found");
  }
  const streak = getStreak(user[0].id);
  return { user: user[0], streak };
}
