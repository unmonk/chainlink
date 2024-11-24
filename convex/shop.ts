import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

export const getShopItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("shopItems")
      .withIndex("by_active", (q) => q.eq("active", true))
      .take(10);
  },
});

export const getFeaturedItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("shopItems")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(3);
  },
});

export const getAllItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("shopItems").take(50);
  },
});

export const createPurchase = mutation({
  args: { itemId: v.id("shopItems") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user) throw new Error("User not found");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    if (user.coins < item.price) throw new Error("Insufficient balance");

    await ctx.scheduler.runAfter(0, api.users.adjustCoins, {
      userId: user._id,
      amount: -item.price,
      transactionType: "SHOP",
    });

    await ctx.db.insert("purchases", {
      userId: user._id,
      itemId: args.itemId,
      purchasedAt: Date.now(),
    });

    if (item.type === "BACKGROUND") {
      //patch user metadata
      await ctx.db.patch(user._id, {
        metadata: {
          avatarBackgrounds: [
            ...(user.metadata?.avatarBackgrounds ?? []),
            item.metadata?.avatarBackground ?? "",
          ],
          avatarBackground: item.metadata?.avatarBackground,
        },
      });
    }

    return true;
  },
});

export const createItem = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    type: v.union(
      v.literal("BACKGROUND"),
      v.literal("STICKER"),
      v.literal("MERCH")
    ),
    preview: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verify admin status
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");

    return await ctx.db.insert("shopItems", {
      ...args,
      metadata: {
        avatarBackground: args.type === "BACKGROUND" ? args.preview : undefined,
      },
    });
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("shopItems"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    type: v.union(
      v.literal("BACKGROUND"),
      v.literal("STICKER"),
      v.literal("MERCH")
    ),
    preview: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verify admin status
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");

    const { id, ...data } = args;
    return await ctx.db.patch(id, {
      ...data,
      metadata: {
        avatarBackground: data.type === "BACKGROUND" ? data.preview : undefined,
      },
    });
  },
});

export const deleteItem = mutation({
  args: { id: v.id("shopItems") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verify admin status
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

export const getPurchases = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("purchases")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .take(50);
  },
});
