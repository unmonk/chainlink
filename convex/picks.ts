import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { pick_status } from "./schema";
import { api } from "./_generated/api";

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
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", user.subject)
      )
      .unique();

    return pick;
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
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", user.subject)
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

    //try to subtract coins from user
    if (matchup.cost > 0) {
      const userProfile = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("externalId", user.subject))
        .unique();
      if (!userProfile) {
        throw new ConvexError("USER_NOT_FOUND");
      }
      if (userProfile.coins < matchup.cost) {
        throw new ConvexError("INSUFFICIENT_FUNDS");
      }
      //Dont subtract coins until pick locks.
    }
    //Create pick
    const pickCreated = await ctx.db.insert("picks", {
      userId: user.subject,
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
