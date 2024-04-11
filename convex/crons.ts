import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Scoreboards for all active leagues",
  { minutes: 1 }, // every minute
  internal.scoreboards.scoreboards
);

crons.daily(
  "Schedules to Matchups for all active leagues",
  { hourUTC: 10, minuteUTC: 0 }, // 10:00 UTC
  internal.schedules.schedules
);

export default crons;
