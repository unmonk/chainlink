import { action, internalAction, internalMutation } from "./_generated/server";
import { MatchupType } from "./schema";
import {
  Game,
  Schedule,
  ScheduleResponse,
  ScoreboardScheduleResponse,
} from "./espn";
import { League } from "./types";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";
import { ACTIVE_LEAGUES, STATS_BY_LEAGUE } from "./utils";
import { Doc } from "./_generated/dataModel";
import { LeagueResponse, processLeague } from "./scheduleprocessors";

export const schedules2 = action({
  args: {},
  handler: async (ctx) => {
    let actionResponse: Record<string, LeagueResponse> = {};
    for (const league of ACTIVE_LEAGUES) {
      actionResponse[league] = await processLeague(ctx, league);
    }
    console.log(actionResponse);
    return actionResponse;
  },
});

export const schedules = action({
  args: {},
  handler: async (ctx) => {
    let actionResponse: Record<
      string,
      {
        error: string;
        gamesOnSchedule: number;
        matchupsFromDatabase: number;
        matchupsFromEspn: number;
        existingMatchups: number;
        scoreMatchupsCreated: number;
        statMatchupsCreated: number;
        matchupsUpdated: number;
        games: {
          game: string;
          result: string;
          details?: string;
        }[];
      }
    > = {};
    ////////////////LOOP ALL ACTIVE LEAGUES/////////////////////
    for (const league of ACTIVE_LEAGUES) {
      let leagueResponse = {
        scoreMatchupsCreated: 0,
        statMatchupsCreated: 0,
        matchupsFromDatabase: 0,
        matchupsFromEspn: 0,
        existingMatchups: 0,
        matchupsUpdated: 0,
        gamesOnSchedule: 0,
        games: [] as { game: string; result: string; details?: string }[],
        error: "",
      };

      const endpoints = getScheduleEndpoints(league);
      if (!endpoints) {
        leagueResponse.error = `No endpoints found for ${league}`;
        continue;
      }

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint);
        let data: ScheduleResponse;

        if (league === "MBB" || league === "WBB") {
          const scoreboardData =
            (await response.json()) as ScoreboardScheduleResponse;

          const schedule: Schedule = {};

          for (const event of scoreboardData.events || []) {
            const date = event.date?.split("T")[0].replace(/-/g, "");
            if (!date) continue;
            schedule[date] = {
              games: schedule[date]?.games
                ? [...schedule[date].games, event as Game]
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

          data = {
            type: "",
            content: {
              schedule: schedule,
              league:
                league === "MBB"
                  ? "mens-college-basketball"
                  : "womens-college-basketball",
              activeDate:
                scoreboardData.events?.[0]?.date
                  ?.split("T")[0]
                  .replace(/-/g, "") || "",
              sport: "BASKETBALL",
            },
          };
        } else {
          data = (await response.json()) as ScheduleResponse;
        }
        if (!data.content.schedule) {
          leagueResponse.error = `No schedule found for ${league}`;
          continue;
        }

        ////GET ACTIVE MATCHUPS FOR LEAGUE ////
        const matchupsFromDatabase = await ctx.runQuery(
          api.matchups.getMatchupsByLeagueAndTime,
          {
            league,
            startTime: new Date().getTime(),
          }
        );

        leagueResponse.matchupsFromDatabase = matchupsFromDatabase.length;
        //Create dictionary of existing matchups by gameId
        const matchupsFromDatabaseByGameId = matchupsFromDatabase.reduce(
          (acc, matchup) => {
            acc[matchup.gameId] = matchup;
            return acc;
          },
          {} as Record<string, Doc<"matchups">>
        );

        console.log(Object.keys(matchupsFromDatabaseByGameId));

        const schedule = data.content.schedule;
        ///////////////////LOOP ALL DAYS////////////////////////
        for (const day in schedule) {
          if (!schedule[day].games) continue;
          ////////////////LOOP ALL GAMES////////////////////////
          for (const game of schedule[day].games) {
            leagueResponse.gamesOnSchedule++;
            const competition = game.competitions[0];
            //skip if no competition or less than 2 competitors or already started

            if (
              !competition ||
              !competition.competitors ||
              competition.competitors.length < 2
            ) {
              leagueResponse.games.push({
                game: game.shortName,
                result: `Skipped with less than 2 competitors`,
              });
              continue;
            }
            if (
              competition.competitors[0].team.name === "TBD" ||
              competition.competitors[1].team.name === "TBD"
            ) {
              leagueResponse.games.push({
                game: game.shortName,
                result: `Skipped with TBD team names`,
              });
              continue;
            }

            //get competition status
            const competitionStatus =
              competition.status?.type?.name ?? "STATUS_SCHEDULED";

            //skip if not scheduled, postponed, or delayed
            if (
              competitionStatus !== "STATUS_SCHEDULED" &&
              competitionStatus !== "STATUS_POSTPONED" &&
              competitionStatus !== "STATUS_DELAYED"
            ) {
              leagueResponse.games.push({
                game: game.shortName,
                result: `Skipped with status ${competitionStatus}`,
              });
              continue;
            }

            const home = competition.competitors.find(
              (c) => c.homeAway === "home"
            );
            const away = competition.competitors.find(
              (c) => c.homeAway === "away"
            );
            if (!home || !away) {
              leagueResponse.games.push({
                game: game.shortName,
                result: `Skipped with no home or away team`,
              });
              continue;
            }

            /////check if matchup already exists, if so update the scheduled time, else create new matchups////////////
            if (matchupsFromDatabaseByGameId[game.id]) {
              leagueResponse.existingMatchups++;
              console.log(`Matchup already exists: ${game.id}`);

              //check for changes
              let hasChanged = false;
              let hasChangedDetails = `${league}: ${game.shortName} -`;
              const existingMatchup = matchupsFromDatabaseByGameId[game.id];
              if (existingMatchup.startTime !== Date.parse(game.date)) {
                hasChanged = true;
                hasChangedDetails += `startTime: ${existingMatchup.startTime} -> ${Date.parse(
                  game.date
                )}`;
              }
              if (existingMatchup.status !== competitionStatus) {
                hasChanged = true;
                hasChangedDetails += `status: ${existingMatchup.status} -> ${competitionStatus}`;
              }

              if (hasChanged) {
                await ctx.runMutation(
                  internal.schedules.updateScheduledMatchup,
                  {
                    gameId: game.id,
                    league: league,
                    startTime: Date.parse(game.date),
                    status: competitionStatus,
                  }
                );
                leagueResponse.matchupsUpdated++;
                leagueResponse.games.push({
                  game: game.shortName,
                  result: `Updated scheduled time or status`,
                  details: hasChangedDetails,
                });
              }
              continue;
            }
            const ACTIVE_MATCHUP_TYPES: MatchupType[] = ["SCORE"];
            ///////////////////LOOP ALL ACTIVE MATCHUP TYPES////////////////////////
            for (const matchup_type of ACTIVE_MATCHUP_TYPES) {
              if (matchup_type === "STATS") {
                if (STATS_BY_LEAGUE[league]) {
                  const stats = STATS_BY_LEAGUE[league] as Record<
                    string,
                    string
                  >;
                  for (const stat in stats) {
                    const statFriendly = stats[stat];
                    const statsMatchup = await ctx.runMutation(
                      internal.schedules.insertStatMatchup,
                      {
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
                            home.team.logo ||
                            "https://chainlink.st/icons/icon-256x256.png",
                        },
                        awayTeam: {
                          id: away.id,
                          name: away.team.name || "Away Team",
                          score: 0,
                          image:
                            away.team.logo ||
                            "https://chainlink.st/icons/icon-256x256.png",
                        },
                        cost: 0,
                        metadata: {
                          network:
                            competition.geoBroadcasts?.[0]?.media?.shortName ||
                            "N/A",
                          statType: stat,
                        },
                      }
                    );
                    leagueResponse.statMatchupsCreated++;
                    leagueResponse.games.push({
                      game: game.shortName,
                      result: `Created stats matchup`,
                      details: `matchupId: ${statsMatchup}`,
                    });
                    continue;
                  }
                }
              }
              if (matchup_type === "SCORE") {
                const scoreMatchup = await ctx.runMutation(
                  internal.schedules.insertScoreMatchup,
                  {
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
                        home.team.logo ||
                        "https://chainlink.st/icons/icon-256x256.png",
                    },
                    awayTeam: {
                      id: away.id,
                      name: away.team.name || "Away Team",
                      score: 0,
                      image:
                        away.team.logo ||
                        "https://chainlink.st/icons/icon-256x256.png",
                    },
                    cost: 0,
                    metadata: {
                      network:
                        competition.geoBroadcasts?.[0]?.media?.shortName ||
                        "N/A",
                    },
                  }
                );
                leagueResponse.scoreMatchupsCreated++;
                leagueResponse.games.push({
                  game: game.shortName,
                  result: `Created new score matchup`,
                  details: `matchupId: ${scoreMatchup}`,
                });
                continue;
              }
            }
          }
        }
        //merge the games list and numbers if actionResponse[league] exists
        if (actionResponse[league]) {
          actionResponse[league].games = [
            ...actionResponse[league].games,
            ...leagueResponse.games,
          ];
        } else {
          actionResponse[league] = leagueResponse;
        }
      }
    }
    console.log(actionResponse);
    return actionResponse;
  },
});

