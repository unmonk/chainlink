import { League } from "./types";

export function missingEnvVariableUrl(envVarName: string, whereToGet: string) {
  const deployment = deploymentName();
  if (!deployment) return `Missing ${envVarName} in environment variables.`;
  return (
    `\n  Missing ${envVarName} in environment variables.\n\n` +
    `  Get it from ${whereToGet} .\n  Paste it on the Convex dashboard:\n` +
    `  https://dashboard.convex.dev/d/${deployment}/settings?var=${envVarName}`
  );
}

export function deploymentName() {
  const url = process.env.CONVEX_CLOUD_URL;
  if (!url) return undefined;
  const regex = new RegExp("https://(.+).convex.cloud");
  return regex.exec(url)?.[1];
}

export const ACTIVE_LEAGUES: League[] = [
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  //   "COLLEGE-FOOTBALL",
  "MBB",
  "WBB",
  "WNBA",
  "MLS",
  "UFL",
];
export const STATS_BY_LEAGUE = {
  NBA: {
    rebounts: "Rebounds",
    assists: "Assists",
    fieldGoalsAttempted: "Field Goals Attempted",
    fieldGoalsMade: "Field Goals Made",
    fieldGoalPct: "Field Goal Percentage",
    freeThrowPct: "Free Throw Percentage",
    freeThrowsAttempted: "Free Throws Attempted",
    freeThrowsMade: "Free Throws Made",
    threePointsPct: "Three Points Percentage",
    threePointFieldGoalsAttempted: "Three Point Field Goals Attempted",
    threePointFieldGoalsMade: "Three Point Field Goals Made",
  },
  NFL: false,
  MLB: false,
  NHL: false,
  "COLLEGE-FOOTBALL": false,
  MBB: false,
  WBB: false,
  WNBA: false,
  MLS: false,
  UFL: false,
};

export function getHawaiiTime() {
  //get the date in pacific time zone in yyyymmdd format
  // Create a new Date object
  const currentDate = new Date();

  // Get the UTC time in milliseconds
  const utcTime = currentDate.getTime();

  // Define the offset for Hawaii time zone (UTC-10)
  const hawaiiOffset = -10 * 60 * 60 * 1000;

  // Calculate the Hawaii time by adding the offset
  const hawaiiTime = new Date(utcTime + hawaiiOffset);

  // Format the date as YYYYMMDD
  const date = hawaiiTime.toISOString().slice(0, 10).replace(/-/g, "");

  return date;
}
