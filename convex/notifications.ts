"use node";
import { ConvexError, v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { clerkClient } from "@clerk/nextjs/server";
import webPush from "web-push";

// Add a shared interface for notification payload
interface PickNotificationPayload {
  notification: {
    title: string;
    message: string;
    icon: string;
    actions: Array<{ action: string; title: string }>;
    data: {
      onActionClick: {
        default: {
          operation: string;
          pick: {
            operation: string;
            url: string;
          };
        };
      };
    };
  };
}

// Fix error handling in createMassNotification
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
    console.log("Starting mass notification");
    const users = await clerkClient().users.getUserList({
      limit: 1000,
      orderBy: "+username",
    });
    console.log(`Found ${users.data.length} users`);

    const imageUrl =
      payload.notification.storageId &&
      (await ctx.storage.getUrl(payload.notification.storageId));

    let notificationsSent = 0;
    let skippedUsers = 0;

    for (const user of users.data) {
      const userPushSubscriptions = user.privateMetadata
        .pushSubscriptions as webPush.PushSubscription[];

      if (!userPushSubscriptions?.length) {
        skippedUsers++;
        console.log(`Skipping user ${user.id} - no push subscriptions`);
        continue;
      }

      console.log(
        `Processing user ${user.id} with ${userPushSubscriptions.length} subscriptions`
      );

      for (const subscription of userPushSubscriptions) {
        try {
          webPush.setVapidDetails(
            `mailto:${process.env.WEB_PUSH_EMAIL}`,
            process.env.NEXT_PUBLIC_WEB_PUSH_KEY!,
            process.env.WEB_PUSH_PRIVATE_KEY!
          );

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
          console.error(`Error sending notification to user ${user.id}:`, err);

          if (err instanceof webPush.WebPushError) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              console.log(`Removing invalid subscription for user ${user.id}`);
              try {
                await unsubscribeUserFromPush(subscription, user.id);
              } catch (unsubErr) {
                console.error(
                  "Error in mass notification unsubscribe:",
                  unsubErr
                );
                // Continue with other notifications even if unsubscribe fails
              }
            }
          }
        }
      }
    }

    console.log(`Mass notification complete:
      - Total users: ${users.data.length}
      - Notifications sent: ${notificationsSent}
      - Users skipped: ${skippedUsers}
    `);

    return {
      totalUsers: users.data.length,
      notificationsSent,
      skippedUsers,
    };
  },
});

export const sendDailyPickReminder = action({
  args: {}, // No arguments for now
  handler: async (ctx) => {
    console.log("Starting daily pick reminder");

    const payload: DailyPickReminderNotificationPayload = {
      title: "Daily Pick Reminder",
      message: "Don't forget to make your picks for today! Good luck!",
      icon: "/icons/icon-512x512.png", // Assuming this path is correct
      actions: [{ action: "openPicks", title: "Make Your Picks" }],
      data: {
        onActionClick: {
          default: { operation: "openWindow" },
          openPicks: {
            operation: "focusLastFocusedOrOpen",
            url: "/play", // URL where users make picks
          },
        },
      },
      tag: "daily-pick-reminder",
    };

    const users = await clerkClient().users.getUserList({
      limit: 1000, // Adjust limit as needed
      orderBy: "+username",
    });
    console.log(`Found ${users.data.length} users for daily reminder`);

    let notificationsSent = 0;
    let skippedUsers = 0;

    for (const user of users.data) {
      const userPushSubscriptions = user.privateMetadata
        .pushSubscriptions as webPush.PushSubscription[];

      if (!userPushSubscriptions?.length) {
        skippedUsers++;
        console.log(
          `Skipping user ${user.id} for daily reminder - no push subscriptions`
        );
        continue;
      }

      console.log(
        `Processing user ${user.id} for daily reminder with ${userPushSubscriptions.length} subscriptions`
      );

      for (const subscription of userPushSubscriptions) {
        try {
          webPush.setVapidDetails(
            `mailto:${process.env.WEB_PUSH_EMAIL}`,
            process.env.NEXT_PUBLIC_WEB_PUSH_KEY!,
            process.env.WEB_PUSH_PRIVATE_KEY!
          );

          await webPush.sendNotification(
            subscription,
            JSON.stringify(payload) // Send the new payload structure
          );
          notificationsSent++;
        } catch (err) {
          console.error(
            `Error sending daily reminder to user ${user.id}:`,
            err
          );

          if (err instanceof webPush.WebPushError) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              console.log(
                `Removing invalid subscription for user ${user.id} during daily reminder`
              );
              try {
                await unsubscribeUserFromPush(subscription, user.id);
              } catch (unsubErr) {
                console.error("Error in daily reminder unsubscribe:", unsubErr);
              }
            }
          }
        }
      }
    }

    console.log(`Daily pick reminder complete:
      - Total users processed: ${users.data.length}
      - Notifications sent: ${notificationsSent}
      - Users skipped: ${skippedUsers}
    `);

    return {
      totalUsers: users.data.length,
      notificationsSent,
      skippedUsers,
    };
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
    const userPushSubscriptions = user.privateMetadata.pushSubscriptions as
      | webPush.PushSubscription[]
      | undefined;
    if (!userPushSubscriptions?.length) {
      return;
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
            try {
              await unsubscribeUserFromPush(subscription, clerkId);
            } catch (unsubErr) {
              console.error(
                "Error in single notification unsubscribe:",
                unsubErr
              );
              // Continue with other subscriptions even if unsubscribe fails
            }
          }
        }
      }
    }
  },
});

async function unsubscribeUserFromPush(
  subscription: webPush.PushSubscription,
  userId: string
) {
  try {
    // Use the Clerk API directly instead of making a fetch request
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const currentSubscriptions = (user.privateMetadata.pushSubscriptions ||
      []) as webPush.PushSubscription[];
    const updatedSubscriptions = currentSubscriptions.filter(
      (sub) => sub.endpoint !== subscription.endpoint
    );

    await clerk.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        pushSubscriptions: updatedSubscriptions,
      },
    });
  } catch (unknownError) {
    const error = unknownError as Error;
    console.error("Failed to unsubscribe user:", userId, error);
    throw new ConvexError(`Failed to unsubscribe user: ${error.message}`);
  }
}

// Add a shared interface for daily pick reminder notification payload
export interface DailyPickReminderNotificationPayload {
  title: string;
  message: string;
  icon: string;
  actions: Array<{ action: string; title: string }>;
  data: {
    onActionClick: {
      default: { operation: string };
      openPicks?: { operation: string; url: string };
    };
  };
  tag: string;
}

// Create a helper function for pick notifications
function createPickNotificationPayload(
  title: string,
  matchup: any
): PickNotificationPayload {
  return {
    notification: {
      title,
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
}

export const handlePickWinNotification = action({
  args: {
    matchupId: v.id("matchups"),
    clerkId: v.string(),
  },
  handler: async (ctx, { matchupId, clerkId }) => {
    const matchup = await ctx.runQuery(api.matchups.getMatchupById, {
      matchupId,
    });
    if (!matchup) throw new ConvexError("MATCHUP_NOT_FOUND");

    const payload = createPickNotificationPayload("Your Pick Won!", matchup);
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
    if (!matchup) throw new ConvexError("MATCHUP_NOT_FOUND");

    const payload = createPickNotificationPayload("Your Pick Lost!", matchup);
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

    const payload = createPickNotificationPayload("Your Pick Pushed!", matchup);
    await ctx.runAction(api.notifications.sendNotification, {
      notificationType: "pickCompletion",
      clerkId,
      payload,
    });
  },
});
