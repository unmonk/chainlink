"use node";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const sendDailyPickReminder = internalAction({
  args: {},
  handler: async (ctx) => {
    const payload = {
      notification: {
        title: "🔥 Daily Pick Reminder",
        message: "Don't forget to make your pick for today's matchups!",
        icon: "/icons/icon-512x512.png",
        actions: [{ action: "pick", title: "Make Your Pick" }],
        data: {
          onActionClick: {
            default: {
              operation: "openWindow",
              url: "/play",
            },
            pick: {
              operation: "openWindow",
              url: "/play",
            },
          },
        },
        clickActionUrl: "/play",
        tag: "daily-pick-reminder",
      },
    };

    await ctx.runAction(internal.notifications.createMassNotification, {
      payload,
    });
  },
});
