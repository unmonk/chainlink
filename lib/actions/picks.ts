"use server";

import { db } from "@/drizzle/db";
import { NewPick, picks } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function makePick(pick: NewPick) {
  try {
    pick.active = true;
    const insertPick = await db.insert(picks).values(pick);
    const fetchedPick = await db.query.picks.findFirst({
      where: eq(picks.id, Number(insertPick.insertId)),
    });

    return fetchedPick;
  } catch (err) {
    console.log(err);
  }
}

export async function getPick(userId: string) {
  try {
    const pick = await db.query.picks.findFirst({
      where: and(eq(picks.user_id, userId), eq(picks.active, true)),
    });

    return pick;
  } catch (err) {
    console.log(err);
  }
}
