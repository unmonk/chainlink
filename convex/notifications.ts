"use node";
import { ConvexError, v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { clerkClient } from "@clerk/nextjs/server";
import webPush from "web-push";
import { Id } from "./_generated/dataModel";

//SEND NOTIFICATION action
export const sendNotification = action({
  args: {
    notificationType: v.string(),
    clerkId: v.string(),
    payload: v.object({
      notification: v.object({
        title: v.string(),
        body: v.string(),
        icon: v.string(),
        actions: v.array(
          v.object({
            action: v.string(),
            title: v.string(),
          })
        ),
        data: v.any(),
      }),
    }),
  },
  handler: async (ctx, { clerkId, payload, notificationType }) => {
    const user = await clerkClient().users.getUser(clerkId);
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    if (
      notificationType === "pickCompletion" &&
      !user.publicMetadata.pickCompletionNotifications
    ) {
      return;
    }
    const userPushSubscriptions = user.privateMetadata
      .pushSubscriptions as webPush.PushSubscription[];
    if (!userPushSubscriptions) {
      //throw new ConvexError("USER_PUSH_SUBSCRIPTIONS_NOT_FOUND");
    }

    for (const subscription of userPushSubscriptions) {
      try {
        webPush.setVapidDetails(
          `mailto:${process.env.WEB_PUSH_EMAIL}`,
          process.env.NEXT_PUBLIC_WEB_PUSH_KEY!,
          process.env.WEB_PUSH_PRIVATE_KEY!
        );
        await webPush.sendNotification(subscription, JSON.stringify(payload));
      } catch (err) {
        if (err instanceof webPush.WebPushError) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            //Subscription is expired or invalid
            await fetch("/notification/metadata", {
              method: "POST",
              body: JSON.stringify({
                subscription,
                userId: clerkId,
                type: "unsubscribe",
              }),
            });
          }
        }
      }
    }
  },
});

//handle pick win notification
export const handlePickWinNotification = action({
  args: {
    matchupId: v.id("matchups"),
    clerkId: v.string(),
  },
  handler: async (ctx, { matchupId, clerkId }) => {
    const matchup = await ctx.runQuery(api.matchups.getMatchupById, {
      matchupId,
    });
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    const payload = {
      notification: {
        title: `Your Pick Won!`,
        body: `${matchup.title} has concluded! Make your next pick now.`,
        icon: "/images/icon-512x512.png",
        actions: [{ action: "pick", title: "Pick Now" }],
        data: {
          onActionClick: {
            default: {
              operation: "openWindow",
              pick: {
                operation: "focusLastFocusedOrOpen",
                url: "/play",
              },
            },
          },
        },
      },
    };
    await ctx.runAction(api.notifications.sendNotification, {
      notificationType: "pickCompletion",
      clerkId,
      payload,
    });
  },
});

//handle pick loss notification
export const handlePickLossNotification = action({
  args: {
    matchupId: v.id("matchups"),
    clerkId: v.string(),
  },
  handler: async (ctx, { matchupId, clerkId }) => {
    const matchup = await ctx.runQuery(api.matchups.getMatchupById, {
      matchupId,
    });
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    const payload = {
      notification: {
        title: `Your Pick Lost!`,
        body: `${matchup.title} has concluded! Make your next pick now.`,
        icon: "/images/icon-512x512.png",
        actions: [{ action: "pick", title: "Pick Now" }],
        data: {
          onActionClick: {
            default: {
              operation: "openWindow",
              pick: {
                operation: "focusLastFocusedOrOpen",
                url: "/play",
              },
            },
          },
        },
      },
    };
    await ctx.runAction(api.notifications.sendNotification, {
      notificationType: "pickCompletion",
      clerkId,
      payload,
    });
  },
});

//handle pick win notification
export const handlePickPushNotification = action({
  args: {
    matchupId: v.id("matchups"),
    clerkId: v.string(),
  },
  handler: async (ctx, { matchupId, clerkId }) => {
    const matchup = await ctx.runQuery(api.matchups.getMatchupById, {
      matchupId,
    });
    if (!matchup) {
      throw new ConvexError("MATCHUP_NOT_FOUND");
    }

    const payload = {
      notification: {
        title: `Your Pick Pushed!`,
        body: `${matchup.title} has concluded! Make your next pick now.`,
        icon: "/images/icon-512x512.png",
        actions: [{ action: "pick", title: "Pick Now" }],
        data: {
          onActionClick: {
            default: {
              operation: "openWindow",
              pick: {
                operation: "focusLastFocusedOrOpen",
                url: "/play",
              },
            },
          },
        },
      },
    };
    await ctx.runAction(api.notifications.sendNotification, {
      notificationType: "pickCompletion",
      clerkId,
      payload,
    });
  },
});
