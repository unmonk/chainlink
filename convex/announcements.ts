import { query } from "./_generated/server";
import { v } from "convex/values";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const currentTime = new Date().getTime();

    // Then check active announcements
    const activeAnnouncements = await ctx.db
      .query("announcements")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("active", true).lte("expiresAt", currentTime)
      )
      .order("desc")
      .take(5);

    return activeAnnouncements;
  },
});
