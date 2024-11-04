import { ConvexError, GenericId, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { achievement_type, AchievementType, pick_status } from "./schema";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { userQuery } from "./users";

export const getMonthlyChainWinAchievement = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("achievements")
      .withIndex("by_type_threshold", (q) => q.eq("type", "CAMPAIGNCHAIN"))
      .unique();
  },
});

export const getMonthlyWinAchievement = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("achievements")
      .withIndex("by_type_threshold", (q) => q.eq("type", "CAMPAIGNWINS"))
      .unique();
  },
});

export const checkPickAchievements = mutation({
  args: {
    chain: v.object({
      wins: v.number(),
      losses: v.number(),
      pushes: v.number(),
      best: v.number(),
      chain: v.number(),
      cost: v.number(),
    }),
    user: v.object({
      _id: v.id("users"),
      achievements: v.array(
        v.object({
          achievementId: v.id("achievements"),
          awardedAt: v.number(),
        })
      ),
      externalId: v.string(),
      stats: v.object({
        wins: v.number(),
        losses: v.number(),
        pushes: v.number(),
        statsByLeague: v.any(),
      }),
    }),
  },
  handler: async (ctx, { chain, user }) => {
    //check if chain is negative
    let isNegative = chain.chain < 0;
    let absoluteChain = Math.abs(chain.chain);
    //check if chain is dividable by 5 or 10
    if (
      absoluteChain !== 0 &&
      (absoluteChain % 5 === 0 || absoluteChain % 10 === 0)
    ) {
      //HANDLE CHAIN ACHIEVEMENTS
      const achievementType: AchievementType = isNegative
        ? "CHAINLOSS"
        : "CHAINWIN";
      const achievement = await ctx.db
        .query("achievements")
        .withIndex("by_type_threshold", (q) =>
          q.eq("type", achievementType).eq("threshold", absoluteChain)
        )
        .unique();
      if (achievement) {
        //check if user already has this achievement
        user.achievements.forEach((a) => {
          if (a.achievementId === achievement._id) {
            console.log(
              `Achievement ${achievement._id} already awarded to user ${user._id}`
            );
            return;
          }
        });
        await awardAchievementToUser(ctx, {
          userId: user._id,
          achievementId: achievement._id,
        });
        //send notification
        await ctx.scheduler.runAfter(0, api.notifications.sendNotification, {
          notificationType: "achievement",
          clerkId: user.externalId,
          payload: {
            notification: {
              title: `${achievement.name} Achievement Unlocked!`,
              message: achievement.description,
              icon: "/images/icon-512x512.png",
              actions: [{ action: "achievement", title: "View Achievement" }],
              data: {
                onActionClick: {
                  default: {
                    operation: "openWindow",
                  },
                },
              },
            },
          },
        });
      }
    }

    if (chain.wins !== 0 && (chain.wins % 5 === 0 || chain.wins % 10 === 0)) {
      //handle wins achievement
      const achievementType: AchievementType = "WINS";
      const achievement = await ctx.db
        .query("achievements")
        .withIndex("by_type_threshold", (q) =>
          q.eq("type", achievementType).eq("threshold", chain.wins)
        )
        .unique();
      if (achievement) {
        //check if user already has this achievement
        user.achievements.forEach((a) => {
          if (a.achievementId === achievement._id) {
            console.log(
              `Achievement ${achievement._id} already awarded to user ${user._id}`
            );
            return;
          }
        });
        await awardAchievementToUser(ctx, {
          userId: user._id,
          achievementId: achievement._id,
        });
        //send notification
        await ctx.scheduler.runAfter(0, api.notifications.sendNotification, {
          notificationType: "achievement",
          clerkId: user.externalId,
          payload: {
            notification: {
              title: `${achievement.name} Achievement Unlocked!`,
              message: achievement.description,
              icon: "/images/icon-512x512.png",
              actions: [{ action: "achievement", title: "View Achievement" }],
              data: {
                onActionClick: {
                  default: {
                    operation: "openWindow",
                  },
                },
              },
            },
          },
        });
      }
    }
    if (
      user.stats.losses !== 0 &&
      (user.stats.losses % 5 === 0 || user.stats.losses % 10 === 0)
    ) {
      //handle losses achievement
      const achievementType: AchievementType = "LOSS";
      const achievement = await ctx.db
        .query("achievements")
        .withIndex("by_type_threshold", (q) =>
          q.eq("type", achievementType).eq("threshold", user.stats.losses)
        )
        .unique();
      if (achievement) {
        //check if user already has this achievement
        user.achievements.forEach((a) => {
          if (a.achievementId === achievement._id) {
            console.log(
              `Achievement ${achievement._id} already awarded to user ${user._id}`
            );
            return;
          }
        });
        await awardAchievementToUser(ctx, {
          userId: user._id,
          achievementId: achievement._id,
        });
        //send notification
        await ctx.scheduler.runAfter(0, api.notifications.sendNotification, {
          notificationType: "achievement",
          clerkId: user.externalId,
          payload: {
            notification: {
              title: `${achievement.name} Achievement Unlocked!`,
              message: achievement.description,
              icon: "/images/icon-512x512.png",
              actions: [{ action: "achievement", title: "View Achievement" }],
              data: {
                onActionClick: {
                  default: {
                    operation: "openWindow",
                  },
                },
              },
            },
          },
        });
      }
    }
    if (
      user.stats.pushes !== 0 &&
      (user.stats.pushes % 5 === 0 || user.stats.pushes % 10 === 0)
    ) {
      //handle pushes achievement
      const achievementType: AchievementType = "PUSH";
      const achievement = await ctx.db
        .query("achievements")
        .withIndex("by_type_threshold", (q) =>
          q.eq("type", achievementType).eq("threshold", user.stats.pushes)
        )
        .unique();
      if (achievement) {
        //check if user already has this achievement
        user.achievements.forEach((a) => {
          if (a.achievementId === achievement._id) {
            console.log(
              `Achievement ${achievement._id} already awarded to user ${user._id}`
            );
            return;
          }
        });
        await awardAchievementToUser(ctx, {
          userId: user._id,
          achievementId: achievement._id,
        });
        //send notification
        await ctx.scheduler.runAfter(0, api.notifications.sendNotification, {
          notificationType: "achievement",
          clerkId: user.externalId,
          payload: {
            notification: {
              title: `${achievement.name} Achievement Unlocked!`,
              message: achievement.description,
              icon: "/images/icon-512x512.png",
              actions: [{ action: "achievement", title: "View Achievement" }],
              data: {
                onActionClick: {
                  default: {
                    operation: "openWindow",
                  },
                },
              },
            },
          },
        });
      }
    }
  },
});

