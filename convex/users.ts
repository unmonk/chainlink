import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import {
  QueryCtx,
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { transaction_type } from "./schema";
import { api, internal } from "./_generated/api";
import { formatDate } from "date-fns";

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("USER_NOT_FOUND");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.

      if (user.name !== identity.nickname) {
        console.log("UPDATING NAME");
        await ctx.db.patch(user._id, {
          ...user,
          name: identity.nickname,
        });
      }

      if (user.image !== identity.pictureUrl) {
        console.log("UPDATING IMAGE");
        await ctx.db.patch(user._id, {
          ...user,
          image: identity.pictureUrl,
        });
      }

      if (user.email !== identity.email) {
        console.log("UPDATING EMAIL");
        await ctx.db.patch(user._id, {
          ...user,
          email: identity.email,
        });
      }

      return user._id;
    } else {
      console.log("NEW USER");

      //Check if the user has legacy data
      const legacyUser = await ctx.db
        .query("legacyUsers")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .unique();
      if (legacyUser) {
        console.log("LEGACY USER: INSERTING NEW USER");

        const newUser = await ctx.db.insert("users", {
          name: identity.nickname ?? identity.subject,
          tokenIdentifier: identity.tokenIdentifier,
          email: identity.email!,
          image: identity.pictureUrl!,
          coins: legacyUser.data.coins,
          stats: {
            wins: 0,
            losses: 0,
            pushes: 0,
            statsByLeague: {},
          },
          monthlyStats: legacyUser.data.monthlyStats,
          coinStats: legacyUser.data.coinStats,
          achievements: [],
          friends: [],
          squads: [],
          role: "USER",
          status: "ACTIVE",
          externalId: identity.subject,
        });

        if (legacyUser.data.picks) {
          console.log("LEGACY USER: INSERTING PICKS");

          //get the first matchup
          const firstMatchup = await ctx.db.query("matchups").take(1);
          const firstCampaign = await ctx.db.query("campaigns").take(1);

          if (firstMatchup && firstCampaign) {
            for (const pick of legacyUser.data.picks) {
              await ctx.db.insert("picks", {
                active: false,
                status: pick.status,
                externalId: identity.subject,
                userId: newUser,
                campaignId: firstCampaign[0]._id,
                matchupId: firstMatchup[0]._id,
                pick: {
                  id: pick.pick.id.toString(),
                  name: pick.pick.name ?? "",
                  image: pick.pick.image ?? "",
                },
                coins: pick.coins,
              });
            }
          }
        }

        if (legacyUser.data.achievements) {
          console.log("LEGACY USER: AWARDING ACHIEVEMENTS");
          for (const achievement of legacyUser.data.achievements) {
            if (achievement.achievement_type === "MONTHLYSTREAKWIN") {
              //find the monthly streak achievement
              const monthlyStreakAchievement = await ctx.db
                .query("achievements")
                .withIndex("by_type_threshold", (q) =>
                  q.eq("type", "CAMPAIGNCHAIN").eq("threshold", 0)
                )
                .unique();
              if (monthlyStreakAchievement) {
                await ctx.scheduler.runAfter(
                  0,
                  api.achievements.awardAchievementToUser,
                  {
                    achievementId: monthlyStreakAchievement._id,
                    userId: newUser,
                  }
                );
              }
            }
            if (achievement.achievement_type === "MONTHLYWIN") {
              //find the monthly win achievement
              const monthlyWinAchievement = await ctx.db
                .query("achievements")
                .withIndex("by_type_threshold", (q) =>
                  q.eq("type", "CAMPAIGNWINS").eq("threshold", 0)
                )
                .unique();
              if (monthlyWinAchievement) {
                await ctx.scheduler.runAfter(
                  0,
                  api.achievements.awardAchievementToUser,
                  {
                    achievementId: monthlyWinAchievement._id,
                    userId: newUser,
                  }
                );
              }
            }
          }
        }

        console.log("LEGACY USER: DELETING LEGACY USER");
      } else {
        console.log("NEW USER: INSERTING NEW USER");
        return await ctx.db.insert("users", {
          name: identity.nickname ?? identity.subject,
          tokenIdentifier: identity.tokenIdentifier,
          email: identity.email!,
          image: identity.pictureUrl!,
          coins: 50,
          stats: {
            wins: 0,
            losses: 0,
            pushes: 0,
            statsByLeague: {},
          },
          monthlyStats: {},
          achievements: [],
          friends: [],
          squads: [],
          role: "USER",
          status: "ACTIVE",
          externalId: identity.subject,
        });
      }
    }
  },
});

export const queryByUserIds = query({
  args: {
    userIds: v.array(v.id("users")),
  },
  handler: async (ctx, { userIds }) => {
    //promise.all all the users
    return await Promise.all(
      userIds.map(async (userId) => await ctx.db.get(userId))
    );
  },
});

export const queryByClerkId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("externalId", clerkUserId))
      .unique();
  },
});

export const queryByClerkIds = query({
  args: {
    clerkUserIds: v.array(v.string()),
  },
  handler: async (ctx, { clerkUserIds }) => {
    return await Promise.all(
      clerkUserIds.map(async (clerkUserId) => {
        return await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("externalId", clerkUserId))
          .unique();
      })
    );
  },
});

export async function userQuery(ctx: QueryCtx, clerkUserId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("externalId", clerkUserId))
    .unique();
}

/** The current user, containing user preferences and Clerk user info. */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));

async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userQuery(ctx, identity.subject);
}

export const getCoins = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return 0;
    }
    return user.coins;
  },
});

