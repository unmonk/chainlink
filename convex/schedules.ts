import { action, internalMutation } from "./_generated/server";
import { League } from "./types";
import { v } from "convex/values";
import { ACTIVE_LEAGUES } from "./utils";
import { LeagueResponse, processLeague } from "./scheduleprocessors";

export const schedules = action({
  args: {},
  handler: async (ctx) => {
    let actionResponse: Record<string, LeagueResponse> = {};
    for (const league of ACTIVE_LEAGUES) {
      actionResponse[league] = await processLeague(ctx, league);
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
    return matchupId;
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
    homeTeam: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        image: v.string(),
        score: v.number(),
      })
    ),
    awayTeam: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        image: v.string(),
        score: v.number(),
      })
    ),
  },
  handler: async (
    ctx,
    { gameId, league, startTime, status, homeTeam, awayTeam }
  ) => {
    try {
      // Query matchups without the active filter to ensure we catch all relevant matchups
      const matchups = await ctx.db
        .query("matchups")
        .withIndex("by_league_time", (q) => q.eq("league", league))
        .filter((q) => q.eq(q.field("gameId"), gameId))
        .take(50);

      if (matchups.length === 0) {
        console.log(
          `No matchups found for gameId: ${gameId} and league: ${league}`
        );
        return;
      }

      // Batch update all matching matchups
      const updatePromises = matchups.map((matchup) => {
        const updateData: any = {
          startTime,
          status,
          updatedAt: Date.now(),
        };

        // Only update team data if provided
        if (homeTeam) {
          updateData.homeTeam = {
            ...matchup.homeTeam,
            ...homeTeam,
          };
        }
        if (awayTeam) {
          updateData.awayTeam = {
            ...matchup.awayTeam,
            ...awayTeam,
          };
        }

        // Update title if team names changed
        if (homeTeam?.name || awayTeam?.name) {
          const homeName = homeTeam?.name || matchup.homeTeam.name;
          const awayName = awayTeam?.name || matchup.awayTeam.name;
          updateData.title = `Who will win? ${awayName} @ ${homeName}`;
        }

        return ctx.db.patch(matchup._id, updateData);
      });

      await Promise.all(updatePromises);
      console.log(
        `Successfully updated ${matchups.length} matchups for gameId: ${gameId}`
      );
    } catch (error) {
      console.error(`Error updating matchups for gameId: ${gameId}:`, error);
      throw error;
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
    .split("T")[0]
    .replace(/-/g, "");
  const dates = [
    `${yesterdayString}`,
    `${todayString}`,
    `${tomorrowString}`,
    `${theDayAfterTomorrowString}`,
  ];

  if (league === "MBB") {
    return dates.map(
      (date) =>
        `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&dates=${date}&limit=500`
    );
  }
  if (league === "WBB") {
    return dates.map(
      (date) =>
        `https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard?groups=50&dates=${date}&limit=500`
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
