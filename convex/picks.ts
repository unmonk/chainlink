import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { pick_status } from "./schema";
import { api } from "./_generated/api";
import { matchupReward } from "./utils";

//HANDLE PICK WIN
export const handlePickWin = internalMutation({
  args: { pickId: v.id("picks"), cost: v.number(), featured: v.boolean() },
  handler: async (ctx, { pickId }) => {
    //get pick
    const pick = await ctx.db.get(pickId);
    if (!pick) {
      throw new ConvexError("PICK_NOT_FOUND");
    }
    //get user
    const user = await ctx.db.get(pick.userId);
    if (!user || !user.stats) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    //get user active chain
    const chain = await ctx.db
      .query("chains")
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", user.externalId)
      )
      .unique();
    if (!chain) {
      throw new ConvexError("CHAIN_NOT_FOUND");
    }
    //get matchup
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    //Record Win
    chain.wins += 1;
    user.stats.wins += 1;
    user.stats.statsByLeague[matchup.league]
      ? (user.stats.statsByLeague[matchup.league].wins += 1)
      : (user.stats.statsByLeague[matchup.league] = {
          wins: 1,
          losses: 0,
          pushes: 0,
        });
    chain.chain > 0 ? (chain.chain += 1) : (chain.chain = 1);
    chain.best = chain.chain > chain.best ? chain.chain : chain.best;

    console.log(`user: ${user.name} won pick: ${pick.pick.name}`);

    //Reward User
    const reward = matchupReward(matchup.cost, matchup.featured);
    user.coins += reward;
    chain.cost += reward;

    console.log(`user: ${user.name} won ${reward} coins`);

    //Record Pick
    pick.status = "WIN";
    pick.coins = reward;
    pick.active = false;

    //Patch
    await ctx.db.patch(chain._id, chain);
    await ctx.db.patch(user._id, user);
    await ctx.db.patch(pick._id, pick);
  },
});

//HANDLE PICK LOSS
export const handlePickLoss = internalMutation({
  args: { pickId: v.id("picks"), cost: v.number() },
  handler: async (ctx, { pickId }) => {
    //get pick
    const pick = await ctx.db.get(pickId);
    if (!pick) {
      throw new ConvexError("PICK_NOT_FOUND");
    }
    //get user
    const user = await ctx.db.get(pick.userId);
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    //get user active chain
    const chain = await ctx.db
      .query("chains")
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", user.externalId)
      )
      .unique();

    if (!chain) {
      throw new ConvexError("CHAIN_NOT_FOUND");
    }
    //get matchup
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    //Record loss
    chain.losses += 1;
    user.stats.losses += 1;
    user.stats.statsByLeague[matchup.league]
      ? (user.stats.statsByLeague[matchup.league].losses += 1)
      : (user.stats.statsByLeague[matchup.league] = {
          wins: 0,
          losses: 1,
          pushes: 0,
        });

    chain.chain < 0 ? (chain.chain -= 1) : (chain.chain = -1);

    console.log(`user: ${user.name} lost pick: ${pick.pick.name}`);

    //Deduct User
    user.coins -= matchup.cost;
    chain.cost -= matchup.cost;

    console.log(`user: ${user.name} lost ${matchup.cost} coins`);

    //Record Pick
    pick.status = "LOSS";
    pick.coins = -matchup.cost;
    pick.active = false;

    //Patch
    await ctx.db.patch(chain._id, chain);
    await ctx.db.patch(user._id, user);
    await ctx.db.patch(pick._id, pick);
  },
});

//HANDLE PICK PUSH

export const handlePickPush = internalMutation({
  args: { pickId: v.id("picks") },
  handler: async (ctx, { pickId }) => {
    //get pick
    const pick = await ctx.db.get(pickId);
    if (!pick) {
      throw new ConvexError("PICK_NOT_FOUND");
    }
    //get user
    const user = await ctx.db.get(pick.userId);
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    //get user active chain
    const chain = await ctx.db
      .query("chains")
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", user.externalId)
      )
      .unique();
    if (!chain) {
      throw new ConvexError("CHAIN_NOT_FOUND");
    }
    //get matchup
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    //Record push
    chain.pushes += 1;
    user.stats.pushes += 1;
    user.stats.statsByLeague[matchup.league]
      ? (user.stats.statsByLeague[matchup.league].pushes += 1)
      : (user.stats.statsByLeague[matchup.league] = {
          wins: 0,
          losses: 0,
          pushes: 1,
        });

    console.log(`user: ${user.name} pushed pick: ${pick.pick.name}`);

    //Record Pick
    pick.status = "PUSH";
    pick.coins = 0;
    pick.active = false;

    //Patch
    await ctx.db.patch(chain._id, chain);
    await ctx.db.patch(user._id, user);
    await ctx.db.patch(pick._id, pick);
  },
});