export const insertStatMatchup = internalMutation({
  args: {
    startTime: v.number(),
    title: v.string(),
    league: v.string(),
    status: v.string(),
    gameId: v.string(),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
      score: v.number(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
      score: v.number(),
    }),
    cost: v.number(),
    metadata: v.optional(
      v.object({
        network: v.optional(v.string()),
        statType: v.optional(v.string()),
      })
    ),
  },
  handler: async (
    ctx,
    {
      startTime,
      title,
      league,
      status,
      gameId,
      homeTeam,
      awayTeam,
      cost,
      metadata,
    }
  ) => {
    //create a STATS matchup
    const matchupId = await ctx.db.insert("matchups", {
      startTime,
      active: false,
      featured: false,
      title,
      league,
      type: "STATS",
      typeDetails: "GREATER_THAN",
      status,
      gameId,
      homeTeam,
      awayTeam,
      cost,
      metadata,
    });
  },
});

export const insertScoreMatchup = internalMutation({
  args: {
    startTime: v.number(),
    active: v.boolean(),
    featured: v.boolean(),
    title: v.string(),
    league: v.string(),
    status: v.string(),
    gameId: v.string(),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
      score: v.number(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
      score: v.number(),
    }),
    cost: v.number(),
    metadata: v.optional(
      v.object({
        network: v.optional(v.string()),
      })
    ),
  },
  handler: async (
    ctx,
    {
      startTime,
      active,
      featured,
      title,
      league,
      status,
      gameId,
      homeTeam,
      awayTeam,
      cost,
      metadata,
    }
  ) => {
    //create a score matchup
    const matchupId = await ctx.db.insert("matchups", {
      startTime,
      active,
      featured,
      title,
      league,
      type: "SCORE",
      typeDetails: "GREATER_THAN",
      status,
      gameId,
      homeTeam,
      awayTeam,
      cost,
      metadata,
    });
    return matchupId;
  },
});

