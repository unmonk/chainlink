import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { action, mutation, query, QueryCtx } from "./_generated/server";
import { League } from "./types";
import { api } from "./_generated/api";

////////////////////MATCHUP UTILS////////////////////
export function determineWinner(
  type: string,
  typeDetails: string | undefined,
  homeTeam: any,
  awayTeam: any
) {
  if (type === "SCORE" && typeDetails === "GREATER_THAN") {
    if (homeTeam.score === awayTeam.score) return "PUSH";
    return homeTeam.score > awayTeam.score ? homeTeam.id : awayTeam.id;
  }
  return null;
}

export function determineSpreadWinner(
  type: string,
  typeDetails: string | undefined,
  homeTeam: any,
  awayTeam: any,
  metadata: {
    overUnder?: number;
    spread?: number;
  }
) {
  if (type === "SPREAD") {
    if (!metadata.spread) return null;
    if (homeTeam.score + metadata.spread > awayTeam.score) {
      return homeTeam.id;
    }
    if (homeTeam.score + metadata.spread < awayTeam.score) {
      return awayTeam.id;
    }
    return "PUSH";
  }
  return null;
}

export function determineCustomScoreWinner(
  type: string,
  typeDetails: string | undefined,
  homeTeam: any,
  awayTeam: any,
  metadata: {
    homeCustomScoreType?: string;
    awayCustomScoreType?: string;
    homeWinBy?: number;
    awayWinBy?: number;
  }
) {
  if (type === "CUSTOM_SCORE") {
    if (!metadata.homeCustomScoreType || !metadata.awayCustomScoreType)
      return null;
    const homeWinCondition = metadata.homeCustomScoreType;
    const awayWinCondition = metadata.awayCustomScoreType;
    const homeWinBy = metadata.homeWinBy;
    const awayWinBy = metadata.awayWinBy;

    //HOME WIN BY X - AWAY WIN/DRAW LOSE BY X

    if (
      homeWinCondition === "WINBYXPLUS" &&
      awayWinCondition === "WINDRAWLOSEBYX"
    ) {
      if (!homeWinBy || !awayWinBy) return null;
      if (homeTeam.score - awayTeam.score >= homeWinBy) {
        return homeTeam.id;
      }
      if (awayTeam.score > homeTeam.score) {
        return awayTeam.id;
      }
      if (Math.abs(awayTeam.score - homeTeam.score) === awayWinBy) {
        return awayTeam.id;
      }
      if (awayTeam.score === homeTeam.score) {
        return awayTeam.id;
      }
      return "PUSH";
    }

    //AWAY WIN BY X - HOME WIN/DRAW LOSE BY X
    if (
      homeWinCondition === "WINDRAWLOSEBYX" &&
      awayWinCondition === "WINBYXPLUS"
    ) {
      if (!homeWinBy || !awayWinBy) return null;
      if (awayTeam.score - homeTeam.score >= awayWinBy) {
        return awayTeam.id;
      }
      if (homeTeam.score > awayTeam.score) {
        return homeTeam.id;
      }
      if (Math.abs(homeTeam.score - awayTeam.score) === homeWinBy) {
        return homeTeam.id;
      }
      if (awayTeam.score === homeTeam.score) {
        return homeTeam.id;
      }
      return "PUSH";
    }

    //HOME WIN BY X - AWAY WIN

    if (homeWinCondition === "WINBYXPLUS" && awayWinCondition === "WIN") {
      if (!homeWinBy) return null;
      if (homeTeam.score - awayTeam.score >= homeWinBy) {
        return homeTeam.id;
      }
      if (awayTeam.score > homeTeam.score) {
        return awayTeam.id;
      }
      return "PUSH";
    }

    //HOME WIN - AWAY WIN BY X
    if (homeWinCondition === "WIN" && awayWinCondition === "WINBYXPLUS") {
      if (!awayWinBy) return null;
      if (awayTeam.score - homeTeam.score >= awayWinBy) {
        return awayTeam.id;
      }
      if (homeTeam.score > awayTeam.score) {
        return homeTeam.id;
      }
      return "PUSH";
    }
  }
  return null;
}

export const matchupReward = (cost: number, featured: boolean) => {
  if (featured) {
    return cost * 3 > 0 ? cost * 3 : 30;
  } else {
    return cost * 2 > 0 ? cost * 2 : 10;
  }
};

export const MATCHUP_FINAL_STATUSES = [
  "STATUS_FINAL",
  "STATUS_FULL_TIME",
  "STATUS_FULL_PEN",
  "STATUS_FINAL_AET",
  "STATUS_FINAL_ET",
  "STATUS_FINAL_OT",
  "STATUS_FORFEIT",
];

export const MATCHUP_IN_PROGRESS_STATUSES = [
  "STATUS_IN_PROGRESS",
  "STATUS_FIRST_HALF",
  "STATUS_SECOND_HALF",
  "STATUS_HALFTIME",
  "STATUS_END_PERIOD",
  "STATUS_SHOOTOUT",
  "STATUS_END_OF_EXTRATIME",
  "STATUS_IN_PROGRESS_PEN",
  "STATUS_IN_PROGRESS_ET",
  "STATUS_OVERTIME",
  "STATUS_IN_PROGRESS_PEN_ET",
];

export const MATCHUP_DELAYED_STATUSES = [
  "STATUS_DELAYED",
  "STATUS_RAIN_DELAY",
  "STATUS_DELAY",
];
export const MATCHUP_POSTPONED_STATUSES = [
  "STATUS_POSTPONED",
  "STATUS_CANCELED",
  "STATUS_SUSPENDED",
  "STATUS_ABANDONDED",
];
export const MATCHUP_SCHEDULED_STATUSES = ["STATUS_SCHEDULED"];
export const MATCHUP_UNKNOWN_STATUSES = ["STATUS_UNKNOWN"];

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

