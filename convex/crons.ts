import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Scoreboards for all active leagues",
  { minutes: 2 }, // every minute
  internal.scoreboards.scoreboards
);

crons.daily(
  "Schedules to Matchups for all active leagues",
  { hourUTC: 10, minuteUTC: 0 }, // 10:00 UTC, Midnight HST
  api.schedules.schedules
);

crons.monthly(
  "Monthly Campaign Finalization, Achievement Awards, and New Campaign Creation",
  { day: 1, hourUTC: 10, minuteUTC: 0 }, // 1st of the month at 10:00 UTC, Midnight HST
  internal.campaigns.createMonthlyCampaign
);

crons.monthly(
  "Record monthly statistics for all players",
  { day: 1, hourUTC: 9, minuteUTC: 45 }, // last day of the month at 11:45 PM HST
  internal.users.monthlyStatsRecord
);

export default crons;
