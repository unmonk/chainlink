import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const users = await clerkClient.users.getUserList({
    query: query || "",
    limit: 10,
  })

  return NextResponse.json({ users })
}
