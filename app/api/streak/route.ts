import { db } from "@/drizzle/db";
import { NewStreak, streaks } from "@/drizzle/schema";
import { getActiveCampaign, getActiveCampaignId } from "@/lib/actions/campaign";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    let streak = await db.query.streaks.findFirst({
      where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
    });

    if (!streak) {
      //get active campaign
      const campaignId = await getActiveCampaignId();

      //create streak
      const newStreak: NewStreak = {
        campaign_id: campaignId,
        user_id: userId,
        active: true,
        streak: 0,
        pushes: 0,
        wins: 0,
        losses: 0,
      };

      await db.insert(streaks).values(newStreak);
      streak = await db.query.streaks.findFirst({
        where: and(eq(streaks.user_id, userId), eq(streaks.active, true)),
      });
    }

    return NextResponse.json(streak, { status: 200 });
  } catch (e) {
    console.log("[STREAK_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