export const listAchievements = query({
  args: {},
  handler: async (ctx) => {
    //get storage url
    const achievements = await ctx.db.query("achievements").collect();

    //get image
    const achievementsWithUrls = await Promise.all(
      achievements.map(async (a) => ({
        ...a,
        image: await ctx.storage.getUrl(a.imageStorageId),
      }))
    );
    return achievementsWithUrls;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createAchievement = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    image: v.string(),
    imageStorageId: v.id("_storage"),
    coins: v.number(),
    type: achievement_type,
    weight: v.number(),
    threshold: v.number(),
  },
  handler: async (
    ctx,
    { name, description, image, coins, type, weight, threshold, imageStorageId }
  ) => {
    const storageUrl = await ctx.storage.getUrl(imageStorageId);

    return await ctx.db.insert("achievements", {
      name,
      description,
      image: storageUrl || "",
      coins,
      type,
      weight,
      threshold,
      imageStorageId,
    });
  },
});

export const updateAchievement = mutation({
  args: {
    id: v.id("achievements"),
    name: v.string(),
    description: v.string(),
    image: v.string(),
    imageStorageId: v.id("_storage"),
    coins: v.number(),
    type: achievement_type,
    weight: v.number(),
    threshold: v.number(),
  },
  handler: async (
    ctx,
    {
      id,
      name,
      description,
      image,
      coins,
      type,
      weight,
      threshold,
      imageStorageId,
    }
  ) => {
    return await ctx.db.patch(id, {
      name,
      description,
      image,
      coins,
      type,
      weight,
      threshold,
      imageStorageId,
    });
  },
});

