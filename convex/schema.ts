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
  v.literal("CHAINPUSH"),
  v.literal("CAMPAIGNCHAIN"),
  v.literal("CAMPAIGNWINS"),
  v.literal("WINS"),
  v.literal("LOSS"),
  v.literal("PUSH"),
  v.literal("MONTHLYWIN"),
  v.literal("MONTHLYLOSS"),
  v.literal("MONTHLYPUSH"),
  v.literal("WEEKLYWIN"),
  v.literal("WEEKLYLOSS"),
  v.literal("DAILYWIN"),
  v.literal("DAILYLOSS"),
  v.literal("SQUADWIN"),
  v.literal("SQUADLOSS"),
  v.literal("REFERRAL"),
  v.literal("COINS"),
  v.literal("FRIENDS"),
  v.literal("OTHER")
);
export type AchievementType = Infer<typeof achievement_type>;

export const transaction_type = v.union(
  v.literal("DEPOSIT"),
  v.literal("WITHDRAW"),
  v.literal("WAGER"),
  v.literal("PICK"),
  v.literal("REFERRAL"),
  v.literal("BONUS"),
  v.literal("GIFT"),
  v.literal("ACHIEVEMENT"),
  v.literal("BLACKJACK"),
  v.literal("PAYOUT"),
  v.literal("OTHER")
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

export const slot_symbol_type = v.union(
  v.literal("COIN"),
  v.literal("DIAMOND"),
  v.literal("STAR"),
  v.literal("SEVEN"),
  v.literal("BAR"),
  v.literal("CHERRY")
);
export type SlotSymbolType = Infer<typeof slot_symbol_type>;

export const question_status = v.union(
  v.literal("DRAFT"),
  v.literal("ACTIVE"),
  v.literal("CLOSED"),
  v.literal("COMPLETE")
);
export type QuestionStatus = Infer<typeof question_status>;

export const bracket_tournament_status = v.union(
  v.literal("DRAFT"),
  v.literal("ACTIVE"),
  v.literal("IN_PROGRESS"),
  v.literal("COMPLETE")
);
export type BracketTournamentStatus = Infer<typeof bracket_tournament_status>;

export const bracket_game_status = v.union(
  v.literal("PENDING"),
  v.literal("ACTIVE"),
  v.literal("COMPLETE")
);
export type BracketGameStatus = Infer<typeof bracket_game_status>;

export const blackjack_game_status = v.union(
  v.literal("PLAYING"),
  v.literal("PLAYER_BUSTED"),
  v.literal("DEALER_BUSTED"),
  v.literal("PLAYER_WON"),
  v.literal("DEALER_WON"),
  v.literal("PLAYER_BLACKJACK"),
  v.literal("PUSH")
);
export type BlackjackGameStatus = Infer<typeof blackjack_game_status>;

export default defineSchema({
  slotMachineSpins: defineTable({
    userId: v.id("users"),
    spunAt: v.number(),
    result: v.array(slot_symbol_type),
    payout: v.number(),
    freeSpin: v.boolean(),
  }).index("by_userId", ["userId"]),

  slotMachineConfig: defineTable({
    active: v.boolean(),
    symbolWeights: v.record(v.string(), v.number()),
    payouts: v.array(
      v.object({
        line: v.number(),
        payout: v.number(),
      })
    ),
    spinCost: v.number(),
    freeSpinInterval: v.number(),
  }),

  blackjackGames: defineTable({
    userId: v.id("users"),
    playerHand: v.array(
      v.object({
        suit: v.string(),
        value: v.string(),
      })
    ),
    dealerHand: v.array(
      v.object({
        suit: v.string(),
        value: v.string(),
        hidden: v.optional(v.boolean()),
      })
    ),
    status: blackjack_game_status,
    betAmount: v.number(),
    payout: v.optional(v.number()),
    deck: v.array(
      v.object({
        suit: v.string(),
        value: v.string(),
      })
    ),
  }),

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
    .index("by_startTime", ["startTime"])
    .index("by_gameId", ["gameId"]),

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
    .index("by_active_externalId", ["active", "externalId"])
    .index("by_externalId", ["externalId"]),

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
      statsByLeague: v.any(),
    }),
    rank: v.optional(v.number()),
    monthlyStats: v.optional(v.any()),
    score: v.number(),
    members: v.array(
      v.object({
        userId: v.id("users"),
        role: squad_role,
        joinedAt: v.number(),
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
    .index("by_slug", ["slug"])
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
    weight: v.number(),
    threshold: v.number(),
    type: achievement_type,
  }).index("by_type_threshold", ["type", "threshold"]),

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
    .index("by_active_userId", ["active", "userId"])
    .index("by_active", ["active"]),

  pickemGames: defineTable({
    title: v.string(),
    description: v.string(),
    image: v.string(),
    active: v.boolean(),
    startDate: v.number(),
    endDate: v.number(),
    cost: v.number(),
    reward: v.number(),
    league: v.string(),

    type: v.optional(v.string()),
    pickSchedule: v.any(),
  }),

  pickemPicks: defineTable({
    userId: v.id("users"),
    gameId: v.id("pickemGames"),
    picks: v.any(),
  }),

  globalQuiz: defineTable({
    title: v.string(),
    description: v.string(),
    correctAnswerId: v.optional(v.string()),
    status: question_status,
    minWager: v.number(),
    maxWager: v.number(),
    expiresAt: v.number(),
    options: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
      })
    ),
  }).index("by_status", ["status"]),

  quizResponses: defineTable({
    userId: v.id("users"),
    quizId: v.id("globalQuiz"),
    selectedOptionId: v.string(),
    wager: v.number(),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_quizId", ["quizId"])
    .index("by_quizId_userId", ["quizId", "userId"]),

  friendRequests: defineTable({
    senderId: v.string(),
    receiverId: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("ACCEPTED"),
      v.literal("DECLINED")
    ),
    sentAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_receiver", ["receiverId", "status"])
    .index("by_sender", ["senderId", "status"])
    .index("by_users", ["senderId", "receiverId"]),

  bracketTournaments: defineTable({
    name: v.string(),
    description: v.string(),
    status: bracket_tournament_status,
    startDate: v.number(),
    endDate: v.number(),
    cost: v.number(),
    reward: v.number(),
  }).index("by_status", ["status"]),

  brackets: defineTable({
    tournamentId: v.id("bracketTournaments"),
    userId: v.id("users"),
    score: v.number(),
    name: v.string(),
  })
    .index("by_tournamentId", ["tournamentId"])
    .index("by_userId", ["userId"]),

  bracketTeams: defineTable({
    name: v.string(),
    image: v.string(),
    seed: v.number(),
    region: v.string(),
    espnId: v.optional(v.string()),
    tournamentId: v.id("bracketTournaments"),
  }).index("by_tournamentId", ["tournamentId"]),

  bracketGames: defineTable({
    tournamentId: v.id("bracketTournaments"),
    round: v.number(),
    gamePosition: v.number(),
    homeTeamId: v.id("bracketTeams"),
    awayTeamId: v.id("bracketTeams"),
    winnerId: v.optional(v.id("bracketTeams")),
    homeTeamScore: v.optional(v.number()),
    awayTeamScore: v.optional(v.number()),
    status: bracket_game_status,
    scheduledAt: v.number(),
  }).index("by_tournamentId", ["tournamentId"]),

  bracketGamePredictions: defineTable({
    tournamentId: v.id("bracketTournaments"),
    userId: v.id("users"),
    gameId: v.id("bracketGames"),
    roundNumber: v.number(),
    gamePosition: v.number(),
    prediction: v.object({
      homeTeamScore: v.number(),
      awayTeamScore: v.number(),
      winnerId: v.id("bracketTeams"),
      score: v.optional(v.number()),
    }),
  }).index("by_tournamentId", ["tournamentId"]),

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
    monthlyStats: v.optional(v.any()),
    coinStats: v.optional(v.any()),
    friends: v.array(
      v.object({
        userId: v.string(),
        addedAt: v.number(),
        status: v.union(
          v.literal("ONLINE"),
          v.literal("OFFLINE"),
          v.literal("AWAY")
        ),
      })
    ),
    squadId: v.optional(v.id("squads")),
    squads: v.array(v.id("squads")),
    externalId: v.string(),
    role: user_role,
    status: v.union(v.literal("ACTIVE"), v.literal("INACTIVE")),
    metadata: v.optional(v.object({})),
    settings: v.optional(v.object({})),
    referralCode: v.optional(v.string()),
    referredBy: v.optional(v.id("users")),
    coinGames: v.optional(
      v.object({
        lastSlotSpin: v.optional(v.number()),
        freeSpinCount: v.optional(v.number()),
        lastFreeSpin: v.optional(v.number()),
        lastFreeBlackjack: v.optional(v.number()),
        lastPaidBlackjack: v.optional(v.number()),
      })
    ),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["externalId"])
    .index("by_coins", ["coins"])
    .index("by_wins", ["stats.wins"]),
});
