import { internalAction, internalMutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

export const createMonthlyCampaign = internalAction({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    //get the current active global campaign
    const activeGlobalCampaign = await ctx.runQuery(
      api.campaigns.getActiveGlobalCampaign,
      {}
    );

    if (!activeGlobalCampaign) {
      throw new Error("No active global campaign found");
    }

    //get achievements
    const monthlyChainWinAchievement = await ctx.runQuery(
      api.achievements.getMonthlyChainWinAchievement
    );
    if (!monthlyChainWinAchievement) {
      throw new Error("No monthly chain win achievement found");
    }
    const monthlyWinAchievement = await ctx.runQuery(
      api.achievements.getMonthlyWinAchievement
    );
    if (!monthlyWinAchievement) {
      throw new Error("No monthly win achievement found");
    }

    //get chains for the active global campaign
    const chains = await ctx.runQuery(internal.chains.getChainsByCampaignId, {
      campaignId: activeGlobalCampaign._id,
    });

    if (!chains || chains.length === 0) {
      throw new Error("No chains found for active global campaign");
    }

    //get chain with highest chain number
    const highestChain = chains.reduce((prev, current) => {
      if (prev.chain > current.chain) return prev;
      if (prev.chain < current.chain) return current;
      // If chains are equal, check wins
      if (prev.wins > current.wins) return prev;
      if (prev.wins < current.wins) return current;
      // If wins are equal, check pushes
      if (prev.pushes > current.pushes) return prev;
      if (prev.pushes < current.pushes) return current;
      // If everything is equal, keep the first one
      return prev;
    });

    //get chain with highest win number
    const highestWin = chains.reduce((prev, current) => {
      if (prev.wins > current.wins) return prev;
      if (prev.wins < current.wins) return current;
      // If wins are equal, check pushes
      if (prev.pushes > current.pushes) return prev;
      if (prev.pushes < current.pushes) return current;
      // If everything is equal, keep the first one
      return prev;
    });

    if (!highestChain) {
      throw new Error("No Chain Winner");
    }
    if (!highestWin) {
      throw new Error("No Win Winner");
    }

    //set the active global campaign to inactive and set the winners
    activeGlobalCampaign.active = false;
    activeGlobalCampaign.chainWinnerId = highestChain.userId;
    activeGlobalCampaign.winnerId = highestWin.userId;

    //save the completed global campaign
    await ctx.runMutation(internal.campaigns.saveCompletedCampaign, {
      active: activeGlobalCampaign.active,
      chainWinnerId: activeGlobalCampaign.chainWinnerId,
      winnerId: activeGlobalCampaign.winnerId,
      campaignId: activeGlobalCampaign._id,
    });

    //deactivate all chains
    await ctx.runMutation(internal.chains.deactivateAllChains, {
      campaignId: activeGlobalCampaign._id,
    });

    //todo notifications

    //award highest chain winner

    await ctx.scheduler.runAfter(0, api.achievements.awardAchievement, {
      userId: highestChain.userId,
      achievementId: monthlyChainWinAchievement._id,
    });

    //award highest win winner

    await ctx.scheduler.runAfter(0, api.achievements.awardAchievement, {
      userId: highestWin.userId,
      achievementId: monthlyWinAchievement._id,
    });

    //create a new global campaign
    const date = new Date();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const campaignName = `${month} ${year} Monthly Global Campaign`;
    const campaignDescription = `The monthly global campaign for ${month} ${year}, all users participate in this campaign.`;
    //start date is first day of the month at 10am utc
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      10,
      0,
      0
    );
    //end date is last day of the month at 09:59:30 utc
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      9,
      59,
      30
    );

    await ctx.runMutation(internal.campaigns.createGlobalCampaign, {
      name: campaignName,
      description: campaignDescription,
      active: true,
      featured: true,
      type: "GLOBAL",
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      ownedBy: "SYSTEM",
    });

    return `Created ${campaignName}`;
  },
});

export const createGlobalCampaign = internalMutation({
  args: {
    name: v.string(),
    description: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    type: v.literal("GLOBAL"),
    startDate: v.number(),
    endDate: v.number(),
    ownedBy: v.string(),
  },
  handler: async (
    ctx,
    { name, description, active, featured, type, startDate, endDate, ownedBy }
  ) => {
    const campaign = await ctx.db.insert("campaigns", {
      name,
      description,
      active,
      featured,
      type,
      startDate,
      endDate,
      ownedBy,
    });
    return campaign;
  },
});

export const saveCompletedCampaign = internalMutation({
  args: {
    active: v.boolean(),
    chainWinnerId: v.string(),
    winnerId: v.string(),
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, { active, chainWinnerId, winnerId, campaignId }) => {
    await ctx.db.patch(campaignId, { active, chainWinnerId, winnerId });
  },
});

export const getActiveGlobalCampaign = query({
  args: {},
  handler: async (ctx) => {
    const campaign = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(q.eq(q.field("active"), true), q.eq(q.field("type"), "GLOBAL"))
      )
      .unique();
    return campaign;
  },
});
