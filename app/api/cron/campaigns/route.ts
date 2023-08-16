import { db } from "@/drizzle/db";
import { NewCampaign, campaigns } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // const cronSecret = request.headers.get("x-merc-cron-secret");
  // if (cronSecret !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ status: 401, message: "Unauthorized" });
  // }
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const nextMonth = new Date();
  let year = nextMonth.getFullYear();

  const month = nextMonth.toLocaleString("en-US", { month: "long" });

  const startTimeOfMonth = new Date(year, nextMonth.getMonth(), 1);
  const endTimeOfMonth = new Date(year, nextMonth.getMonth() + 1, 0);

  const campaign: NewCampaign = {
    name: `${month} ${year} Streak Campaign`,
    start_date: startTimeOfMonth,
    end_date: endTimeOfMonth,
    created_by: "SYSTEM",
    active: true,
  };

  const response = await db.insert(campaigns).values(campaign);

  return NextResponse.json(response, { status: 200 });
}

export const revalidate = 0;
