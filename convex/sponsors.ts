import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Search sponsors
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sponsors")
      .withSearchIndex("by_name", (q) => q.search("name", args.query))
      .take(10);
  },
});

// Get all sponsors
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("sponsors").order("desc").collect();
  },
});

// Get active sponsors
export const listFeatured = query({
  handler: async (ctx) => {
    const sponsors = await ctx.db
      .query("sponsors")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();

    return sponsors
      .sort((a, b) => (a.order ?? 10000) - (b.order ?? 10000))
      .slice(0, 10); // Take first 6
  },
});

// Get featured sponsors
export const listActiveFeatured = query({
  handler: async (ctx) => {
    const sponsors = await ctx.db
      .query("sponsors")
      .withIndex("by_active_featured", (q) =>
        q.eq("active", true).eq("featured", true)
      )
      .collect();

    // Sort by order field, handling undefined values
    return sponsors.sort((a, b) => {
      const orderA = a.order ?? 10000;
      const orderB = b.order ?? 10000;
      return orderA - orderB;
    });
  },
});

// Get sponsor by ID
export const getById = query({
  args: { id: v.id("sponsors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new sponsor
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    color: v.string(),
    url: v.string(),
    tier: v.union(v.literal("GOLD"), v.literal("SILVER"), v.literal("BRONZE")),
    imageStorageId: v.id("_storage"),
    bannerImageStorageId: v.optional(v.id("_storage")),
  },

  handler: async (ctx, args) => {
    if (!args.imageStorageId) {
      throw new Error("Image is required");
    }

    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    let bannerImageUrl = undefined;
    if (args.bannerImageStorageId) {
      bannerImageUrl = await ctx.storage.getUrl(args.bannerImageStorageId);
      if (!bannerImageUrl) {
        throw new Error("Failed to get banner image URL");
      }
    }

    return await ctx.db.insert("sponsors", {
      ...args,
      image: imageUrl,
      bannerImage: bannerImageUrl,
      featured: false,
      active: false,
    });
  },
});

// Update sponsor
export const updateOrder = mutation({
  args: {
    sponsors: v.array(
      v.object({
        _id: v.id("sponsors"),
        order: v.number(),
        active: v.boolean(),
        featured: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const sponsor of args.sponsors) {
      await ctx.db.patch(sponsor._id, { order: sponsor.order });
    }
  },
});

// Toggle sponsor
export const toggle = mutation({
  args: { id: v.id("sponsors") },
  handler: async (ctx, args) => {
    const sponsor = await ctx.db.get(args.id);
    if (!sponsor) return;
    await ctx.db.patch(args.id, { active: !sponsor.active });
  },
});

// Toggle featured
export const toggleFeatured = mutation({
  args: { id: v.id("sponsors") },
  handler: async (ctx, args) => {
    const sponsor = await ctx.db.get(args.id);
    if (!sponsor) return;
    await ctx.db.patch(args.id, { featured: !sponsor.featured });
  },
});

// Delete sponsor
export const remove = mutation({
  args: { id: v.id("sponsors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const recordClick = mutation({
  args: { sponsorId: v.id("sponsors") },
  handler: async (ctx, args) => {
    const sponsor = await ctx.db.get(args.sponsorId);
    if (!sponsor) throw new Error("Sponsor not found");
    console.log(sponsor.name);

    await ctx.db.patch(args.sponsorId, {
      metadata: {
        ...sponsor.metadata,
        clicks: (sponsor.metadata?.clicks || 0) + 1,
      },
    });

    return sponsor.url;
  },
});

export const update = mutation({
  args: {
    id: v.id("sponsors"),
    name: v.string(),
    description: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    color: v.string(),
    url: v.string(),
    tier: v.union(v.literal("GOLD"), v.literal("SILVER"), v.literal("BRONZE")),
    imageStorageId: v.id("_storage"),
    bannerImageStorageId: v.optional(v.id("_storage")),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    let bannerImageUrl = undefined;
    if (args.bannerImageStorageId) {
      bannerImageUrl = await ctx.storage.getUrl(args.bannerImageStorageId);
      if (!bannerImageUrl) {
        throw new Error("Failed to get banner image URL");
      }
    }

    return await ctx.db.patch(id, {
      ...updateData,
      image: imageUrl,
      bannerImage: bannerImageUrl,
    });
  },
});
