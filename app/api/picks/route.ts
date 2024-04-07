import { db } from "@/drizzle/db"
import { picks } from "@/drizzle/schema"
import { auth } from "@clerk/nextjs"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse(JSON.stringify("Unauthorized"), { status: 403 })
    }
    const activePick = await db.query.picks.findFirst({
      where: and(eq(picks.user_id, userId), eq(picks.active, true)),
      with: {
        matchup: true,
      },
    })
    if (!activePick) {
      return new NextResponse("Not found", { status: 404 })
    }
    return NextResponse.json(activePick, { status: 200 })
  } catch (error) {
    console.log("[ACTIVE_PICK_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
