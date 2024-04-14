import { internalMutation, internalQuery, query } from "./_generated/server";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import { matchupReward } from "./utils";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const getAdminMatchups = query({
  args: {},
  handler: async (ctx) => {
    type MatchupWithPicks = Doc<"matchups"> & { picks: Doc<"picks">[] };

    const currentTime = new Date().getTime();
    const minus6Hours = currentTime - 12 * 60 * 60 * 1000;
    const plus18Hours = currentTime + 36 * 60 * 60 * 1000;
    const matchups = (await ctx.db
      .query("matchups")
      .withIndex("by_startTime", (q) =>
        q.gte("startTime", minus6Hours).lte("startTime", plus18Hours)
      )
      .collect()) as MatchupWithPicks[];

    //get picks for each matchup
    for (const matchup of matchups) {
      const picks = await ctx.db
        .query("picks")
        .withIndex("by_matchupId", (q) => q.eq("matchupId", matchup._id))
        .collect();
      matchup.picks = picks;
    }
    return matchups;
  },
});

export const getActiveMatchups = query({
  args: {},
  handler: async (ctx) => {
    const currentTime = new Date().getTime();
    const minus6Hours = currentTime - 6 * 60 * 60 * 1000;
    const plus18Hours = currentTime + 18 * 60 * 60 * 1000;
    const matchups = await ctx.db
      .query("matchups")
      .withIndex("by_active_dates", (q) =>
        q
          .eq("active", true)
          .gte("startTime", minus6Hours)
          .lte("startTime", plus18Hours)
      )
      .collect();
    return matchups;
  },
});

export const getActiveMatchupsByLeague = query({
  args: { league: v.string() },
  handler: async (ctx, { league }) => {
    const matchups = await ctx.db
      .query("matchups")
      .filter((q) =>
        q.and(q.eq(q.field("league"), league), q.eq(q.field("active"), true))
      )
      .take(500);
    return matchups;
  },
});

export const handleMatchupStarted = internalMutation({
  args: {
    matchupId: v.id("matchups"),
    status: v.string(),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { matchupId, homeTeam, awayTeam, status, metadata }) => {
    //get picks
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
      .collect();

    console.log(`picks found: ${picks.length} for matchup: ${matchupId}`);
    //update picks to in progress
    for (const pick of picks) {
      await ctx.db.patch(pick._id, { status: "STATUS_IN_PROGRESS" });
    }

    //update matchup to in progress
    await ctx.db.patch(matchupId, {
      status,
      homeTeam,
      awayTeam,
      updatedAt: new Date().getTime(),
      metadata,
    });
  },
});

export const getMatchupsByLeagueAndGameIds = internalQuery({
  args: { gameIds: v.array(v.string()), league: v.string() },
  handler: async (ctx, { gameIds, league }) => {
    return await filter(
      ctx.db
        .query("matchups")
        .withIndex("by_active_league", (q) =>
          q.eq("league", league).eq("active", true)
        ),
      (m) => gameIds.includes(m.gameId)
    ).collect();
  },
});

export const getMatchupById = query({
  args: { matchupId: v.id("matchups") },
  handler: async (ctx, { matchupId }) => {
    return await ctx.db.get(matchupId);
  },
});

export const handleMatchupUpdated = internalMutation({
  args: {
    matchupId: v.id("matchups"),
    status: v.string(),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { matchupId, homeTeam, awayTeam, status, metadata }) => {
    //update matchup
    await ctx.db.patch(matchupId, {
      status,
      homeTeam,
      awayTeam,
      updatedAt: new Date().getTime(),
      metadata,
    });
  },
});

export const handleMatchupFinished = internalMutation({
  args: {
    matchupId: v.id("matchups"),
    type: v.string(),
    typeDetails: v.optional(v.string()),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    status: v.string(),
    metadata: v.optional(v.any()),
    cost: v.number(),
    featured: v.boolean(),
  },
  handler: async (
    ctx,
    {
      matchupId,
      homeTeam,
      awayTeam,
      status,
      type,
      typeDetails,
      metadata,
      cost,
      featured,
    }
  ) => {
    //#region //////////////////DETERMINE WINS ///////////////////////
    let winnerId = undefined;

    //SCORE GREATER_THAN
    if (type === "SCORE" && typeDetails === "GREATER_THAN") {
      winnerId = homeTeam.score > awayTeam.score ? homeTeam.id : awayTeam.id;
      if (homeTeam.score === awayTeam.score) {
        winnerId = "PUSH";
      }
    }

    //IF NO WINNER FOUND throw error
    if (!winnerId) {
      throw new Error(`Unable to determine winner for matchup: ${matchupId}`);
    }
    //#endregion

    //#region /////////////////UPDATE PICKS////////////////////////
    //get picks from db
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
      .collect();

    //compare pick to winner and patch status
    for (const pick of picks) {
      if (winnerId === "PUSH") {
        await ctx.scheduler.runAfter(0, internal.picks.handlePickPush, {
          pickId: pick._id,
        });
      } else if (pick.pick.id === winnerId) {
        await ctx.scheduler.runAfter(0, internal.picks.handlePickWin, {
          pickId: pick._id,
          cost,
          featured,
        });
      } else {
        await ctx.scheduler.runAfter(0, internal.picks.handlePickLoss, {
          pickId: pick._id,
          cost,
        });
      }
    }

    //#endregion todo notifications

    //#region /////////////////UPDATE MATCHUP////////////////////////

    //update matchup to finished
    await ctx.db.patch(matchupId, {
      status,
      homeTeam,
      awayTeam,
      winnerId,
      active: false,
      featured: false,
      updatedAt: new Date().getTime(),
      metadata,
    });

    //#endregion
  },
});
