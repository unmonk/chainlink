import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { ActionCtx } from "./_generated/server";
import {
  Game,
  Schedule,
  ScheduleResponse,
  ScoreboardScheduleResponse,
} from "./espn";
import { getScheduleEndpoints } from "./schedules";
import { MatchupType } from "./schema";
import { League } from "./types";
import { STATS_BY_LEAGUE } from "./utils";

export interface LeagueResponse {
  scoreMatchupsCreated: number;
  statMatchupsCreated: number;
  matchupsFromDatabase: number;
  matchupsFromEspn: number;
  existingMatchups: number;
  matchupsUpdated: number;
  gamesOnSchedule: number;
  games: { game: string; result: string; details?: string }[];
  error: string;
}

export interface ProcessGameResult {
  gameProcessed: boolean;
  matchupsCreated?: number;
  result: string;
  details?: string;
}

export async function processLeague(
  ctx: ActionCtx,
  league: League
): Promise<LeagueResponse> {
  let leagueResponse = initializeLeagueResponse();

  const endpoints = getScheduleEndpoints(league);
  if (!endpoints) {
    leagueResponse.error = `No endpoints found for ${league}`;
    return leagueResponse;
  }

  for (const endpoint of endpoints) {
    const scheduleData = await fetchScheduleData(endpoint, league);
    if (!scheduleData) {
      leagueResponse.error = `No schedule found for ${league}`;
      continue;
    }

    const existingMatchups = await getExistingMatchups(ctx, league);
    leagueResponse.matchupsFromDatabase = existingMatchups.length;

    const existingMatchupsRecord: Record<string, Doc<"matchups">[]> = {};
    for (const matchup of existingMatchups) {
      const existingMatchupsForGame =
        existingMatchupsRecord[matchup.gameId] || [];

      existingMatchupsForGame.push(matchup);
      existingMatchupsRecord[matchup.gameId] = existingMatchupsForGame;
    }

    const results = await processSchedule(
      ctx,
      scheduleData,
      existingMatchupsRecord,
      league,
      leagueResponse
    );

    leagueResponse = { ...leagueResponse, ...results };
  }

  return leagueResponse;
}

export async function getExistingMatchups(ctx: ActionCtx, league: League) {
  const matchupsFromDatabase = await ctx.runQuery(
    api.matchups.getMatchupsByLeagueAndTime,
    {
      league: league,
      startTime: new Date().getTime(),
    }
  );
  return matchupsFromDatabase;
}

export async function fetchScheduleData(endpoint: string, league: League) {
  const response = await fetch(endpoint);
  const data = await response.json();

  const scheduleData: Schedule = {};

  if (league === "MBB" || league === "WBB") {
    const scoreboardData = data as ScoreboardScheduleResponse;

    for (const event of scoreboardData.events || []) {
      const date = event.date?.split("T")[0].replace(/-/g, "");
      if (!date) continue;
      scheduleData[date] = {
        games: scheduleData[date]?.games
          ? [...scheduleData[date].games, event as Game]
          : [event as Game],
        leagueName: scoreboardData.leagues[0].name || "",
        calendartype: "",
        label: "",
        seasonObj: {
          year: 0,
          type: 0,
          slug: "",
        },
      };
    }
    return scheduleData;
  }

  const scheduleResponse = data as ScheduleResponse;

  return scheduleResponse.content.schedule;
}

export async function processSchedule(
  ctx: ActionCtx,
  scheduleData: Schedule,
  existingMatchups: Record<string, Doc<"matchups">[]>,
  league: League,
  leagueResponse: LeagueResponse
): Promise<LeagueResponse> {
  // Iterate through each day in the schedule data
  for (const day in scheduleData) {
    const games = scheduleData[day].games;

    // Skip if no games exist for this day
    if (!games) continue;

    // Process each game for the current day
    for (const game of games) {
      // Increment total games counter
      leagueResponse.gamesOnSchedule++;
      const gameId = game.id;
      // Handle existing matchups for this game
      if (existingMatchups[gameId]) {
        // Increment existing matchups counter
        leagueResponse.existingMatchups++;

        // If multiple matchups exist for same game ID, delete duplicates
        if (existingMatchups[gameId].length > 1) {
          // Keep first matchup, delete all others
          for (let i = 1; i < existingMatchups[gameId].length; i++) {
            await ctx.runMutation(api.matchups.deleteMatchup, {
              matchupId: existingMatchups[gameId][i]._id,
            });
          }
        }

        // Update record to only keep the first non-deleted matchup
        existingMatchups[gameId] = existingMatchups[gameId].slice(0, 1);
      }

      // Process the game and record the result
      const result = await processGame(ctx, game, existingMatchups, league);
      leagueResponse.games.push({
        game: game.shortName,
        result: result.result,
      });
      leagueResponse.scoreMatchupsCreated += result.matchupsCreated || 0;
    }
  }

  return leagueResponse;
}

