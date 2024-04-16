import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const featured_type = v.union(
  v.literal("CHAINBUILDER"),
  v.literal("SPONSORED")
);

export const matchup_type = v.union(
  v.literal("SCORE"),
  v.literal("STATS"),
  v.literal("LEADERS"),
  v.literal("BOOLEAN"),
  v.literal("CUSTOM")
);
export type MatchupType = Infer<typeof matchup_type>;

export const campaign_type = v.union(
  v.literal("GLOBAL"),
  v.literal("CHAIN"),
  v.literal("SQUAD"),
  v.literal("TOURNAMENT"),
  v.literal("BRACKET"),
  v.literal("ACHIEVEMENT")
);
export type CampaignType = Infer<typeof campaign_type>;

export const pick_status = v.union(
  v.literal("PENDING"),
  v.literal("WIN"),
  v.literal("LOSS"),
  v.literal("PUSH"),
  v.literal("STATUS_IN_PROGRESS"),
  v.literal("STATUS_UNKNOWN")
);
export type PickStatus = Infer<typeof pick_status>;

export const achievement_type = v.union(
  v.literal("CHAINWIN"),
  v.literal("CHAINLOSS"),
  v.literal("MONTHLYWIN"),
  v.literal("MONTHLYLOSS"),
  v.literal("WEEKLYWIN"),
  v.literal("WEEKLYLOSS"),
  v.literal("DAILYWIN"),
  v.literal("DAILYLOSS"),
  v.literal("SQUADWIN"),
  v.literal("SQUADLOSS"),
  v.literal("REFERRAL"),
  v.literal("COINS"),
  v.literal("FRIENDS")
);
export type AchievementType = Infer<typeof achievement_type>;

export const transaction_type = v.union(
  v.literal("DEPOSIT"),
  v.literal("WITHDRAW"),
  v.literal("PICK"),
  v.literal("REFERRAL"),
  v.literal("BONUS"),
  v.literal("GIFT"),
  v.literal("PAYOUT")
);
export const trasaction_status = v.union(
  v.literal("PENDING"),
  v.literal("COMPLETE"),
  v.literal("FAILED")
);
export type TransactionStatus = Infer<typeof trasaction_status>;
export type TransactionType = Infer<typeof transaction_type>;

export const squad_role = v.union(v.literal("MEMBER"), v.literal("OWNER"));
export type SquadRole = Infer<typeof squad_role>;
export const user_role = v.union(v.literal("USER"), v.literal("ADMIN"));
export type UserRole = Infer<typeof user_role>;

export default defineSchema({
  matchups: defineTable({
    updatedAt: v.optional(v.number()),
    startTime: v.number(),
    active: v.boolean(),
    featured: v.boolean(),
    featuredType: v.optional(featured_type),
    title: v.string(),
    league: v.string(),
    type: matchup_type,
    typeDetails: v.optional(v.string()),
    status: v.string(),
    gameId: v.string(),
    winnerId: v.optional(v.string()),
    homeTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    awayTeam: v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      image: v.string(),
    }),
    cost: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_active_league", ["league", "active"])
    .index("by_active_dates", ["active", "startTime"])
    .index("by_startTime", ["startTime"]),

  campaigns: defineTable({
    name: v.string(),
    description: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    type: campaign_type,
    ownedBy: v.optional(v.string()),
    winnerId: v.optional(v.string()),
    chainWinnerId: v.optional(v.string()),
    squadWinnerId: v.optional(v.id("squads")),
    startDate: v.number(),
    endDate: v.number(),
  }),

  picks: defineTable({
    userId: v.id("users"),
    externalId: v.string(),
    matchupId: v.id("matchups"),
    campaignId: v.id("campaigns"),
    pick: v.object({
      id: v.string(),
      name: v.string(),
      image: v.string(),
    }),
    status: pick_status,
    coins: v.optional(v.number()),
    active: v.boolean(),
  })
    .index("by_matchupId", ["matchupId"])
    .index("by_userId", ["userId"])
    .index("by_active_externalId", ["active", "externalId"]),

  squads: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    active: v.boolean(),
    featured: v.boolean(),
    slug: v.string(),
    open: v.boolean(),
    ownerId: v.id("users"),
    stats: v.object({
      wins: v.number(),
      losses: v.number(),
      pushes: v.number(),
      coins: v.number(),
    }),
    score: v.number(),
    members: v.array(
      v.object({
        userId: v.id("users"),
        role: squad_role,
        joinedAt: v.string(),
        stats: v.object({
          wins: v.number(),
          losses: v.number(),
          pushes: v.number(),
          coins: v.number(),
        }),
      })
    ),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_score", ["score"])
    .searchIndex("by_name", {
      searchField: "name",
      filterFields: ["active", "open"],
    }),

  referrals: defineTable({
    userId: v.string(),
    referredBy: v.string(),
    coins: v.number(),
  }),

  achievements: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    imageStorageId: v.id("_storage"),
    coins: v.number(),
    value: v.number(),
    type: achievement_type,
  }),

  coinTransactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: transaction_type,
    status: trasaction_status,
    from: v.optional(v.string()),
    metadata: v.optional(v.object({})),
  }),

  chains: defineTable({
    userId: v.string(),
    campaignId: v.id("campaigns"),
    active: v.boolean(),
    chain: v.number(),
    wins: v.number(),
    losses: v.number(),
    pushes: v.number(),
    best: v.number(),
    cost: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_active_userId", ["active", "userId"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
    image: v.string(),
    coins: v.number(),
    achievements: v.array(
      v.object({
        achievementId: v.id("achievements"),
        awardedAt: v.number(),
      })
    ),
    stats: v.object({
      wins: v.number(),
      losses: v.number(),
      pushes: v.number(),
      statsByLeague: v.any(),
    }),
    friends: v.array(v.id("users")),
    squadId: v.optional(v.id("squads")),
    squads: v.array(v.id("squads")),
    externalId: v.string(),
    role: user_role,
    status: v.union(v.literal("ACTIVE"), v.literal("INACTIVE")),
    metadata: v.optional(v.object({})),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["externalId"]),
});