export const getPicksByMatchupId = internalQuery({
  args: { matchupId: v.id("matchups") },
  handler: async (ctx, { matchupId }) => {
    const picks = await ctx.db
      .query("picks")
      .withIndex("by_matchupId", (q) => q.eq("matchupId", matchupId))
      .collect();
    return picks;
  },
});

export const getUserActivePick = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return null;
    }
    const pick = await ctx.db
      .query("picks")
      .withIndex("by_active_externalId", (q) =>
        q.eq("active", true).eq("externalId", user.subject)
      )
      .unique();

    return pick;
  },
});

export const getUserActivePickWithMatchup = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return null;
    }
    const pick = await ctx.db
      .query("picks")
      .withIndex("by_active_externalId", (q) =>
        q.eq("active", true).eq("externalId", user.subject)
      )
      .unique();

    if (!pick) {
      return null;
    }
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) {
      return null;
    }

    return { pick, matchup };
  },
});

export const cancelPick = mutation({
  args: { pickId: v.id("picks") },
  handler: async (ctx, { pickId }) => {
    const pick = await ctx.db.get(pickId);
    if (!pick) {
      throw new ConvexError("PICK_NOT_FOUND");
    }
    //make sure matchup is not locked
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }
    if (
      matchup.status !== "STATUS_SCHEDULED" &&
      matchup.status !== "STATUS_POSTPONED"
    ) {
      throw new ConvexError("MATCHUP_ALREADY_STARTED");
    }

    //delete pick
    await ctx.db.delete(pickId);
  },
});

export const makePick = mutation({
  args: {
    matchupId: v.id("matchups"),
    pick: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
    }),
  },
  handler: async (ctx, { matchupId, pick }) => {
    //Get User
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    //Check for existing active pick
    const existingPick = await ctx.db
      .query("picks")
      .withIndex("by_active_externalId", (q) =>
        q.eq("active", true).eq("externalId", user.subject)
      )
      .unique();
    if (existingPick) {
      throw new ConvexError("EXISTING_PICK_FOUND");
    }

    //get active campaign, todo: figured out multiple campaigns
    const campaign = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(q.eq(q.field("active"), true), q.eq(q.field("type"), "GLOBAL"))
      )
      .unique();
    if (!campaign) {
      throw new ConvexError("NO_ACTIVE_CAMPAIGN_FOUND");
    }

    //get matchup to ensure it is active, not started, and cost.
    const matchup = await ctx.db.get(matchupId);
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }
    if (!matchup.active) {
      throw new ConvexError("MATCHUP_LOCKED");
    }
    if (
      matchup.status !== "STATUS_SCHEDULED" &&
      matchup.status !== "STATUS_POSTPONED"
    ) {
      throw new ConvexError("MATCHUP_ALREADY_STARTED");
    }

    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
      .unique();
    if (!userProfile) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    //try to subtract coins from user
    if (matchup.cost > 0) {
      if (userProfile.coins < matchup.cost) {
        throw new ConvexError("INSUFFICIENT_FUNDS");
      }
      //Dont subtract coins until pick locks.
    }
    //Create pick
    const pickCreated = await ctx.db.insert("picks", {
      userId: userProfile._id,
      externalId: user.subject,
      matchupId,
      campaignId: campaign._id,
      pick,
      status: "PENDING",
      active: true,
      coins: matchup.cost,
    });
    console.log(`user: ${user.nickname} made pick: ${pick.name}`);

    return pickCreated;
  },
});

export const setPickInProgress = internalMutation({
  args: { pickId: v.id("picks") },
  handler: async (ctx, { pickId }) => {
    await ctx.db.patch(pickId, { status: "STATUS_IN_PROGRESS" });
  },
});

export const setPickComplete = internalMutation({
  args: { pickId: v.id("picks"), pickStatus: pick_status },
  handler: async (ctx, { pickId, pickStatus }) => {
    await ctx.db.patch(pickId, {
      status: pickStatus,
      active: false,
    });
  },
});
