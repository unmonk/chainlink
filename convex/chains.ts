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

    return chain;
  },
});

export const createActiveChain = action({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not found");
    }

    const campaign = await ctx.runQuery(
      api.campaigns.getActiveGlobalCampaign,
      {}
    );
    if (!campaign) {
      throw new Error("No active campaign found");
    }
    const campaignId = campaign._id;

    const chain = await ctx.runMutation(internal.chains.createChain, {
      campaignId,
      userId: user.subject,
    });
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