////////////////////UTILS////////////////////

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

export const deduplicateMatchups = mutation({
  args: {
    league: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all matchups for league
    const matchups = await ctx.db
      .query("matchups")
      .withIndex("by_active_league", (q) => q.eq("league", args.league))
      .collect();

    // Group matchups by gameId
    const matchupsByGameId = new Map<string, Doc<"matchups">[]>();

    for (const matchup of matchups) {
      if (!matchupsByGameId.has(matchup.gameId)) {
        matchupsByGameId.set(matchup.gameId, []);
      }
      matchupsByGameId.get(matchup.gameId)!.push(matchup);
    }

    // Find gameIds with more than one matchup
    const duplicatesToDelete: Id<"matchups">[] = [];

    for (const [gameId, matchupList] of Array.from(
      matchupsByGameId.entries()
    )) {
      if (matchupList.length > 1) {
        // Sort by creation time to keep the newest one (last created)
        matchupList.sort(
          (a: Doc<"matchups">, b: Doc<"matchups">) =>
            b._creationTime - a._creationTime
        );

        // Keep the first one (oldest), delete the rest
        const toDelete = matchupList.slice(1);
        duplicatesToDelete.push(
          ...toDelete.map((matchup: Doc<"matchups">) => matchup._id)
        );
      }
    }

    // Delete the duplicate matchups
    for (const matchupId of duplicatesToDelete) {
      await ctx.db.delete(matchupId);
    }

    return {
      totalMatchups: matchups.length,
      duplicatesFound: duplicatesToDelete.length,
      deletedMatchups: duplicatesToDelete.length,
      remainingMatchups: matchups.length - duplicatesToDelete.length,
    };
  },
});

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

export function deploymentName() {
  const url = process.env.CONVEX_CLOUD_URL;
  if (!url) return undefined;
  const regex = new RegExp("https://(.+).convex.cloud");
  return regex.exec(url)?.[1];
}

////////////////////STORAGE UTILS////////////////////

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

////////////////////USER UTILS////////////////////
export async function getAuthenticatedUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
  if (!user) throw new Error("User not found");

  return { identity, user };
}

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

export function initializeExpTable(): number[] {
  const n: number[] = new Array(201).fill(0);

  // Initialize base values with steady progression
  n[1] = 30;
  n[2] = n[1] + 38; // 68
  n[3] = n[2] + 46; // 114
  n[4] = n[3] + 70; // 184
  n[5] = n[4] + 86; // 270
  n[6] = n[5] + 474; // 744
  n[7] = n[6] + 376; // 1120
  n[8] = n[7] + 560; // 1680
  n[9] = n[8] + 804; // 2484

  // Calculate levels 10-14 with 1.1 multiplier
  for (let i = 10; i <= 14; i++) {
    n[i] = Math.round(n[i - 1] * 1.1);
  }

  // Calculate levels 15-29 with 1.2 multiplier
  for (let i = 15; i <= 29; i++) {
    n[i] = Math.round(n[i - 1] * 1.2);
  }

  // Calculate levels 30-34 with 1.15 multiplier
  for (let i = 30; i <= 34; i++) {
    n[i] = Math.round(n[i - 1] * 1.15);
  }

  // Calculate levels 35-39 with 1.2 multiplier
  for (let i = 35; i <= 39; i++) {
    n[i] = Math.round(n[i - 1] * 1.2);
  }

  // Calculate levels 40-69 with 1.08 multiplier
  for (let i = 40; i <= 69; i++) {
    n[i] = Math.round(n[i - 1] * 1.08);
  }

  // Calculate levels 70-74 with 1.06 multiplier
  for (let i = 70; i <= 74; i++) {
    n[i] = Math.round(n[i - 1] * 1.06);
  }

  // Calculate levels 75-119 with 1.07 multiplier
  for (let i = 75; i <= 119; i++) {
    n[i] = Math.round(n[i - 1] * 1.07);
  }

  // Calculate levels 120-124 with 1.05 multiplier
  for (let i = 120; i <= 124; i++) {
    n[i] = Math.round(n[i - 1] * 1.05);
  }

  // Calculate levels 125-159 with 1.07 multiplier
  for (let i = 125; i <= 159; i++) {
    n[i] = Math.round(n[i - 1] * 1.07);
  }

  // Calculate levels 160-199 with 1.06 multiplier
  for (let i = 160; i <= 199; i++) {
    n[i] = Math.round(n[i - 1] * 1.06);
  }

  n[200] = Math.round(n[199] * 1.1); // Final level
  return n;
}

export function calculateSquadLevel(totalExperience: number): {
  rank: number;
  score: number;
  nextRankScore: number;
} {
  const expTable = initializeExpTable();

  // Find the current level
  let level = 1;
  for (let i = 1; i < expTable.length; i++) {
    if (totalExperience >= expTable[i]) {
      level = i;
    } else {
      break;
    }
  }

  const currentLevelExp = expTable[level];
  const nextLevelExp = expTable[level + 1];

  return {
    rank: level,
    score: totalExperience,
    nextRankScore: nextLevelExp,
  };
}

// Calculate experience from squad activities
export function calculateSquadScore(squad: {
  stats: {
    wins: number;
    losses: number;
    pushes: number;
    coins: number;
  };
}): number {
  // Base experience calculations
  const winExp = squad.stats.wins * 100; // 100 XP per win
  const pushExp = squad.stats.pushes * 25; // 25 XP per push
  const coinExp = Math.floor(squad.stats.coins / 10); // 1 XP per 10 coins

  return winExp + pushExp + coinExp;
}
