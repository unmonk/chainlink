import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getSquad = query({
  args: { squadId: v.id("squads") },
  handler: async (ctx, { squadId }) => {
    const squad = await ctx.db.get(squadId);
    return squad;
  },
});

export const getSquadBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const squad = await ctx.db
      .query("squads")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    return squad;
  },
});

export const getUserSquad = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      return null;
    }
    //get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", auth.subject))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.squadId) {
      return null;
    }
    //get squad
    const squad = await ctx.db.get(user.squadId);
    return squad;
  },
});

export const leaveSquad = mutation({
  args: { squadId: v.id("squads") },
  handler: async (ctx, { squadId }) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", auth.subject))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.squadId) {
      throw new Error("User does not have a squad");
    }

    const squad = await ctx.db.get(user.squadId);
    if (!squad) {
      throw new Error("Squad not found");
    }

    await ctx.db.patch(user.squadId, {
      members: squad.members.filter((member) => member.userId !== user._id),
    });

    await ctx.db.patch(user._id, {
      squadId: undefined,
    });

    return squad;
  },
});

export const joinSquad = mutation({
  args: { squadId: v.id("squads") },
  handler: async (ctx, { squadId }) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", auth.subject))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    if (user.squadId) {
      throw new Error("User already has a squad");
    }

    const squad = await ctx.db.get(squadId);
    if (!squad) {
      throw new Error("Squad not found");
    }

    await ctx.db.patch(squadId, {
      members: [
        ...squad.members,
        {
          userId: user._id,
          role: "MEMBER",
          joinedAt: new Date().getTime(),
          stats: { coins: 0, wins: 0, losses: 0, pushes: 0 },
        },
      ],
    });

    await ctx.db.patch(user._id, {
      squadId: squadId,
    });

    return squad;
  },
});

export const getMostRecentSquads = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const squads = await ctx.db.query("squads").order("desc").take(limit);
    return squads;
  },
});

export const searchSquads = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const squads = await ctx.db
      .query("squads")
      .withSearchIndex("by_name", (q) =>
        q.search("name", query).eq("active", true)
      )
      .take(10);
    return squads;
  },
});

export const createSquad = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    storageId: v.id("_storage"),
    image: v.string(),
    slug: v.string(),
    open: v.boolean(),
  },
  handler: async (ctx, { name, description, storageId, slug, open }) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", auth.subject))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    if (user.squadId) {
      throw new Error("User already has a squad");
    }

    const storageUrl = await ctx.storage.getUrl(storageId);

    console.log("storageUrl", storageUrl);

    const squad = await ctx.db.insert("squads", {
      name,
      description,
      image: storageUrl || "",
      slug,
      open,
      active: true,
      featured: false,
      ownerId: user._id,
      score: 0,
      stats: {
        coins: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        statsByLeague: {},
      },
      members: [
        {
          userId: user._id,
          stats: { coins: 0, wins: 0, losses: 0, pushes: 0 },
          role: "OWNER",
          joinedAt: new Date().getTime(),
        },
      ],
      monthlyStats: {},
    });

    await ctx.db.patch(user._id, {
      squadId: squad,
    });

    return squad;
  },
});

export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});
