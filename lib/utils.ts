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
  | "celestial"
  | "inferno"
  | "royal"
  | "ocean"
  | "forest"
  | "bronze"
  | "silver"
  | "gold"
  | "usa"
  | "galaxy"
  | "premium"
  | "admin"
  | "mod"
  | "test";

export const COSMETIC_STYLES: Record<
  COSMETIC_STYLE,
  {
    first: string;
    second: string;
    third: string;
    animation: COSMETIC_ANIMATION;
  }
> = {
  celestial: {
    first: "bg-indigo-500",
    second: "bg-purple-500",
    third: "bg-pink-500",
    animation: "rotate-pulse",
  },
  inferno: {
    first: "bg-yellow-500",
    second: "bg-orange-500",
    third: "bg-red-500",
    animation: "spiral",
  },

  royal: {
    first: "bg-gold",
    second: "bg-purple-500",
    third: "bg-indigo-500",
    animation: "rotate-pulse",
  },
  ocean: {
    first: "bg-cyan-500",
    second: "bg-blue-500",
    third: "bg-teal-500",
    animation: "breathe",
  },
  forest: {
    first: "bg-green-500",
    second: "bg-lime-500",
    third: "bg-white",
    animation: "rotate-pulse",
  },
  bronze: {
    first: "#B56E48",
    second: "#8B4513",
    third: "#CD7F32",
    animation: "rotate-pulse",
  },
  silver: {
    first: "#E8E8E8",
    second: "#A9A9A9",
    third: "#C0C0C0",
    animation: "rotate-pulse",
  },
  gold: {
    first: "#FFD700",
    second: "#DAA520",
    third: "#FFC125",
    animation: "rotate-pulse",
  },
  usa: {
    first: "bg-red-500",
    second: "bg-blue-500",
    third: "bg-white",
    animation: "spiral",
  },
  galaxy: {
    first: "bg-purple-600",
    second: "bg-blue-400",
    third: "bg-pink-500",
    animation: "wobble",
  },
  premium: {
    first: "bg-black",
    second: "bg-purple-500",
    third: "bg-black",
    animation: "bounce-subtle",
  },
  mod: {
    first: "bg-red-500",
    second: "bg-black",
    third: "bg-red-500",
    animation: "bounce-subtle",
  },
  admin: {
    first: "bg-lime-500",
    second: "bg-black",
    third: "bg-lime-500",
    animation: "bounce-subtle",
  },
  test: {
    first: "bg-lime-500",
    second: "bg-black",
    third: "bg-lime-500",
    animation: "ripple",
  },
} as const;

export function getColorValue(colorClass: string): string {
  const colorMap: Record<string, string> = {
    "bg-blue-500": "#3B82F6",
    "bg-green-500": "#22C55E",
    "bg-red-500": "#FF0000",
    "bg-yellow-500": "#FBBF24",
    "bg-purple-500": "#A855F7",
    "bg-pink-500": "#EC4899",
    "bg-gray-500": "#6B7280",
    "bg-indigo-500": "#6366F1",
    "bg-teal-500": "#14B8A6",
    "bg-orange-500": "#F97316",
    "bg-gold": "#FFD700",
    "bg-silver": "#E8E8E8",
    "bg-bronze": "#B56E48",
    "bg-black": "#000000",
    "bg-emerald-500": "#10B981",
    "bg-rose-500": "#F43F5E",
    "bg-amber-500": "#F59E0B",
    "bg-cyan-500": "#06B6D4",
    "bg-lime-500": "#84CC16",
    "bg-fuchsia-500": "#D946EF",
    "bg-white": "#FFFFFF",
    "bg-brown-500": "#8B4513",
  };

  const result = colorMap[colorClass] || colorClass;
  return result;
}