export const getAchievementsByClerkUserId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await userQuery(ctx, clerkUserId);
    if (!user) {
      return [];
    }
    //get achievements from user.achievements
    const achievements = await Promise.all(
      user.achievements.map(async (a) => await ctx.db.get(a.achievementId))
    );
    //merge achievement with user.achievements to include awardedAt
    const achievementsWithAwardedAt = await Promise.all(
      achievements.map(async (a) => {
        if (a === null) return null;
        return {
          ...a,
          image: await ctx.storage.getUrl(a.imageStorageId),
          awardedAt: user.achievements.find((ua) => ua.achievementId === a._id)
            ?.awardedAt,
        };
      })
    );
    return achievementsWithAwardedAt;
  },
});

export const getAchievementsByIds = query({
  args: {
    ids: v.array(v.id("achievements")),
  },
  handler: async (ctx, { ids }) => {
    const achievements: Doc<"achievements">[] = [];

    await Promise.all(
      ids.map(async (id) => {
        const achievement = await ctx.db.get(id);
        if (achievement) {
          achievements.push(achievement);
        }
      })
    );

    const achievementsWithImage = await Promise.all(
      achievements.map(async (a) => ({
        ...a,
        image: await ctx.storage.getUrl(a.imageStorageId),
      }))
    );
    return achievementsWithImage;
  },
});

export const awardAchievementToUser = mutation({
  args: {
    userId: v.id("users"),
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, { userId, achievementId }) => {
    const achievement = await ctx.db.get(achievementId);
    if (!achievement) {
      throw new ConvexError("ACHIEVEMENT_NOT_FOUND");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }
    if (
      achievement.type !== "CAMPAIGNCHAIN" &&
      achievement.type !== "CAMPAIGNWINS"
    ) {
      user.achievements.forEach((a) => {
        if (a.achievementId === achievementId) {
          console.log(
            `Achievement ${achievementId} already awarded to user ${userId}`
          );
          return;
        }
      });
    }
    //give achievement
    await ctx.db.patch(user._id, {
      achievements: user.achievements.concat({
        achievementId,
        awardedAt: new Date().getTime(),
      }),
    });

    //Give reward
    if (achievement.coins > 0) {
      await ctx.scheduler.runAfter(0, api.users.addCoins, {
        amount: achievement.coins,
        transactionType: "ACHIEVEMENT",
        userId: user._id,
      });
    }
  },
});

export const awardAchievement = mutation({
  args: {
    userId: v.string(),
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, { userId, achievementId }) => {
    const achievement = await ctx.db.get(achievementId);
    if (!achievement) {
      throw new ConvexError("ACHIEVEMENT_NOT_FOUND");
    }
    const user = await userQuery(ctx, userId);
    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    //check if user has already won this achievement for some types
    if (
      achievement.type === "COINS" ||
      achievement.type === "FRIENDS" ||
      achievement.type === "REFERRAL"
    ) {
      user.achievements.forEach((a) => {
        if (a.achievementId === achievementId) {
          console.log(
            `Achievement ${achievementId} already awarded to user ${userId}`
          );
          return;
        }
      });
    }

    //give achievement
    await ctx.db.patch(user._id, {
      achievements: user.achievements.concat({
        achievementId,
        awardedAt: new Date().getTime(),
      }),
    });

    //Give reward
    if (achievement.coins > 0) {
      await ctx.scheduler.runAfter(0, api.users.addCoins, {
        amount: achievement.coins,
        transactionType: "ACHIEVEMENT",
        userId: user._id,
      });
    }
  },
});
