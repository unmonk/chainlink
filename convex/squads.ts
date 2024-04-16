import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSquad = query({
  args: { squadId: v.id("squads") },
  handler: async (ctx, { squadId }) => {
    const squad = await ctx.db.get(squadId);
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
      return null;
    }
    if (!user.squadId) {
      return null;
    }
    //get squad
    const squad = await ctx.db.get(user.squadId);
    return squad;
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

// export const createSquad = mutation({
//     args: {
//         name: v.string(),
//         description: v.string(),
//         open: v.boolean()

//     },
//     handler: async (ctx, { name, description }) => {
//         const auth = await ctx.auth.getUserIdentity();
//         if (!auth) {
//         throw new Error("Unauthorized");
//         }
//         const user = await ctx.db
//         .query("users")
//         .withIndex("by_clerk_id", (q) => q.eq("externalId", auth.subject))
//         .unique();
//         if (!user) {
//         throw new Error("User not found");
//         }
//         if(user.squadId){
//         throw new Error("User already has a squad");
//         }
//         const squad = await ctx.db.insert("squads", {
//             name,
//             description,
//             active: true,
//             open

//         return squad;
//     },
//     });

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
