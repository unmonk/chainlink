import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new reaction
export const create = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.string()),
    team: v.optional(v.union(v.literal("HOME"), v.literal("AWAY"))),
    active: v.boolean(),
    premium: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reactions", {
      ...args,
      imageStorageId: args.imageStorageId as Id<"_storage"> | undefined,
    });
  },
});

// Get all reactions
export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.activeOnly) {
      return await ctx.db
        .query("reactions")
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect();
    }
    return await ctx.db.query("reactions").collect();
  },
});

// Get a single reaction by ID
export const getById = query({
  args: { id: v.id("reactions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update a reaction
export const update = mutation({
  args: {
    id: v.id("reactions"),
    code: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.string()),
    team: v.optional(v.union(v.literal("HOME"), v.literal("AWAY"))),
    active: v.optional(v.boolean()),
    premium: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      imageStorageId: updates.imageStorageId as Id<"_storage"> | undefined,
    });
  },
});

// Delete a reaction
export const remove = mutation({
  args: { id: v.id("reactions") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const removeMatchupReaction = mutation({
  args: { id: v.id("matchupReactions") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getMatchupReactions = query({
  args: { matchupId: v.id("matchups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matchupReactions")
      .withIndex("by_matchup", (q) => q.eq("matchupId", args.matchupId))
      .collect();
  },
});

// Add a user reaction to a matchup
export const addUserReaction = mutation({
  args: {
    matchupId: v.id("matchups"),
    reactionId: v.id("reactions"),
    team: v.union(v.literal("HOME"), v.literal("AWAY")),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.tokenIdentifier) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user already has a reaction for this team on this matchup
    const existingReaction = await ctx.db
      .query("matchupReactions")
      .withIndex("by_matchup_team_userId", (q) =>
        q
          .eq("matchupId", args.matchupId)
          .eq("team", args.team)
          .eq("userId", user._id)
      )
      .first();

    if (existingReaction) {
      throw new Error("User already has a reaction for this team");
    }

    // Create the new user reaction
    return await ctx.db.insert("matchupReactions", {
      userId: user._id,
      matchupId: args.matchupId,
      reactionId: args.reactionId,
      team: args.team,
    });
  },
});
