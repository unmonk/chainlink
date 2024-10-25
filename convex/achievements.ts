import { ConvexError, GenericId, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { achievement_type, pick_status } from "./schema";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { userQuery } from "./users";

export const listAchievements = query({
  args: {},
  handler: async (ctx) => {
    //get storage url
    const achievements = await ctx.db.query("achievements").collect();
    const achievementsWithImage = await Promise.all(
      achievements.map(async (achievement) => ({
        ...achievement,
        image: await ctx.storage.getUrl(achievement.imageStorageId),
      }))
    );
    return achievementsWithImage;
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
    return await ctx.db.insert("achievements", {
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
      throw new ConvexError("USER_NOT_FOUND");
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