export const adjustCoins = mutation({
  args: {
    amount: v.number(),
    transactionType: transaction_type,
    userId: v.id("users"),
  },
  handler: async (ctx, { amount, transactionType, userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const newBalance = user.coins + amount;
    if (newBalance < 0) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    await ctx.db.patch(user._id, { coins: newBalance });
    await ctx.db.insert("coinTransactions", {
      userId: user._id,
      amount,
      type: transactionType,
      status: "COMPLETE",
    });

    return newBalance;
  },
});

export const addCoins = mutation({
  args: {
    amount: v.number(),
    transactionType: transaction_type,
    userId: v.id("users"),
  },
  handler: async (ctx, { amount, transactionType, userId }) => {
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new Error("USER_NOT_FOUND");
    }
    await ctx.db.patch(user._id, { coins: user.coins + amount });
    await ctx.db.insert("coinTransactions", {
      userId: user._id,
      amount,
      type: transactionType,
      status: "COMPLETE",
    });
  },
});

export const subtractCoins = mutation({
  args: {
    amount: v.number(),
    transactionType: transaction_type,
    userId: v.id("users"),
  },
  handler: async (ctx, { amount, transactionType, userId }) => {
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new Error("USER_NOT_FOUND");
    }
    if (user.coins < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }
    await ctx.db.patch(user._id, { coins: user.coins - amount });
    await ctx.db.insert("coinTransactions", {
      userId: user._id,
      amount,
      type: transactionType,
      status: "COMPLETE",
    });
  },
});

export const updateUserMonthlyStats = internalMutation({
  args: {
    user: v.object({
      _id: v.id("users"),
      monthlyStats: v.any(),
    }),
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, { user, dryRun }) => {
    if (dryRun) {
      console.log("UPDATING MONTHLY STATS");
      console.log(user.monthlyStats);
    }
    if (!dryRun) {
      await ctx.db.patch(user._id, {
        monthlyStats: {
          ...user.monthlyStats,
        },
      });
    }
  },
});

export const monthlyStatsRecord = internalAction({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, { dryRun }) => {
    const users = await ctx.runQuery(api.users.getAllUsers);
    for (const user of users) {
      if (!user.monthlyStats) {
        user.monthlyStats = {};
      }
      // Get previous month by subtracting 1 from current month
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const currentMonth = formatDate(date, "yyyyMM");
      const currentStats = user.monthlyStats[currentMonth] || {};

      // Get the previous month's stats
      const previousMonth = formatDate(
        new Date(date.getFullYear(), date.getMonth() - 1, 1),
        "yyyyMM"
      );
      const previousStats = user.monthlyStats[previousMonth] || {
        statsByLeague: {},
        wins: 0,
        losses: 0,
        pushes: 0,
      };

      // Calculate monthly stats for each league
      const monthlyLeagueStats: Record<
        string,
        { wins: number; losses: number; pushes: number }
      > = {};

      Object.entries(user.stats.statsByLeague).forEach(
        ([league, currentLeagueStats]) => {
          const previousLeagueStats = previousStats.statsByLeague?.[league] || {
            wins: 0,
            losses: 0,
            pushes: 0,
          };

          monthlyLeagueStats[league] = {
            wins:
              (currentLeagueStats as { wins: number }).wins -
              previousLeagueStats.wins,
            losses:
              (currentLeagueStats as { losses: number }).losses -
              previousLeagueStats.losses,
            pushes:
              (currentLeagueStats as { pushes: number }).pushes -
              previousLeagueStats.pushes,
          };
        }
      );

      // Calculate monthly differences for total stats
      currentStats.wins = user.stats.wins - previousStats.wins;
      currentStats.losses = user.stats.losses - previousStats.losses;
      currentStats.pushes = user.stats.pushes - previousStats.pushes;
      currentStats.totalGames =
        currentStats.wins + currentStats.losses + currentStats.pushes;

      if (currentStats.totalGames > 0) {
        currentStats.winRate = Number(
          (currentStats.wins / currentStats.totalGames).toFixed(2)
        );
      }
      if (currentStats.totalGames === 0) {
        currentStats.winRate = 0;
      }
      currentStats.coins = user.coins;
      currentStats.statsByLeague = monthlyLeagueStats;

      if (dryRun) {
        console.log("CURRENT STATS", currentMonth, user.name);
        console.log(currentStats);
      }

      if (!dryRun) {
        await ctx.runMutation(internal.users.updateUserMonthlyStats, {
          user: {
            _id: user._id,
            monthlyStats: {
              ...user.monthlyStats,
              [currentMonth]: currentStats,
            },
          },
        });
      }
    }
    return "Monthly stats processing completed";
  },
});

export const getUserByCoins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_coins")
      .order("desc")
      .collect();
  },
});

export const getUserByWins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_wins")
      .order("desc")
      .collect();
  },
});

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getLegacyUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("legacyUsers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const addAvatarBackground = mutation({
  args: {
    userId: v.id("users"),
    background: v.string(),
  },
  handler: async (ctx, { userId, background }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    if (!user.metadata) {
      user.metadata = {
        avatarBackgrounds: [],
      };
    }
    if (!user.metadata.avatarBackgrounds) {
      user.metadata.avatarBackgrounds = [];
    }
    await ctx.db.patch(userId, {
      metadata: {
        avatarBackgrounds: [...user.metadata.avatarBackgrounds, background],
      },
    });
    return user.metadata.avatarBackgrounds;
  },
});

// Add this mutation to your existing users.ts file
export const updateAvatarBackground = mutation({
  args: {
    background: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      metadata: {
        ...user.metadata,
        avatarBackground: args.background,
      },
    });

    return true;
  },
});
