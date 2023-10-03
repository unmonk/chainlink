import { getStreak } from "@/lib/actions/streaks";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const streak = getStreak();
    if (!streak) {
      return new NextResponse("No active streak", { status: 404 });
    }

    return NextResponse.json(streak, { status: 200 });
  } catch (e) {
    console.log("[STREAK_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
