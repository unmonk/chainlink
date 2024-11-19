import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import { matchupReward } from "./utils";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { featured_type, matchup_type } from "./schema";

export const deleteMatchup = mutation({
  args: { matchupId: v.id("matchups") },
  handler: async (ctx, { matchupId }) => {
    //get picks
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
      .collect();
    for (const pick of picks) {
      await ctx.db.delete(pick._id);
    }
    await ctx.db.delete(matchupId);
  },
});

export const manuallyFinalizeMatchup = mutation({
  args: { matchupId: v.id("matchups"), type: v.string() },
  handler: async (ctx, { matchupId, type }) => {
    const matchup = await ctx.db.get(matchupId);
    if (!matchup) {
      throw new Error(`Matchup not found: ${matchupId}`);
    }

    if (
      matchup.status === "STATUS_FINAL" ||
      matchup.status === "STATUS_FULL_TIME" ||
      matchup.status === "STATUS_FULL_PEN"
    ) {
      throw new Error(`Matchup is already finalized: ${matchupId}`);
    }

    if (type === "STANDARD_FINAL") {
      console.log(
        `ADMIN:: finalizing matchup with standard scoring: ${matchupId}`
      );
      await ctx.scheduler.runAfter(0, internal.matchups.handleMatchupFinished, {
        matchupId,
        status: "STATUS_FINAL",
        type: matchup.type,
        typeDetails: matchup.typeDetails,
        homeTeam: matchup.homeTeam,
        awayTeam: matchup.awayTeam,
        metadata: matchup.metadata,
      });
    }

    if (type === "ALL_WINNERS") {
      console.log(`ADMIN:: finalizing matchup with all winners: ${matchupId}`);
      await ctx.scheduler.runAfter(
        0,
        internal.matchups.handleMatchupAllWinners,
        {
          matchupId,
        }
      );
    }

    if (type === "ALL_LOSERS") {
      console.log(`ADMIN:: finalizing matchup with all losers: ${matchupId}`);
      await ctx.scheduler.runAfter(
        0,
        internal.matchups.handleMatchupAllLosers,
        {
          matchupId,
        }
      );
    }

    if (type === "ALL_PUSHS") {
      console.log(`ADMIN:: finalizing matchup with all pushes: ${matchupId}`);
      await ctx.scheduler.runAfter(
        0,
        internal.matchups.handleMatchupAllPushes,
        {
          matchupId,
        }
      );
    }

    return { success: true };
  },
});

export const getHomepageMatchups = query({
  args: {},
  handler: async (ctx) => {
    const currentTime = new Date().getTime();
    const matchups = await ctx.db
      .query("matchups")
      .withIndex("by_startTime", (q) => q.gte("startTime", currentTime))
      .take(3);
    return matchups;
  },
});