export async function processGame(
  ctx: ActionCtx,
  game: Game,
  existingMatchups: Record<string, Doc<"matchups">[]>,
  league: League
): Promise<ProcessGameResult> {
  // Validation checks
  const validationResult = isGameValid(game);
  if (!validationResult.valid) {
    return {
      gameProcessed: false,
      result: validationResult.result,
    };
  }

  // Process existing matchup
  if (existingMatchups[game.id]?.length > 0) {
    //check if needs to update
    const matchup = existingMatchups[game.id][0];
    const { hasChanged, hasChangedDetails } = hasMatchupChanged(matchup, game);
    if (hasChanged) {
      const competition = game.competitions[0];
      const competitors = competition.competitors;
      const home = competitors.find((c) => c.homeAway === "home");
      const away = competitors.find((c) => c.homeAway === "away");

      if (!home || !away) {
        return {
          gameProcessed: false,
          result: "Missing team information",
        };
      }

      const status =
        game.competitions[0].status?.type?.name || "STATUS_SCHEDULED";

      const overUnder = competition.odds?.[0]?.overUnder || undefined;
      const spread = competition.odds?.[0]?.spread || undefined;
      const pointSpread = {
        home:
          competition.odds?.[0]?.pointSpread?.home?.close?.line || undefined,
        away:
          competition.odds?.[0]?.pointSpread?.away?.close?.line || undefined,
      };

      await ctx.runMutation(internal.schedules.updateScheduledMatchup, {
        gameId: game.id,
        league: league,
        startTime: Date.parse(game.date),
        status: status,
        homeTeam: {
          id: home.id,
          name: home.team.name || "Home Team",
          score: 0,
          image:
            home.team.logo || "https://chainlink.st/icons/icon-256x256.png",
        },
        awayTeam: {
          id: away.id,
          name: away.team.name || "Away Team",
          score: 0,
          image:
            away.team.logo || "https://chainlink.st/icons/icon-256x256.png",
        },
        metadata: {
          ...matchup.metadata,
          overUnder: overUnder,
          spread: spread,
          statusDetails: competition.status?.type?.detail,
          network: competition.geoBroadcasts?.[0]?.media?.shortName || "N/A",
          pointSpread: pointSpread,
        },
      });
      return {
        gameProcessed: true,
        result: hasChangedDetails,
      };
    }
    return {
      gameProcessed: false,
      result: "No changes",
    };
  }

  // Create new matchups
  const matchupsCreated = await createNewMatchupByType(
    ctx,
    game,
    league,
    "SCORE"
  );
  return {
    gameProcessed: true,
    matchupsCreated: matchupsCreated ? 1 : 0,
    result: "New matchup created",
  };
}

export function initializeLeagueResponse(): LeagueResponse {
  return {
    scoreMatchupsCreated: 0,
    statMatchupsCreated: 0,
    matchupsFromDatabase: 0,
    matchupsFromEspn: 0,
    existingMatchups: 0,
    matchupsUpdated: 0,
    gamesOnSchedule: 0,
    games: [],
    error: "",
  };
}

function hasMatchupChanged(matchup: Doc<"matchups">, game: Game) {
  let hasChanged = false;
  let hasChangedDetails = `${game.shortName} - `;
  const competitionStatus = game.competitions[0].status?.type?.name;

  // Define in-progress statuses
  const inProgressStatuses = [
    "STATUS_DELAYED",
    "STATUS_RAIN_DELAY",
    "STATUS_FIRST_HALF",
    "STATUS_HALFTIME",
    "STATUS_SECOND_HALF",
    "STATUS_IN_PROGRESS",
    "STATUS_END_PERIOD",
    "STATUS_END_QUARTER",
    "STATUS_END_REGULATION",
    "STATUS_END_GAME",
    "STATUS_FINAL",
    "STATUS_FINAL_OVERTIME",
    "STATUS_FINAL_SHOOTOUT",
    "STATUS_FINAL_PENALTIES",
  ];

  // Don't allow updating from in-progress to scheduled
  if (
    inProgressStatuses.includes(matchup.status) &&
    competitionStatus === "STATUS_SCHEDULED"
  ) {
    return { hasChanged: false, hasChangedDetails: "" };
  }

  if (matchup.startTime !== Date.parse(game.date)) {
    hasChanged = true;
    hasChangedDetails += `startTime: ${matchup.startTime} -> ${Date.parse(
      game.date
    )} `;
  }

  if (matchup.status !== competitionStatus) {
    hasChanged = true;
    hasChangedDetails += `status: ${matchup.status} -> ${competitionStatus} `;
  }

  if (
    matchup.metadata?.overUnder !== game.competitions[0].odds?.[0]?.overUnder
  ) {
    hasChanged = true;
    hasChangedDetails += `overUnder: ${matchup.metadata?.overUnder} -> ${game.competitions[0].odds?.[0]?.overUnder} `;
  }

  if (matchup.metadata?.spread !== game.competitions[0].odds?.[0]?.spread) {
    hasChanged = true;
    hasChangedDetails += `spread: ${matchup.metadata?.spread} -> ${game.competitions[0].odds?.[0]?.spread} `;
  }
  if (
    matchup.metadata?.pointSpread?.home !==
    game.competitions[0].odds?.[0]?.pointSpread?.home?.close?.line
  ) {
    hasChanged = true;
    hasChangedDetails += `pointSpread: ${matchup.metadata?.pointSpread?.home} -> ${game.competitions[0].odds?.[0]?.pointSpread?.home?.close?.line} `;
  }
  if (
    matchup.metadata?.pointSpread?.away !==
    game.competitions[0].odds?.[0]?.pointSpread?.away?.close?.line
  ) {
    hasChanged = true;
    hasChangedDetails += `pointSpread: ${matchup.metadata?.pointSpread?.away} -> ${game.competitions[0].odds?.[0]?.pointSpread?.away?.close?.line} `;
  }

  return { hasChanged, hasChangedDetails: hasChanged ? hasChangedDetails : "" };
}

