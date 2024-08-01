import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { achievement_type, pick_status } from "./schema";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { userQuery } from "./users";

export const createAchievement = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    image: v.string(),
    imageStorageId: v.id("_storage"),
    coins: v.number(),
    type: achievement_type,
    value: v.number(),
  },
  handler: async (
    ctx,
    { name, description, image, coins, type, value, imageStorageId }
  ) => {
    return await ctx.db.insert("achievements", {
      name,
      description,
      image,
      coins,
      type,
      value,
      imageStorageId,
    });
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
