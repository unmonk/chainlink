import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { action, mutation, query } from "./_generated/server";
import { League } from "./types";
import { api } from "./_generated/api";

export const ACTIVE_LEAGUES: League[] = [
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  "COLLEGE-FOOTBALL",
  "MBB",
  "WBB",
  "WNBA",
  "MLS",
  "NWSL",
  "EPL",
  "UFL",
  "ARG",
  "TUR",
  "FRIENDLY",
  "CSL",
  "RPL",
];

export interface ScheduledMessage {
  _id: string;
  _creationTime: number;
  name: string;
  scheduledTime: number;
  completedTime?: number;
  state: {
    kind: string;
  };
  args: any[];
}

export const fixPreviousQuizResponses = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Get all quiz responses
    const quizResponses = await ctx.db.query("quizResponses").collect();

    for (const response of quizResponses) {
      // Get the associated quiz
      const quiz = await ctx.db.get(response.quizId);
      if (!quiz) continue;

      // Update win status based on selected option matching correct answer
      await ctx.db.patch(response._id, {
        win: response.selectedOptionId === quiz.correctAnswerId,
      });
    }
  },
});

export const fixPreviousPicks = mutation({
  args: {},
  handler: async (ctx, args) => {
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) =>
        q.eq("matchupId", "kd7emz7fq5fp87mx8qfyx0v33d73r4qs" as Id<"matchups">)
      )
      .collect();

    console.log(picks.length);

    for (const pick of picks) {
      await ctx.db.patch(pick._id, {
        matchupId: "kd7a0zjrt9fjvbrq2grte05ve973r9qk" as Id<"matchups">,
        status: "STATUS_UNKNOWN",
        active: false,
      });
    }
  },
});

export const getScheduledMessages = action({
  args: {},
  handler: async (ctx, args): Promise<ScheduledMessage[]> => {
    return await ctx.runQuery(api.utils.listScheduledMessages);
  },
});

export const listScheduledMessages = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.system
      .query("_scheduled_functions")
      .order("desc")
      .take(20);
  },
});

export const getScheduledMessage = query({
  args: {
    id: v.id("_scheduled_functions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.system.get(args.id);
  },
});

export const cancelMessage = mutation({
  args: {
    id: v.id("_scheduled_functions"),
  },
  handler: async (ctx, args) => {
    await ctx.scheduler.cancel(args.id);
  },
});

export function missingEnvVariableUrl(envVarName: string, whereToGet: string) {
  const deployment = deploymentName();
  if (!deployment) return `Missing ${envVarName} in environment variables.`;
  return (
    `\n  Missing ${envVarName} in environment variables.\n\n` +
    `  Get it from ${whereToGet} .\n  Paste it on the Convex dashboard:\n` +
    `  https://dashboard.convex.dev/d/${deployment}/settings?var=${envVarName}`
  );
}

export const queryImageUrl = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const getImageUrl = new URL(
      `${process.env.NEXT_PUBLIC_CONVEX_URL}/getImage`
    );
    getImageUrl.searchParams.set("storageId", args.storageId);
    return getImageUrl.href;
  },
});

export function getImageUrl(storageId: string) {
  const getImageUrl = new URL(`${process.env.NEXT_PUBLIC_CONVEX_URL}/getImage`);
  getImageUrl.searchParams.set("storageId", storageId);
  return getImageUrl.href;
}

export const removeImageFromStorage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});

export interface UserMonthlyStats {
  [key: string]: {
    wins: number;
    losses: number;
    pushes: number;
    winRate: number;
    totalGames: number;
    coins: number;
    statsByLeague: {
      [key: string]: {
        wins: number;
        losses: number;
        pushes: number;
      };
    };
  };
}

export function deploymentName() {
  const url = process.env.CONVEX_CLOUD_URL;
  if (!url) return undefined;
  const regex = new RegExp("https://(.+).convex.cloud");
  return regex.exec(url)?.[1];
}

export const matchupReward = (cost: number, featured: boolean) => {
  if (featured) {
    return cost * 3 > 0 ? cost * 3 : 30;
  } else {
    return cost * 2 > 0 ? cost * 2 : 10;
  }
};