function isGameValid(game: Game) {
  const competitionStatus = game.competitions[0].status?.type?.name;
  const competitors = game.competitions[0].competitors;
  const home = competitors.find((c) => c.homeAway === "home");
  const away = competitors.find((c) => c.homeAway === "away");

  if (!competitionStatus)
    return {
      valid: false,
      result: "No competition status",
    };
  if (game.competitions.length === 0)
    return {
      valid: false,
      result: "No competitions",
    };
  if (game.competitions[0].competitors.length < 2)
    return {
      valid: false,
      result: "Not enough competitors",
    };
  if (home?.team.name === "TBD" || away?.team.name === "TBD")
    return {
      valid: false,
      result: "TBD team",
    };
  if (
    competitionStatus !== "STATUS_SCHEDULED" &&
    competitionStatus !== "STATUS_POSTPONED" &&
    competitionStatus !== "STATUS_DELAYED"
  )
    return {
      valid: false,
      result: "Game has already started",
    };
  if (!home || !away)
    return {
      valid: false,
      result: "No home or away team",
    };
  if (!home.id || !away.id)
    return {
      valid: false,
      result: "No home or away team ID",
    };

  return {
    valid: true,
    result: "",
  };
}

async function createNewMatchupByType(
  ctx: ActionCtx,
  game: Game,
  league: League,
  matchupType: MatchupType
) {
  if (matchupType === "SCORE") {
    const competition = game.competitions[0];
    const competitors = competition.competitors;
    const home = competitors.find((c) => c.homeAway === "home");
    const away = competitors.find((c) => c.homeAway === "away");
    if (!home || !away || !competition) return;

    const overUnder = competition.odds?.[0]?.overUnder || undefined;
    const spread = competition.odds?.[0]?.spread || undefined;
    const pointSpread = {
      home: competition.odds?.[0]?.pointSpread?.home?.close?.line || undefined,
      away: competition.odds?.[0]?.pointSpread?.away?.close?.line || undefined,
    };

    if (matchupType === "SCORE") {
      return await ctx.runMutation(internal.schedules.insertScoreMatchup, {
        startTime: Date.parse(game.date),
        active: true,
        featured: false,
        title: `Who will win? ${away.team.name} @ ${home.team.name}`,
        league: league,
        status: game.status.type?.name || "STATUS_SCHEDULED",
        gameId: game.id,
        homeTeam: {
          id: home.id,
          name: home.team.name || "Home Team",
          score: 0,
          image:
            home.team.logo || "https://chainlink.st/icons/icon-256x256.png",
        },
        awayTeam: {
          id: away.id,
          name: away.team.name || "Away Team",
          score: 0,
          image:
            away.team.logo || "https://chainlink.st/icons/icon-256x256.png",
        },
        cost: 0,
        metadata: {
          network: competition.geoBroadcasts?.[0]?.media?.shortName || "N/A",
          overUnder: overUnder,
          spread: spread,
          pointSpread: pointSpread,
        },
      });
    }

    if (matchupType === "STATS") {
      if (STATS_BY_LEAGUE[league]) {
        const stats = STATS_BY_LEAGUE[league] as Record<string, string>;
        for (const stat in stats) {
          const statFriendly = stats[stat];
          return await ctx.runMutation(internal.schedules.insertStatMatchup, {
            startTime: Date.parse(game.date),
            title: `Who will have more ${statFriendly}? ${home.team.name} @ ${away.team.name}`,
            league: league,
            status: game.status.type?.name || "STATUS_SCHEDULED",
            gameId: game.id,
            homeTeam: {
              id: home.id,
              name: home.team.name || "Home Team",
              score: 0,
              image:
                home.team.logo || "https://chainlink.st/icons/icon-256x256.png",
            },
            awayTeam: {
              id: away.id,
              name: away.team.name || "Away Team",
              score: 0,
              image:
                away.team.logo || "https://chainlink.st/icons/icon-256x256.png",
            },
            cost: 0,
            metadata: {
              network:
                competition.geoBroadcasts?.[0]?.media?.shortName || "N/A",
              statType: stat,
              overUnder: overUnder,
              spread: spread,
            },
          });
        }
      }
    }
  }
}
