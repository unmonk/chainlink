import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { announcement_type } from "./schema";
import { sendNewsNotification } from "./discord";
import { api } from "./_generated/api";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const currentTime = new Date().getTime();

    // Then check active announcements
    const activeAnnouncements = await ctx.db
      .query("announcements")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("active", true).gte("expiresAt", currentTime)
      )
      .order("desc")
      .take(15);

    return activeAnnouncements;
  },
});

export const getAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    const announcements = await ctx.db
      .query("announcements")
      .order("desc")
      .take(15);
    return announcements;
  },
});

export const getById = query({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const announcement = await ctx.db.get(args.id);
    return announcement;
  },
});

export const createAnnouncement = mutation({
  args: {
    announcement: v.object({
      title: v.string(),
      content: v.string(),
      type: announcement_type,
      priority: v.number(),
      active: v.boolean(),
      expiresAt: v.number(),
      image: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      link: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const announcement = await ctx.db.insert("announcements", {
      active: args.announcement.active,
      expiresAt: args.announcement.expiresAt,
      title: args.announcement.title,
      content: args.announcement.content,
      priority: args.announcement.priority,
      type: args.announcement.type,
      image: args.announcement.image,
      imageStorageId: args.announcement.imageStorageId,
      link: args.announcement.link,
    });
    // try {
    //   await ctx.scheduler.runAfter(0, api.discord.sendNewsNotification, {
    //     title: args.announcement.title,
    //     description: args.announcement.content,
    //     type: args.announcement.type,
    //     image: args.announcement.image || undefined,
    //     url: args.announcement.link || undefined,
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
    return announcement;
  },
});

export const deleteAnnouncement = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateAnnouncement = mutation({
  args: {
    id: v.id("announcements"),
    announcement: v.object({
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      type: v.optional(announcement_type),
      priority: v.optional(v.number()),
      active: v.optional(v.boolean()),
      expiresAt: v.optional(v.number()),
      image: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      link: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.announcement);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("announcements"), active: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { active: !args.active });
  },
});
