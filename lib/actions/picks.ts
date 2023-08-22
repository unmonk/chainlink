"use server";

import { getStreak } from "./streaks";
import { db } from "@/drizzle/db";
import {
  NewPick,
  PickWithMatchupAndStreak,
  PickWithStreak,
  picks,
} from "@/drizzle/schema";
import { auth } from "@clerk/nextjs";
import { and, desc, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function makePick(pick: NewPick) {
  const streak = await getStreak();
  if (!streak) {
    throw new Error("No active streak");
  }
  pick.active = true;
  pick.streak_id = streak.id;
  await db.insert(picks).values(pick);
  revalidatePath(`/dashboard`);
}

export async function getPick() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("No user id");
  }
  const pick = await db.query.picks.findFirst({
    where: and(eq(picks.user_id, userId), eq(picks.active, true)),
    with: {
      matchup: true,
    },
  });
  return pick;
}

export async function deletePick() {
  const { userId } = auth();
  if (!userId) return null;
  await db
    .delete(picks)
    .where(and(eq(picks.user_id, userId), eq(picks.active, true)));
  revalidatePath(`/dashboard`);
}

export async function getMatchupPicks(
  matchupId: number,
): Promise<PickWithStreak[]> {
  const matchupPicks = await db.query.picks.findMany({
    where: eq(picks.matchup_id, matchupId),
    with: {
      streak: true,
    },
  });
  return matchupPicks as PickWithStreak[];
}

export async function setPicksInProgress(matchupId: number) {
  await db
    .update(picks)
    .set({
      pick_status: "STATUS_IN_PROGRESS",
    })
    .where(
      and(
        eq(picks.matchup_id, matchupId),
        ne(picks.pick_status, "STATUS_IN_PROGRESS"),
      ),
    );
}

export async function getUserPicks(userId: string) {
  const userPicks = await db.query.picks.findMany({
    where: eq(picks.user_id, userId),
    with: {
      matchup: true,
    },
    limit: 10,
    orderBy: desc(picks.updated_at),
  });
  return userPicks;
}
