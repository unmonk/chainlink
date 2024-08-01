import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Scoreboards for all active leagues",
  { minutes: 2 }, // every minute
  internal.scoreboards.scoreboards
);

crons.daily(
  "Schedules to Matchups for all active leagues",
  { hourUTC: 10, minuteUTC: 0 }, // 10:00 UTC, Midnight HST
  internal.schedules.schedules
);

crons.monthly(
  "Monthly Campaign Finalization, Achievement Awards, and New Campaign Creation",
  { day: 1, hourUTC: 10, minuteUTC: 0 }, // 1st of the month at 10:00 UTC, Midnight HST
  internal.campaigns.createMonthlyCampaign
);

export default crons;