export const updateScheduledMatchup = internalMutation({
  args: {
    gameId: v.string(),
    league: v.string(),
    startTime: v.number(),
    status: v.string(),
  },
  handler: async (ctx, { gameId, league, startTime, status }) => {
    const matchups = await ctx.db
      .query("matchups")
      .filter((q) =>
        q.and(
          q.eq(q.field("league"), league),
          q.eq(q.field("active"), true),
          q.eq(q.field("gameId"), gameId)
        )
      )
      .take(500);
    for (const matchup of matchups) {
      await ctx.db.patch(matchup._id, { startTime, status });
    }
  },
});

export function getScheduleEndpoints(league: League) {
  const today = new Date();
  const year = today.getFullYear();
  //get YYYYMMDD yesterday, today, tomorrow, the day after tomorrow
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const theDayAfterTomorrow = new Date(
    today.getTime() + 2 * 24 * 60 * 60 * 1000
  );
  const yesterdayString = yesterday
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  const todayString = today.toISOString().split("T")[0].replace(/-/g, "");
  const tomorrowString = tomorrow.toISOString().split("T")[0].replace(/-/g, "");
  const theDayAfterTomorrowString = theDayAfterTomorrow
    .toISOString()
    .split("T")[0];
  const dates = [
    `${yesterdayString}`,
    `${todayString}`,
    `${tomorrowString}`,
    `${theDayAfterTomorrowString}`,
  ];

  if (league === "MBB") {
    return dates.map(
      (date) =>
        `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&dates=${date}`
    );
  }
  if (league === "WBB") {
    return dates.map(
      (date) =>
        `https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard?groups=50&dates=${date}`
    );
  }

  switch (league) {
    case "NFL":
      return [
        `http://cdn.espn.com/core/nfl/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "NBA":
      return [
        `http://cdn.espn.com/core/nba/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "NHL":
      return [
        `http://cdn.espn.com/core/nhl/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "MLB":
      return [
        `http://cdn.espn.com/core/mlb/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "MLS":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/usa.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "NWSL":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/usa.nwsl??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "RPL":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/rus.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "FRIENDLY":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/fifa.friendly??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "ARG":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/arg.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "TUR":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/tur.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "CSL":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/chn.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "NBAG":
      return [
        `http://cdn.espn.com/core/nba-g-league/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "EPL":
      return [
        `http://cdn.espn.com/core/soccer/schedule/_/league/eng.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "COLLEGE-FOOTBALL":
      return [
        `http://cdn.espn.com/core/college-football/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "WNBA":
      return [
        `http://cdn.espn.com/core/wnba/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "UFL":
      return [
        `http://cdn.espn.com/core/ufl/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];
    case "PLL":
      return [
        `http://cdn.espn.com/core/pll/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`,
      ];

    default:
      return null;
  }
}
