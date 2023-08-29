"use server";

import { getCronsList } from "./crons";
import { db } from "@/drizzle/db";
import { picks, squads } from "@/drizzle/schema";
import { clerkClient } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";

export async function getAdminDashboard() {
  const userCountPromise = clerkClient.users.getCount();
  const activePickCountPromise = db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(picks)
    .where(eq(picks.active, true));

  const totalSquadsPromise = db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(squads);

  const cronsPromise = getCronsList();

  const [userCount, activePicks, crons, squadsCount] = await Promise.all([
    userCountPromise,
    activePickCountPromise,
    cronsPromise,
    totalSquadsPromise,
  ]);

  const totalEPDs = crons.reduce((acc, cron) => acc + cron.epds_occupied, 0);
  const totalFailures = crons.reduce(
    (acc, cron) => acc + parseInt(cron.total_failures),
    0,
  );
  const totalSuccesses = crons.reduce(
    (acc, cron) => acc + parseInt(cron.total_successes),
    0,
  );

  return {
    users: userCount,
    activePicks: activePicks[0].count,
    squads: squadsCount[0].count,
    crons: {
      dailyJobs: totalEPDs,
      totalFailures,
      totalSuccesses,
    },
  };
}
