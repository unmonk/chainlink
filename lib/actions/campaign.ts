"use server";

import { db } from "@/drizzle/db";
import { campaigns } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getActiveCampaign() {
  const campaign = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.active, true))
    .limit(1);

  if (campaign.length === 0) {
    return null;
  }

  return campaign[0];
}
