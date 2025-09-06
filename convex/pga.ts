import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPgaPlayers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pgaPlayers").collect();
  },
});

export const createPgaPlayer = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pgaPlayers", args);
  },
});

export const getAdminPgaMatchups = query({
  args: {},
  handler: async (ctx) => {
    const matchups = await ctx.db.query("pgaMatchups").collect();
    const matchupsWithPlayers = await Promise.all(
      matchups.map(async (matchup) => {
        const golferA = await ctx.db.get(matchup.golferAId);
        const golferB = await ctx.db.get(matchup.golferBId);
        return {
          ...matchup,
          golferA,
          golferB,
        };
      })
    );
    return matchupsWithPlayers;
  },
});

export const createPgaMatchup = mutation({
  args: {
    golferAId: v.id("pgaPlayers"),
    golferBId: v.id("pgaPlayers"),
    holes: v.number(),
    thru: v.number(),
    startTime: v.number(),
    league: v.string(),
    active: v.boolean(),
    status: v.string(),
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pgaMatchups", {
      ...args,
      winnerId: undefined,
    });
  },
});

export const getPgaEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pgaEvents").collect();
  },
});

export const createPgaEvent = mutation({
  args: {
    name: v.string(),
    leaderboardUrl: v.string(),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pgaEvents", args);
  },
});

export const finalizePgaMatchup = internalMutation({
  args: {
    matchupId: v.id("pgaMatchups"),
    golferAScore: v.number(),
    golferBScore: v.number(),
  },
  handler: async (ctx, { matchupId, golferAScore, golferBScore }) => {
    const matchup = await ctx.db.get(matchupId);
    if (!matchup) {
      throw new Error("Matchup not found");
    }

    let winnerId;
    if (golferAScore < golferBScore) {
      winnerId = matchup.golferAId;
    } else if (golferBScore < golferAScore) {
      winnerId = matchup.golferBId;
    } else {
      winnerId = undefined; // Push
    }

    await ctx.db.patch(matchupId, {
      golferAScore,
      golferBScore,
      winnerId,
      active: false,
      status: "FINAL",
    });
  },
});
