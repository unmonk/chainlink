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
