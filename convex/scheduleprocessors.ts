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

  // Get existing matchups for THIS LEAGUE ONLY
  const existingMatchups = await getExistingMatchups(ctx, league);
  leagueResponse.matchupsFromDatabase = existingMatchups.length;

  // Create a league-scoped matchup tracker
  const matchupTracker = new LeagueMatchupTracker(league, existingMatchups);

  // Process each endpoint
  for (const endpoint of endpoints) {
    const scheduleData = await fetchScheduleData(endpoint, league);
    if (!scheduleData) {
      leagueResponse.error = `No schedule found for ${league}`;
      continue;
    }

    const results = await processScheduleWithTracker(
      ctx,
      scheduleData,
      matchupTracker,
      league,
      leagueResponse
    );

    leagueResponse = { ...leagueResponse, ...results };
  }

  return leagueResponse;
}

export async function getExistingMatchups(ctx: ActionCtx, league: League) {
  const matchupsFromDatabase = await ctx.runQuery(
    api.matchups.getAllMatchupsByLeagueForSchedule, // Changed from getMatchupsByLeague
    {
      league: league,
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

  // Handle old API format with deduplication
  const scheduleResponse = data as ScheduleResponse;
  const rawSchedule = scheduleResponse.content.schedule;

  // Deduplicate games by gameId across all days
  const seenGameIds = new Set<string>();
  const deduplicatedSchedule: Schedule = {};

  for (const day in rawSchedule) {
    const games = rawSchedule[day].games;
    if (!games) continue;

    const uniqueGames = games.filter((game) => {
      if (seenGameIds.has(game.id)) {
        return false; // Skip duplicate
      }
      seenGameIds.add(game.id);
      return true; // Keep unique game
    });

    if (uniqueGames.length > 0) {
      deduplicatedSchedule[day] = {
        ...rawSchedule[day],
        games: uniqueGames,
      };
    }
  }

  return deduplicatedSchedule;
}

export async function processScheduleWithTracker(
  ctx: ActionCtx,
  scheduleData: Schedule,
  matchupTracker: LeagueMatchupTracker,
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
      const gameId = game.id;

      // Skip if already processed in this run
      if (matchupTracker.isProcessed(gameId)) {
        console.log(`Skipping already processed game: ${gameId}`);
        continue;
      }

      // Mark as processed
      matchupTracker.markAsProcessed(gameId);

      // Increment total games counter
      leagueResponse.gamesOnSchedule++;

      // Handle existing matchups for this game
      if (matchupTracker.hasMatchup(gameId)) {
        // Increment existing matchups counter
        leagueResponse.existingMatchups++;

        // Clean up any existing duplicates
        const existingMatchups = matchupTracker.getExistingMatchups(gameId);
        if (existingMatchups.length > 1) {
          console.log(
            `Found ${existingMatchups.length} duplicates for gameId: ${gameId} for league: ${league}`
          );

          // Sort by priority: inactive matchups first (admin decisions), then by creation time
          const sortedMatchups = existingMatchups.sort((a, b) => {
            // If one is inactive and the other is active, keep the inactive one
            if (a.active !== b.active) {
              return a.active ? 1 : -1; // inactive first
            }
            // If both have same active status, keep the oldest
            return a._creationTime - b._creationTime;
          });

          // Keep first (highest priority), delete rest
          for (let i = 1; i < sortedMatchups.length; i++) {
            await ctx.runMutation(api.matchups.deleteMatchup, {
              matchupId: sortedMatchups[i]._id,
            });
          }

          // Update tracker to only keep the first one
          matchupTracker.updateExistingMatchups(gameId, [sortedMatchups[0]]);
        }
      }

      // Process the game and record the result
      const result = await processGameWithTracker(
        ctx,
        game,
        matchupTracker,
        league
      );

      leagueResponse.games.push({
        game: game.shortName,
        result: result.result,
      });
      leagueResponse.scoreMatchupsCreated += result.matchupsCreated || 0;
    }
  }

  return leagueResponse;
}
export async function processGameWithTracker(
  ctx: ActionCtx,
  game: Game,
  matchupTracker: LeagueMatchupTracker,
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

  const gameId = game.id;

  // Check if matchup already exists in this league (existing or newly created)
  if (matchupTracker.hasMatchup(gameId)) {
    const existingMatchups = matchupTracker.getExistingMatchups(gameId);

    if (existingMatchups.length > 0) {
      // Verify all existing matchups belong to this league
      const leagueMatchups = existingMatchups.filter(
        (m) => m.league === league
      );
      if (leagueMatchups.length !== existingMatchups.length) {
        console.warn(
          `Found ${existingMatchups.length - leagueMatchups.length} matchups with wrong league for gameId ${gameId}`
        );
      }

      // Update existing matchup
      const matchup = leagueMatchups[0];
      const { hasChanged, hasChangedDetails } = hasMatchupChanged(
        matchup,
        game
      );

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
    } else {
      // Newly created in this run, skip
      return {
        gameProcessed: false,
        result: "Already created in this run",
      };
    }
  }

  // Create new matchup for this league
  const matchupId = await createNewMatchupByType(ctx, game, league, "SCORE");

  if (matchupId) {
    // Mark as created to prevent duplicates within this league
    matchupTracker.markAsCreated(gameId);

    return {
      gameProcessed: true,
      matchupsCreated: 1,
      result: "New matchup created",
    };
  }

  return {
    gameProcessed: false,
    result: "Failed to create matchup",
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
        image: home.team.logo || "https://chainlink.st/icons/icon-256x256.png",
      },
      awayTeam: {
        id: away.id,
        name: away.team.name || "Away Team",
        score: 0,
        image: away.team.logo || "https://chainlink.st/icons/icon-256x256.png",
      },
      cost: 0,
      metadata: {
        network: competition.geoBroadcasts?.[0]?.media?.shortName || "N/A",
        overUnder: overUnder,
        spread: spread,
      },
    });
  }
}

