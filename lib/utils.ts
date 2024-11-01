import { Doc } from "@/convex/_generated/dataModel";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }
  await navigator.serviceWorker.register("/serviceWorker.js");
}

export async function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }
  return navigator.serviceWorker.ready;
}
export const getSportFromLeague = (league: string): string => {
  if (["NBA", "WNBA", "MBB", "WBB"].includes(league)) return "basketball";
  if (["NFL", "COLLEGE-FOOTBALL", "UFL"].includes(league)) return "football";
  if (["MLB"].includes(league)) return "baseball";
  if (["NHL"].includes(league)) return "hockey";
  if (
    ["MLS", "NWSL", "EPL", "RPL", "CSL", "ARG", "TUR", "FRIENDLY"].includes(
      league
    )
  )
    return "soccer";
  if (["PLL"].includes(league)) return "lacrosse";

  return "other";
};

export const achievementTypes = [
  "CHAINWIN",
  "CHAINLOSS",
  "CHAINPUSH",
  "CAMPAIGNCHAIN",
  "CAMPAIGNWINS",
  "MONTHLYWIN",
  "MONTHLYLOSS",
  "MONTHLYPUSH",
  "WEEKLYWIN",
  "WEEKLYLOSS",
  "DAILYWIN",
  "DAILYLOSS",
  "WINS",
  "LOSS",
  "PUSH",
  "SQUADWIN",
  "SQUADLOSS",
  "REFERRAL",
  "COINS",
  "FRIENDS",
  "OTHER",
] as const;
