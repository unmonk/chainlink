"use server";

import { sendPushNotificationToUser } from "../notifications";
import {
  decrementStreak,
  getStreak,
  incrementStreak,
  pushStreak,
} from "./streaks";
import { db } from "@/drizzle/db";
import { NewPick, PickWithStreak, picks } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs";
import { and, desc, eq, ne } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function makePick(pick: NewPick) {
  const streak = await getStreak();
  if (!streak) {
    throw new Error("No active streak");
  }
  pick.active = true;
  pick.streak_id = streak.id;

  await db.insert(picks).values(pick);
  revalidatePath(`/play`);
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

//Used on the Play page to delete your own pick
export async function deletePick() {
  const { userId } = auth();
  if (!userId) return null;
  await db
    .delete(picks)
    .where(and(eq(picks.user_id, userId), eq(picks.active, true)));
  revalidatePath(`/play`);
}

// Used on the admin page to delete any users pick
export async function deleteActivePickByUserId(userId: string) {
  if (!userId) return null;
  await db
    .delete(picks)
    .where(and(eq(picks.user_id, userId), eq(picks.active, true)));
  revalidatePath("/admin/picks");
}

export async function updatePickById(pickId: number, pick: Partial<NewPick>) {
  if (
    pick.pick_status === "LOSS" ||
    pick.pick_status === "WIN" ||
    pick.pick_status === "PUSH"
  ) {
    //handle streaks
    const streak = await getStreak();
    if (!streak) {
      throw new Error("No active streak");
    }
    if (pick.pick_status === "LOSS") {
      await decrementStreak(streak);
    }
    if (pick.pick_status === "WIN") {
      await incrementStreak(streak);
    }
    if (pick.pick_status === "PUSH") {
      await pushStreak(streak);
    }
    pick.active = false;
  }
  await db.update(picks).set(pick).where(eq(picks.id, pickId));
  revalidatePath("/admin/picks");
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
  return db
    .update(picks)
    .set({
      pick_status: "STATUS_IN_PROGRESS",
      updated_at: new Date(),
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
    limit: 30,
    orderBy: desc(picks.updated_at),
  });
  return userPicks;
}

export async function getActivePicks() {
  const activePicks = await db.query.picks.findMany({
    where: eq(picks.active, true),
    with: {
      matchup: true,
    },
  });
  return activePicks;
}
