import { clerkClient } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await clerkClient().users.getUser(id);
  return NextResponse.json(user);
}