export const getAdminMatchups = query({
  args: {},
  handler: async (ctx) => {
    type MatchupWithPicks = Doc<"matchups"> & { picks: Doc<"picks">[] };

    const currentTime = new Date().getTime();
    const minus8Hours = currentTime - 8 * 60 * 60 * 1000;
    const plus48Hours = currentTime + 48 * 60 * 60 * 1000;
    const matchups = (await ctx.db
      .query("matchups")
      .withIndex("by_startTime", (q) =>
        q.gte("startTime", minus8Hours).lte("startTime", plus48Hours)
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

export type MatchupWithPickCounts = Doc<"matchups"> & {
  homePicks: number;
  awayPicks: number;
};

export const getActiveMatchups = query({
  args: {},
  handler: async (ctx) => {
    const currentTime = new Date().getTime();
    const minus8Hours = currentTime - 8 * 60 * 60 * 1000;
    const plus24Hours = currentTime + 24 * 60 * 60 * 1000;
    const matchups = await ctx.db
      .query("matchups")
      .withIndex("by_active_dates", (q) =>
        q
          .eq("active", true)
          .gte("startTime", minus8Hours)
          .lte("startTime", plus24Hours)
      )
      .collect();

    // Get pick counts for each matchup
    const matchupsWithPickCounts: MatchupWithPickCounts[] = [];
    for (let matchup of matchups) {
      const picks = await ctx.db
        .query("picks")
        .withIndex("by_matchupId", (q) => q.eq("matchupId", matchup._id))
        .collect();

      const homeTeamPicks = picks.filter(
        (p) => p.pick.id === matchup.homeTeam.id
      ).length;
      const awayTeamPicks = picks.filter(
        (p) => p.pick.id === matchup.awayTeam.id
      ).length;

      matchupsWithPickCounts.push({
        ...matchup,
        homePicks: homeTeamPicks || 0,
        awayPicks: awayTeamPicks || 0,
      });
    }
    return matchupsWithPickCounts;
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

export const getMatchupsByLeagueAndTime = query({
  args: { league: v.string(), startTime: v.number() },
  handler: async (ctx, { league, startTime }) => {
    const minus24Hours = startTime - 24 * 60 * 60 * 1000;
    const plusOneMonth = startTime + 30 * 24 * 60 * 60 * 1000;
    return await ctx.db
      .query("matchups")
      .withIndex("by_league_time", (q) =>
        q
          .eq("league", league)
          .gte("startTime", minus24Hours)
          .lte("startTime", plusOneMonth)
      )
      .take(500);
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

//SCOREBOARDS
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

export const getMatchupsByGameIds = internalQuery({
  args: { gameIds: v.array(v.string()) },
  handler: async (ctx, { gameIds }) => {
    return await filter(ctx.db.query("matchups"), (m) =>
      gameIds.includes(m.gameId)
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
  },
  handler: async (
    ctx,
    { matchupId, homeTeam, awayTeam, status, type, typeDetails, metadata }
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
        });
      } else {
        await ctx.scheduler.runAfter(0, internal.picks.handlePickLoss, {
          pickId: pick._id,
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

//handle matchup finished, everyone wins
export const handleMatchupAllWinners = internalMutation({
  args: {
    matchupId: v.id("matchups"),
  },
  handler: async (ctx, args) => {
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", args.matchupId))
      .collect();

    for (const pick of picks) {
      await ctx.scheduler.runAfter(0, internal.picks.handlePickWin, {
        pickId: pick._id,
      });
    }

    await ctx.db.patch(args.matchupId, {
      status: "STATUS_FINAL",
      active: false,
    });
  },
});

//handle matchup finished, everyone loses
export const handleMatchupAllLosers = internalMutation({
  args: {
    matchupId: v.id("matchups"),
  },
  handler: async (ctx, { matchupId }) => {
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
      .collect();

    for (const pick of picks) {
      await ctx.scheduler.runAfter(0, internal.picks.handlePickLoss, {
        pickId: pick._id,
      });
    }

    await ctx.db.patch(matchupId, {
      status: "STATUS_FINAL",
      active: false,
    });
  },
});

//handle matchup finished, everyone pushes
export const handleMatchupAllPushes = internalMutation({
  args: {
    matchupId: v.id("matchups"),
  },
  handler: async (ctx, { matchupId }) => {
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
      .collect();

    for (const pick of picks) {
      await ctx.scheduler.runAfter(0, internal.picks.handlePickPush, {
        pickId: pick._id,
      });
    }

    await ctx.db.patch(matchupId, {
      status: "STATUS_FINAL",
      active: false,
    });
  },
});

export const patchFeatured = mutation({
  args: {
    matchupId: v.id("matchups"),
    featured: v.boolean(),
    featuredType: featured_type,
  },
  handler: async (ctx, { matchupId, featured }) => {
    const res = await ctx.db.patch(matchupId, {
      featured,
      featuredType: "CHAINBUILDER",
    });
  },
});

export const patchActive = mutation({
  args: { matchupId: v.id("matchups"), active: v.boolean() },
  handler: async (ctx, { matchupId, active }) => {
    await ctx.db.patch(matchupId, { active });
  },
});

export const updateMatchup = mutation({
  args: {
    _id: v.id("matchups"),
    title: v.string(),
    league: v.string(),
    type: matchup_type,
    typeDetails: v.optional(v.string()),
    cost: v.number(),
    startTime: v.number(),
    active: v.boolean(),
    featured: v.boolean(),
    featuredType: v.optional(featured_type),
    gameId: v.string(),
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
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      ...args,
    });
  },
});

export const getNextChainBuilderMatchup = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("matchups")
      .filter((q) =>
        q.and(
          q.eq(q.field("featured"), true),
          q.eq(q.field("featuredType"), "CHAINBUILDER"),
          q.gte(q.field("startTime"), new Date().getTime())
        )
      )
      .order("asc")
      .first();
  },
});

export const getNext3ChainBuilderMatchups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("matchups")
      .filter((q) =>
        q.and(
          q.eq(q.field("featured"), true),
          q.eq(q.field("featuredType"), "CHAINBUILDER"),
          q.gte(q.field("startTime"), new Date().getTime())
        )
      )
      .order("asc")
      .take(5);
  },
});
