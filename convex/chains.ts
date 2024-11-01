import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { api, internal } from "./_generated/api";

export const updateChain = internalMutation({
  args: { chainId: v.id("chains"), chain: v.number() },
  handler: async (ctx, { chainId, chain }) => {
    await ctx.db.patch(chainId, { chain });
  },
});

export const deactivateAllChains = internalMutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const chains = await ctx.db
      .query("chains")
      .filter((q) => q.eq(q.field("campaignId"), campaignId))
      .collect();
    for (const chain of chains) {
      await ctx.db.patch(chain._id, { active: false });
    }
  },
});

export const getChainsByCampaignId = internalQuery({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, { campaignId }) => {
    const chains = await ctx.db
      .query("chains")
      .filter((q) => q.eq(q.field("campaignId"), campaignId))
      .collect();
    return chains;
  },
});

export const getUserActiveChain = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return null;
    }
    const chain = await ctx.db
      .query("chains")
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", user.subject)
      )
      .unique();

    if (!chain) {
      return null;
    }
    return chain;
  },
});

export const getChain = query({
  args: { chainId: v.id("chains") },
  handler: async (ctx, { chainId }) => {
    const chain = await ctx.db.get(chainId);
    return chain;
  },
});

export const createActiveChain = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("USER_NOT_FOUND");
    }

    //check if user has an active chain
    const activeChain = await ctx.db
      .query("chains")
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", identity.subject)
      )
      .unique();

    if (activeChain !== null) {
      return activeChain._id;
    }

    //else create a new chain

    const campaign = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(q.eq(q.field("active"), true), q.eq(q.field("type"), "GLOBAL"))
      )
      .unique();
    if (!campaign) {
      throw new Error("No active campaign found");
    }

    const chain = await ctx.db.insert("chains", {
      campaignId: campaign._id,
      userId: identity.subject,
      active: true,
      wins: 0,
      losses: 0,
      best: 0,
      chain: 0,
      cost: 0,
      pushes: 0,
    });
    return chain;
  },
});

export const createChain = internalMutation({
  args: { campaignId: v.id("campaigns"), userId: v.string() },
  handler: async (ctx, { campaignId, userId }) => {
    await ctx.db.insert("chains", {
      campaignId,
      userId,
      active: true,
      wins: 0,
      losses: 0,
      best: 0,
      chain: 0,
      cost: 0,
      pushes: 0,
    });
  },
});
