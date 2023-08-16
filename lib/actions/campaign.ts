"use server";

import { db } from "@/drizzle/db";
import { campaigns } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getActiveCampaign() {
  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.active, true),
  });
  return campaign;
}

export async function getActiveCampaignId() {
  const campaign = await db
    .select({
      id: campaigns.id,
    })
    .from(campaigns)
    .where(eq(campaigns.active, true))
    .limit(1);

  return campaign[0].id;
}
