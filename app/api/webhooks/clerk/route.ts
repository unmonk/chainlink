import { createStreak } from "@/lib/actions/streaks";
import { NextResponse } from "next/server";

//ON USER CREATION FROM CLERK
//CREATE THEIR FIRST STREAK
export async function POST(req: Request) {
  const body = await req.json();
  const userId = body.data.id;
  await createStreak(userId);
  return new NextResponse(null, { status: 200 });
}
