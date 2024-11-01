"use node";
import { ConvexError, v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { clerkClient } from "@clerk/nextjs/server";
import webPush from "web-push";

export const createMassNotification = action({
  args: {
    payload: v.object({
      notification: v.object({
        title: v.string(),
        message: v.string(),
        icon: v.string(),
        badge: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        image: v.optional(v.string()),
        actions: v.array(
          v.object({
            action: v.string(),
            title: v.string(),
          })
        ),
        data: v.any(),
        clickActionUrl: v.optional(v.string()),
        tag: v.optional(v.string()),
      }),
    }),
  },
  handler: async (ctx, { payload }) => {
    console.log("Creating mass notification", payload);
    const users = await (
      await clerkClient()
    ).users.getUserList({
      limit: 1000,
    });
    const imageUrl =
      payload.notification.storageId &&
      (await ctx.storage.getUrl(payload.notification.storageId));

    let notificationsSent = 0;
    for (const user of users.data) {
      const userPushSubscriptions = user.privateMetadata
        .pushSubscriptions as webPush.PushSubscription[];
      if (!userPushSubscriptions) {
        continue;
        //throw new ConvexError("USER_PUSH_SUBSCRIPTIONS_NOT_FOUND");
      }
      for (const subscription of userPushSubscriptions) {
        console.log(
          "Sending notification to",
          user.username,
          subscription.endpoint
        );

        try {
          webPush.setVapidDetails(
            `mailto:${process.env.WEB_PUSH_EMAIL}`,
            process.env.NEXT_PUBLIC_WEB_PUSH_KEY!,
            process.env.WEB_PUSH_PRIVATE_KEY!
          );

          console.log("Sending notification", {
            ...payload.notification,
            image: imageUrl,
            badge: imageUrl,
            icon: imageUrl,
            url: payload.notification.clickActionUrl,
            tag: payload.notification.tag,
          });

          await webPush.sendNotification(
            subscription,
            JSON.stringify({
              ...payload.notification,
              image: imageUrl,
              badge: imageUrl,
              icon: imageUrl,
              url: payload.notification.clickActionUrl,
              tag: payload.notification.tag,
            })
          );
          notificationsSent++;
        } catch (err) {
          if (err instanceof webPush.WebPushError) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              //Subscription is expired or invalid
              await fetch("/notification/metadata", {
                method: "POST",
                body: JSON.stringify({
                  subscription,
                  userId: user.id,
                  type: "unsubscribe",
                }),
              });
            }
          }
        }
      }
    }
    return notificationsSent;
  },
});

//SEND NOTIFICATION action
export const sendNotification = action({
  args: {
    notificationType: v.string(),
    clerkId: v.string(),
    payload: v.object({
      notification: v.object({
        title: v.string(),
        message: v.string(),
        icon: v.string(),
        badge: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        image: v.optional(v.string()),
        actions: v.array(
          v.object({
            action: v.string(),
            title: v.string(),
          })
        ),
        data: v.any(),
        clickActionUrl: v.optional(v.string()),
        tag: v.optional(v.string()),
      }),
    }),
  },
  handler: async (ctx, { clerkId, payload, notificationType }) => {
    const user = await (await clerkClient()).users.getUser(clerkId);
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }
    if (payload.notification.storageId) {
      const imageUrl = await ctx.storage.getUrl(payload.notification.storageId);
      if (imageUrl) {
        payload.notification.image = imageUrl;
      }
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
        await webPush.sendNotification(
          subscription,
          JSON.stringify(payload.notification)
        );
      } catch (err) {
        if (err instanceof webPush.WebPushError) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            //Subscription is expired or invalid
            try {
              await fetch("/notification/metadata", {
                method: "POST",
                body: JSON.stringify({
                  subscription,
                  userId: clerkId,
                  type: "unsubscribe",
                }),
              });
            } catch (err) {
              console.error("Error unsubscribing user", err);
            }
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
        message: `${matchup.title} has concluded! Make your next pick now.`,
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
        message: `${matchup.title} has concluded! Make your next pick now.`,
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
        message: `${matchup.title} has concluded! Make your next pick now.`,
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
