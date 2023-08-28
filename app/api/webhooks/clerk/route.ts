import { createProfile } from "@/lib/actions/profiles";
import { createStreak } from "@/lib/actions/streaks";
import { NextResponse } from "next/server";

//ON USER CREATION FROM CLERK
//CREATE THEIR FIRST STREAK
export async function POST(req: Request) {
  const body = await req.json();
  const userId = body.data.id;
  const eventType = body.type as string;

  if (eventType === "user.created") {
    const profilePromise = createProfile(userId);
    const streakPromise = createStreak(userId);
    const [profile, streak] = await Promise.all([
      profilePromise,
      streakPromise,
    ]);

    return new NextResponse(JSON.stringify({ profile, streak }), {
      status: 200,
    });
  }

  return new NextResponse(JSON.stringify({}), {
    status: 200,
  });
}
