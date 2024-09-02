import { internalAction, internalMutation } from "./_generated/server";
import { MatchupType } from "./schema";
import { ScheduleResponse } from "./espn";
import { League } from "./types";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";
import { ACTIVE_LEAGUES, STATS_BY_LEAGUE } from "./utils";
import { Doc } from "./_generated/dataModel";

export const schedules = internalAction({
  args: {},
  handler: async (ctx) => {
    let actionResponse: Record<
      string,
      {
        gamesOnSchedule: number;
        updatedTimeOrStatus: number;
        scoreMatchupsCreated: number;
        statMatchupsCreated: number;
      }
    > = {};
    ////////////////LOOP ALL ACTIVE LEAGUES/////////////////////
    for (const league of ACTIVE_LEAGUES) {
      let leagueResponse = {
        updatedTimeOrStatus: 0,
        scoreMatchupsCreated: 0,
        statMatchupsCreated: 0,
        gamesOnSchedule: 0,
      };
      const endpoint = getScheduleEndpoint(league);
      if (!endpoint) {
        console.log(`No endpoint found for ${league}`);
        continue;
      }

      const response = await fetch(endpoint);
      const data = (await response.json()) as ScheduleResponse;
      if (!data.content.schedule) {
        console.log(`No schedule found for ${league}`);
        continue;
      }

      ////GET ACTIVE MATCHUPS FOR LEAGUE ////
      const existingMatchups = await ctx.runQuery(
        api.matchups.getActiveMatchupsByLeague,
        {
          league,
        }
      );

      //Create dictionary of existing matchups by gameId
      const existingMatchupsByGameId = existingMatchups.reduce(
        (acc, matchup) => {
          acc[matchup.gameId] = matchup;
          return acc;
        },
        {} as Record<string, Doc<"matchups">>
      );

      console.log(
        `Existing matchups for ${league}: ${existingMatchups.toString()}`
      );

      const leaguePromises = [];
      const schedule = data.content.schedule;
      ///////////////////LOOP ALL DAYS////////////////////////
      for (const day in schedule) {
        if (!schedule[day].games) continue;
        ////////////////LOOP ALL GAMES////////////////////////
        for (const game of schedule[day].games) {
          leagueResponse.gamesOnSchedule++;
          const competition = game.competitions[0];
          //skip if no competition or less than 2 competitors or already started
          if (!competition) continue;
          if (!competition.competitors) continue;
          if (competition.competitors.length < 2) continue;
          if (
            competition.competitors[0].team.name === "TBD" ||
            competition.competitors[1].team.name === "TBD"
          )
            continue;

          const competitionStatus =
            competition.status?.type?.name ?? "STATUS_SCHEDULED";
          if (
            competitionStatus !== "STATUS_SCHEDULED" &&
            competitionStatus !== "STATUS_POSTPONED" &&
            competitionStatus !== "STATUS_DELAYED"
          ) {
            console.log(
              `${league} skipped game ${game.id} with status ${competitionStatus}`
            );
            continue;
          }

          /////check if matchup already exists, if so update the scheduled time, else create new matchups////////////
          if (existingMatchupsByGameId[game.id]) {
            console.log(
              `Matchup already exists for ${league}: ${game.shortName}`
            );
            //check for changes
            let hasChanged = false;
            let hasChangedDetails = `${league}: ${game.shortName} -`;
            const existingMatchup = existingMatchupsByGameId[game.id];
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
              await ctx.runMutation(internal.schedules.updateScheduledMatchup, {
                gameId: game.id,
                league: league,
                startTime: Date.parse(game.date),
                status: competitionStatus,
              });
              console.log(hasChangedDetails);
              leagueResponse.updatedTimeOrStatus++;
            }
            continue;
          }

          const home = competition.competitors.find(
            (c) => c.homeAway === "home"
          );
          const away = competition.competitors.find(
            (c) => c.homeAway === "away"
          );
          if (!home || !away) continue;
          const ACTIVE_MATCHUP_TYPES: MatchupType[] = ["SCORE"];
          ///////////////////LOOP ALL ACTIVE MATCHUP TYPES////////////////////////
          for (const matchup_type of ACTIVE_MATCHUP_TYPES) {
            if (matchup_type === "STATS") {
              if (STATS_BY_LEAGUE[league]) {
                const stats = STATS_BY_LEAGUE[league] as Record<string, string>;
                for (const stat in stats) {
                  const statFriendly = stats[stat];
                  const statsMatchup = ctx.runMutation(
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
                          home.team.logo || "https://via.placeholder.com/150",
                      },
                      awayTeam: {
                        id: away.id,
                        name: away.team.name || "Away Team",
                        score: 0,
                        image:
                          away.team.logo || "https://via.placeholder.com/150",
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
                  leaguePromises.push(statsMatchup);
                  leagueResponse.statMatchupsCreated++;
                }
              }
            }
            if (matchup_type === "SCORE") {
              const scoreMatchup = ctx.runMutation(
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
                    image: home.team.logo || "https://via.placeholder.com/150",
                  },
                  awayTeam: {
                    id: away.id,
                    name: away.team.name || "Away Team",
                    score: 0,
                    image: away.team.logo || "https://via.placeholder.com/150",
                  },
                  cost: 0,
                  metadata: {
                    network:
                      competition.geoBroadcasts?.[0]?.media?.shortName || "N/A",
                  },
                }
              );
              leaguePromises.push(scoreMatchup);
              leagueResponse.scoreMatchupsCreated++;
            }
          }
        }
      }
      await Promise.all(leaguePromises);
      actionResponse[league] = leagueResponse;
    }
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

function getScheduleEndpoint(league: League) {
  switch (league) {
    case "NFL":
      return `http://cdn.espn.com/core/nfl/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "NBA":
      return `http://cdn.espn.com/core/nba/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "NHL":
      return `http://cdn.espn.com/core/nhl/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "MLB":
      return `http://cdn.espn.com/core/mlb/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "MLS":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/usa.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "NWSL":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/usa.nwsl??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "RPL":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/rus.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "FRIENDLY":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/fifa.friendly??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "ARG":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/arg.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "TUR":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/tur.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;

    case "CSL":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/chn.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "NBAG":
      return `http://cdn.espn.com/core/nba-g-league/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "EPL":
      return `http://cdn.espn.com/core/soccer/schedule/_/league/eng.1??dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "COLLEGE-FOOTBALL":
      return `http://cdn.espn.com/core/college-football/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "MBB":
      return `http://cdn.espn.com/core/mens-college-basketball/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "WBB":
      return `http://cdn.espn.com/core/womens-college-basketball/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "WNBA":
      return `http://cdn.espn.com/core/wnba/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    case "UFL":
      return `http://cdn.espn.com/core/ufl/schedule?dates=${new Date().getFullYear()}&xhr=1&render=false&device=desktop&userab=18`;
    default:
      return null;
  }
}