class LeagueMatchupTracker {
  private league: string;
  private existingMatchups: Record<string, Doc<"matchups">[]>;
  private newlyCreatedMatchups: Set<string>; // Track gameIds of newly created matchups
  private processedGameIds: Set<string>; // Track all processed gameIds in this run

  constructor(league: string, existingMatchups: Doc<"matchups">[]) {
    this.league = league;
    this.existingMatchups = {};
    this.newlyCreatedMatchups = new Set();
    this.processedGameIds = new Set();

    // Build existing matchups lookup for this league only
    for (const matchup of existingMatchups) {
      // Double-check that the matchup belongs to this league
      if (matchup.league !== league) {
        console.warn(
          `Matchup ${matchup._id} has league ${matchup.league} but expected ${league}`
        );
        continue;
      }

      if (!this.existingMatchups[matchup.gameId]) {
        this.existingMatchups[matchup.gameId] = [];
      }
      this.existingMatchups[matchup.gameId].push(matchup);
    }
  }

  // Check if a gameId has any matchups in this league (existing or newly created)
  hasMatchup(gameId: string): boolean {
    return (
      this.existingMatchups[gameId]?.length > 0 ||
      this.newlyCreatedMatchups.has(gameId)
    );
  }

  // Get existing matchups for a gameId in this league
  getExistingMatchups(gameId: string): Doc<"matchups">[] {
    return this.existingMatchups[gameId] || [];
  }

  // Mark a gameId as having a newly created matchup in this league
  markAsCreated(gameId: string): void {
    this.newlyCreatedMatchups.add(gameId);
  }

  // Check if a gameId has already been processed in this run
  isProcessed(gameId: string): boolean {
    return this.processedGameIds.has(gameId);
  }

  // Mark a gameId as processed
  markAsProcessed(gameId: string): void {
    this.processedGameIds.add(gameId);
  }

  // Update existing matchups for a gameId (used after deduplication)
  updateExistingMatchups(gameId: string, matchups: Doc<"matchups">[]): void {
    this.existingMatchups[gameId] = matchups;
  }

  // Get all duplicate gameIds that need cleanup in this league
  getDuplicatesToCleanup(): string[] {
    const duplicates: string[] = [];

    // Check existing matchups for duplicates within this league
    for (const [gameId, matchups] of Object.entries(this.existingMatchups)) {
      if (matchups.length > 1) {
        duplicates.push(gameId);
      }
    }

    return duplicates;
  }

  // Clean up duplicates within this league (prioritize admin decisions)
  async cleanupDuplicates(ctx: ActionCtx): Promise<number> {
    let deletedCount = 0;

    for (const [gameId, matchups] of Object.entries(this.existingMatchups)) {
      if (matchups.length > 1) {
        // Sort by priority: inactive matchups first (admin decisions), then by creation time
        const sortedMatchups = matchups.sort((a, b) => {
          // If one is inactive and the other is active, keep the inactive one
          if (a.active !== b.active) {
            return a.active ? 1 : -1; // inactive first
          }
          // If both have same active status, keep the oldest
          return a._creationTime - b._creationTime;
        });

        const toDelete = sortedMatchups.slice(1); // Keep first (highest priority), delete rest

        for (const matchup of toDelete) {
          await ctx.runMutation(api.matchups.deleteMatchup, {
            matchupId: matchup._id,
          });
          deletedCount++;
        }

        // Update our tracking to only keep the first one
        this.existingMatchups[gameId] = [sortedMatchups[0]];
      }
    }

    return deletedCount;
  }

  // Update the tracker when a matchup is updated
  updateMatchupInTracker(
    gameId: string,
    updatedMatchup: Doc<"matchups">
  ): void {
    if (this.existingMatchups[gameId]) {
      // Update the first matchup in the array with the new data
      this.existingMatchups[gameId][0] = updatedMatchup;
    }
  }

  // Get the most recent matchup data for a gameId
  getMostRecentMatchup(gameId: string): Doc<"matchups"> | null {
    const existing = this.existingMatchups[gameId];
    if (existing && existing.length > 0) {
      return existing[0];
    }
    return null;
  }

  // Get statistics for this league
  getStats() {
    return {
      league: this.league,
      existingMatchups: Object.keys(this.existingMatchups).length,
      newlyCreated: this.newlyCreatedMatchups.size,
      processed: this.processedGameIds.size,
      duplicates: this.getDuplicatesToCleanup().length,
    };
  }
}
