import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { setPickActive } from "./picks";
import { api, internal } from "./_generated/api";

export const getUserQueuedPicks = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) return null;

    const pickQueue = await ctx.db
      .query("pickQueue")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!pickQueue) return null;

    const picks = await Promise.all(
      pickQueue?.queue.map(async (pickId) => {
        return await ctx.db.get(pickId);
      }) ?? []
    );

    return { pickQueue, picks };
  },
});

export const removePickFromQueue = mutation({
  args: { pickId: v.id("picks"), queueId: v.id("pickQueue") },
  handler: async (ctx, { pickId, queueId }) => {
    const pickQueue = await ctx.db.get(queueId);
    if (!pickQueue) throw new Error("Pick queue not found");
    await ctx.db.patch(queueId, {
      queue: pickQueue.queue.filter((q) => q !== pickId),
    });
  },
});

// Add pick to queue
export const addPickToQueueFromMatchup = mutation({
  args: {
    matchupId: v.id("matchups"),
    pick: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
    }),
  },
  handler: async (ctx, { matchupId, pick }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Not authenticated");

    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", user.tokenIdentifier)
      )
      .unique();
    if (!userProfile) throw new Error("User not found");

    const matchup = await ctx.db.get(matchupId);
    if (!matchup) throw new Error("Matchup not found");
    if (!matchup.active) throw new Error("Matchup is not active");

    if (matchup.cost > 0) {
      if (userProfile.coins < matchup.cost) {
        throw new Error("Insufficient funds");
      }
    }

    // Get or create queue
    const queue = await ctx.db
      .query("pickQueue")
      .withIndex("by_userId", (q) => q.eq("userId", userProfile._id))
      .unique();

    if (queue && queue.queue.length >= queue.maxQueueSize) {
      throw new Error(`Queue is full (maximum ${queue.maxQueueSize} picks)`);
    }

    // Get active campaign
    const campaign = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(q.eq(q.field("active"), true), q.eq(q.field("type"), "GLOBAL"))
      )
      .unique();
    if (!campaign) throw new Error("No active campaign found");

    // Create pick
    const pickCreated = await ctx.db.insert("picks", {
      userId: userProfile._id,
      externalId: user.subject,
      campaignId: campaign._id,
      matchupId,
      pick,
      status: "PENDING",
      active: false,
    });

    // Add to queue
    if (queue) {
      await ctx.db.patch(queue._id, {
        queue: [...queue.queue, pickCreated],
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("pickQueue", {
        userId: userProfile._id,
        queue: [pickCreated],
        updatedAt: Date.now(),
        maxQueueSize: 3,
      });
    }

    return pickCreated;
  },
});

export const clearQueue = mutation({
  args: { queueId: v.id("pickQueue") },
  handler: async (ctx, { queueId }) => {
    await ctx.db.delete(queueId);
  },
});

export const processQueue = mutation({
  args: { queueId: v.id("pickQueue") },
  handler: async (ctx, { queueId }) => {
    const pickQueue = await ctx.db.get(queueId);
    if (!pickQueue) throw new Error("Pick queue not found");

    //verify the user has no active picks
    const activePicks = await ctx.db
      .query("picks")
      .withIndex("by_active_userId", (q) =>
        q.eq("active", true).eq("userId", pickQueue.userId)
      )
      .first();
    if (activePicks) throw new Error("User has an active pick");

    //process the first pick in the queue
    const firstPick = pickQueue.queue[0];
    if (!firstPick) return;

    //get the pick
    const pick = await ctx.db.get(firstPick);
    if (!pick) throw new Error("Pick not found");
    //Check if the pick is still available to be made
    const matchup = await ctx.db.get(pick.matchupId);
    if (!matchup) throw new Error("Matchup not found");
    if (matchup.status !== "STATUS_SCHEDULED")
      throw new Error("Matchup is no longer available to be made");

    //set pick as active
    await ctx.runMutation(internal.picks.setPickActive, { pickId: firstPick });

    //remove pick from queue
    await ctx.runMutation(api.pickqueue.removePickFromQueue, {
      pickId: firstPick,
      queueId: pickQueue._id,
    });

    return pick;
  },
});
