import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Scoreboards for all active leagues",
  { minutes: 2 }, // every minute
  api.scoreboards.scoreboards
);

crons.daily(
  "Schedules to Matchups for all active leagues",
  { hourUTC: 10, minuteUTC: 0 }, // 10:00 UTC, Midnight HST
  api.schedules.schedules
);

// Weekly pickem advancement - Tuesday 2am Hawaii time (12pm UTC)
crons.weekly(
  "Advance pickem campaigns to next week and activate matchups",
  {
    dayOfWeek: "tuesday",
    hourUTC: 12,
    minuteUTC: 0,
  }, // Tuesday 12:00 UTC = Tuesday 2:00 AM HST
  internal.pickem.advancePickemWeek,
  {}
);

crons.monthly(
  "Monthly Campaign Finalization, Achievement Awards, and New Campaign Creation",
  { day: 1, hourUTC: 10, minuteUTC: 0 }, // 1st of the month at 10:00 UTC, Midnight HST
  internal.campaigns.createMonthlyCampaign,
  { dryRun: false }
);

crons.monthly(
  "Record monthly statistics for all players",
  { day: 1, hourUTC: 9, minuteUTC: 45 }, // last day of the month at 11:45 PM HST
  internal.users.monthlyStatsRecord,
  { dryRun: false }
);

crons.daily(
  "Daily Pick Reminder Notification",
  { hourUTC: 12, minuteUTC: 0 }, // 12:00 PM UTC
  api.notifications.sendDailyPickReminder
);

export default crons;