export const leagueLogos: {
  [key: string]: string;
} = {
  NFL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png?w=100&h=100&transparent=true",
  NBA: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png?w=100&h=100&transparent=true",
  NBAG: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba_gleague.png&w=100&h=100",

  MLB: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mlb.png?w=100&h=100&transparent=true",
  NHL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nhl.png?w=100&h=100&transparent=true",
  "COLLEGE-FOOTBALL":
    "https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-football-college.png&h=80&w=80&scale=crop&cquality=40&transparent=true",
  MBB: "https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-basketball.png&h=80&w=80&scale=crop&cquality=40&transparent=true",
  WBB: "https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-basketball.png&h=80&w=80&scale=crop&cquality=40&transparent=true",
  WNBA: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/wnba.png?w=100&h=100&transparent=true",
  MLS: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mls.png?w=100&h=100&transparent=true",
  NWSL: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2323.png&transparent=true&w=100&h=100",
  ARG: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/1.png&transparent=true&w=100&h=100",
  CSL: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2350.png&transparent=true&w=100&h=100",
  FRIENDLY:
    "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/53.png&transparent=true&w=100&h=100",
  TUR: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/18.png&transparent=true&w=100&h=100",

  RPL: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/106.png&transparent=true&w=100&h=100",
  PLL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/pll.png?w=100&h=100&transparent=true",
  EPL: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/23.png&transparent=true&w=100&h=100",
  UFL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/ufl.png?w=100&h=100&transparent=true",
};

export const leagueNames: {
  [key: string]: string;
} = {
  NFL: "NFL",
  NBA: "NBA",
  MLB: "MLB",
  NHL: "NHL",
  "COLLEGE-FOOTBALL": "College Football",
  MBB: "Men's College Basketball",
  WBB: "Women's College Basketball",
  WNBA: "WNBA",
  MLS: "MLS",
  NWSL: "National Womans Soccer League",
  PLL: "Premier Lacross League",
  EPL: "Premier League",
  UFL: "UFL",
  RPL: "Russian Premier League",
  ARG: "Argentine Liga Profesional",
  CSL: "Chinese Super League",
  NBAG: "G League",
  FRIENDLY: "Intertional Friendly",
  TUR: "Turkish Super Lig",
};

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
  NWSL: false,
  EPL: false,
  PLL: false,
  UFL: false,
  ARG: false,
  NBAG: false,
  FRIENDLY: false,
  TUR: false,
  CSL: false,
  RPL: false,
};

export const getLeagueColor = (league: string): string => {
  switch (league) {
    case "NFL":
      return "hsla(0, 78%, 34%, 1)"; // Red
    case "COLLEGE-FOOTBALL":
      return "hsla(0, 78%, 50%, 1)"; // Red
    case "NBA":
      return "hsla(15, 78%, 50%, 1)"; // Orange
    case "MBB":
      return "hsla(15, 78%, 70%, 1)"; //Light Orange
    case "WNBA":
      return "hsla(15, 78%, 60%, 1)"; // Orange
    case "WBB":
      return "hsla(320, 78%, 63%, 1)"; //Light Pink
    case "MLB":
      return "hsla(229, 78%, 38%, 1)"; // Blue
    case "NHL":
      return "hsla(0, 0%, 40%, 1)"; // grey
    case "MLS":
      return "hsla(115, 78%, 44%, 1)"; //Green
    case "NWSL":
      return "hsla(115, 78%, 30%, 1)"; //Green
    case "EPL":
      return "hsla(115, 78%, 20%, 1)"; //Green
    case "UFL":
      return "hsla(0, 78%, 56%, 1)"; // Red
    case "ARG":
      return "hsla(115, 78%, 550%, 1)"; //Green
    case "TUR":
      return "hsla(115, 78%, 60%, 1)"; //Green
    case "RPL":
      return "hsla(115, 78%, 75%, 1)"; //Green
    default:
      return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  }
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

export const getSquadScore = (squad: Doc<"squads">) => {
  const winsContribution = 0.5 * squad.stats.wins;
  const pushContribution = 0.2 * squad.stats.pushes;
  const lossContribution = 0.2 * squad.stats.losses;
  const coinsContribution = 0.1 * squad.stats.coins;
  return (
    Math.ceil(
      winsContribution + pushContribution + lossContribution + coinsContribution
    ) * 1000
  );
};
