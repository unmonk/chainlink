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
  if (["NBA", "WNBA", "MBB", "WBB", "NBAS"].includes(league))
    return "basketball";
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

export const knownMatchupStatuses = [
  "STATUS_FINAL",
  "STATUS_FULL_TIME",
  "STATUS_FULL_PEN",
  "STATUS_IN_PROGRESS",
  "STATUS_END_PERIOD",
  "STATUS_SECOND_HALF",
  "STATUS_SHOOTOUT",
  "STATUS_END_OF_EXTRATIME",
  "STATUS_SCHEDULED",
  "STATUS_UNKNOWN",
] as const;

export type MatchupTypeDetails =
  | "GREATER_THAN"
  | "LESS_THAN"
  | "EQUAL"
  | "GREATER_THAN_EQUAL_TO"
  | "LESS_THAN_EQUAL_TO";

export type COSMETIC_ANIMATION =
  | "ripple"
  | "spiral"
  | "rotate-pulse"
  | "breathe"
  | "wobble"
  | "bounce-subtle"
  | "wave-pulse"
  | "pulse"
  | "gradient";

export type COSMETIC_STYLE =
  | "zenitho"
  | "velustro"
  | "venturo"
  | "xenon"
  | "tranquiluxe"
  | "lumiflex"
  | "novatrix"
  | "opulento"
  | "inferno"
  | "hip"
  | "mandala"
  | "hexagons"
  | "ocean"
  | "phantomstar"
  | "admin"
  | "mod"
  | "test";
