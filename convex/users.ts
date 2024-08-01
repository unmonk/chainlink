import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { QueryCtx, mutation, query } from "./_generated/server";
import { transaction_type } from "./schema";

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
      if (
        user.name !== identity.preferredUsername
          ? identity.preferredUsername
          : identity.name
      ) {
        await ctx.db.patch(user._id, {
          name: identity.preferredUsername
            ? identity.preferredUsername
            : identity.name,
        });
      }
      return user._id;
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.preferredUsername
        ? identity.preferredUsername
        : identity.name
          ? identity.name
          : "",
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
