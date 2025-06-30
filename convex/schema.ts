import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

//////////////////MATCHUPS AND PICKS//////////////////////////////
export const featured_type = v.union(
  v.literal("CHAINBUILDER"),
  v.literal("SPONSORED")
);

export const matchup_type = v.union(
  v.literal("SCORE"),
  v.literal("STATS"),
  v.literal("LEADERS"),
  v.literal("BOOLEAN"),
  v.literal("CUSTOM"),
  v.literal("SPREAD"),
  v.literal("CUSTOM_SCORE")
);
export type MatchupType = Infer<typeof matchup_type>;

export const custom_score_types = v.union(
  v.literal("WINBYXPLUS"),
  v.literal("WINDRAWLOSEBYX"),
  v.literal("WIN"),
  v.literal("LOSE")
);
export type CustomScoreType = Infer<typeof custom_score_types>;

export const pick_status = v.union(
  v.literal("PENDING"),
  v.literal("WIN"),
  v.literal("LOSS"),
  v.literal("PUSH"),
  v.literal("STATUS_IN_PROGRESS"),
  v.literal("STATUS_UNKNOWN")
);
export type PickStatus = Infer<typeof pick_status>;

//////////////////CAMPAIGNS//////////////////////////////

export const campaign_type = v.union(
  v.literal("GLOBAL"),
  v.literal("CHAIN"),
  v.literal("SQUAD"),
  v.literal("TOURNAMENT"),
  v.literal("BRACKET"),
  v.literal("ACHIEVEMENT"),
  v.literal("PICKEM")
);
export type CampaignType = Infer<typeof campaign_type>;

//////////////////ACHIEVEMENTS//////////////////////////////
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

//////////////////TRANSACTIONS AND COINS//////////////////////////////

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
  v.literal("SHOP"),
  v.literal("OTHER")
);
export const trasaction_status = v.union(
  v.literal("PENDING"),
  v.literal("COMPLETE"),
  v.literal("FAILED")
);
export type TransactionStatus = Infer<typeof trasaction_status>;
export type TransactionType = Infer<typeof transaction_type>;

//////////////////SQUADS AND USERS//////////////////////////////
export const squad_role = v.union(v.literal("MEMBER"), v.literal("OWNER"));
export type SquadRole = Infer<typeof squad_role>;
export const user_role = v.union(v.literal("USER"), v.literal("ADMIN"));
export type UserRole = Infer<typeof user_role>;

//////////////////PICKEM//////////////////////////////
export const pickem_type = v.union(
  v.literal("TRADITIONAL"), // Traditional Pick'em - pick all games each week
  v.literal("WEEKLY"), // Weekly Pick'em - separate weekly contests
  v.literal("SURVIVOR") // Survivor - pick one team per week, can't repeat
);

export const pickem_scoring_type = v.union(
  v.literal("STANDARD"), // Each win = 1 point
  v.literal("SPREAD"), // Pick against point spread
  v.literal("CONFIDENCE") // Rank picks by confidence level
);

export const pickem_matchup_status = v.union(
  v.literal("PENDING"),
  v.literal("ACTIVE"),
  v.literal("LOCKED"),
  v.literal("COMPLETE")
);

//////////////////SLOT MACHINE//////////////////////////////
export const slot_symbol_type = v.union(
  v.literal("COIN"),
  v.literal("DIAMOND"),
  v.literal("STAR"),
  v.literal("SEVEN"),
  v.literal("BAR"),
  v.literal("CHERRY"),
  v.literal("WILD"),
  v.literal("SCATTER")
);
export type SlotSymbolType = Infer<typeof slot_symbol_type>;

export const payline_type = v.union(
  v.literal("HORIZONTAL_1"),
  v.literal("HORIZONTAL_2"),
  v.literal("HORIZONTAL_3"),
  v.literal("V_SHAPE_UPSIDE_DOWN"),
  v.literal("V_SHAPE"),
  v.literal("SCATTER")
);
export type PaylineType = Infer<typeof payline_type>;

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

//////////////////QUIZZES//////////////////////////////

export const question_status = v.union(
  v.literal("DRAFT"),
  v.literal("ACTIVE"),
  v.literal("CLOSED"),
  v.literal("COMPLETE")
);
export type QuestionStatus = Infer<typeof question_status>;

//////////////////BRACKETS//////////////////////////////

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

//////////////////NEWS, ANNOUNCEMENTS, AND NOTIFICATIONS//////////////////////////////
export const announcement_type = v.union(
  v.literal("NEWS"),
  v.literal("MAINTENANCE"),
  v.literal("FEATURE"),
  v.literal("PROMOTION"),
  v.literal("ALERT")
);
export type AnnouncementType = Infer<typeof announcement_type>;

export default defineSchema({
  //////////////////MATCHUPS AND PICKS//////////////////////////////
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
    .index("by_league_time", ["league", "startTime"])
    .index("by_active_dates", ["active", "startTime"])
    .index("by_startTime", ["startTime"])
    .index("by_gameId", ["active", "gameId"]),

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
    prizes: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          image: v.optional(v.string()),
          imageStorageId: v.optional(v.id("_storage")),
          coins: v.number(),
        })
      )
    ),
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
    .index("by_active_userId", ["active", "userId"])
    .index("by_externalId", ["externalId"]),

  pickQueue: defineTable({
    userId: v.id("users"),
    maxQueueSize: v.number(),
    queue: v.array(v.id("picks")),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  //////////////////SQUADS//////////////////////////////
  squads: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
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

  //////////////////ACHIEVEMENTS//////////////////////////////

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

  //////////////////TRANSACTIONS//////////////////////////////

  coinTransactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: transaction_type,
    status: trasaction_status,
    from: v.optional(v.string()),
    metadata: v.optional(v.object({})),
  }),

  //////////////////OTHER GAMES//////////////////////////////
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
    win: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_quizId", ["quizId"])
    .index("by_quizId_userId", ["quizId", "userId"]),

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

  bracketGames: defineTable({
    tournamentId: v.id("bracketTournaments"),
    round: v.number(),
    gamePosition: v.number(),
    region: v.string(),
    teams: v.array(
      v.object({
        name: v.string(),
        image: v.string(),
        seed: v.number(),
        region: v.string(),
        order: v.number(),
        homeAway: v.union(v.literal("HOME"), v.literal("AWAY")),
        winner: v.optional(v.boolean()),
        score: v.optional(v.number()),
        espnId: v.optional(v.string()),
        id: v.optional(v.string()),
      })
    ),
    status: bracket_game_status,
    scheduledAt: v.number(),
  }).index("by_tournamentId", ["tournamentId"]),

  bracketGamePredictions: defineTable({
    tournamentId: v.id("bracketTournaments"),
    gameId: v.id("bracketGames"),
    userId: v.id("users"),
    roundNumber: v.number(),
    gamePosition: v.number(),
    prediction: v.object({
      homeTeamScore: v.number(),
      awayTeamScore: v.number(),
      winnerId: v.optional(v.string()),
    }),
  }).index("by_tournamentId", ["tournamentId"]),
  //////////////////SLOT MACHINE//////////////////////////////
  slotMachineSpins: defineTable({
    userId: v.id("users"),
    spunAt: v.number(),
    result: v.union(
      v.array(slot_symbol_type),
      v.array(v.array(slot_symbol_type))
    ),
    payout: v.number(),
    freeSpin: v.boolean(),
    betAmount: v.optional(v.number()),
    paylines: v.optional(
      v.array(
        v.object({
          type: payline_type,
          symbols: v.array(slot_symbol_type),
          matches: v.number(),
          payout: v.number(),
        })
      )
    ),
  }).index("by_userId", ["userId"]),

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
  }).index("by_userId", ["userId"]),

  //////////////////NEWS, ANNOUNCEMENTS, AND NOTIFICATIONS//////////////////////////////

  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    type: announcement_type,
    priority: v.number(),
    active: v.boolean(),
    expiresAt: v.number(),
    link: v.optional(v.string()),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_active_expiresAt", ["active", "expiresAt"]),

  sponsors: defineTable({
    name: v.string(),
    description: v.string(),
    url: v.string(),
    image: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    bannerImage: v.optional(v.string()),
    bannerImageStorageId: v.optional(v.id("_storage")),
    color: v.string(),
    active: v.boolean(),
    featured: v.boolean(),

    order: v.optional(v.number()),
    tier: v.union(v.literal("GOLD"), v.literal("SILVER"), v.literal("BRONZE")),
    metadata: v.optional(
      v.object({
        clicks: v.optional(v.number()),
      })
    ),
  })
    .searchIndex("by_name", {
      searchField: "name",
      filterFields: ["active", "featured"],
    })
    .index("by_featured", ["featured"])
    .index("by_active_featured", ["active", "featured"]),

  //////////////////REACTIONS//////////////////////////////
  reactions: defineTable({
    code: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    active: v.boolean(),
    premium: v.boolean(),
  }).index("by_active", ["active"]),

  matchupReactions: defineTable({
    matchupId: v.id("matchups"),
    reactionId: v.id("reactions"),
    team: v.union(v.literal("HOME"), v.literal("AWAY")),
    userId: v.id("users"),
  })
    .index("by_matchup", ["matchupId"])
    .index("by_user", ["userId"])
    .index("by_matchup_team_userId", ["matchupId", "team", "userId"]),

  ////////////////////SHOP//////////////////////////////

  shopItems: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    type: v.union(
      v.literal("BACKGROUND"),
      v.literal("STICKER"),
      v.literal("MERCH")
    ),
    active: v.boolean(),
    preview: v.string(),
    metadata: v.optional(
      v.object({
        avatarBackground: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
      })
    ),
    featured: v.boolean(),
    order: v.optional(v.number()),
  })
    .index("by_active", ["active"])
    .index("by_type_active", ["type", "active"])
    .index("by_featured", ["featured"]),

  purchases: defineTable({
    userId: v.id("users"),
    itemId: v.id("shopItems"),
    purchasedAt: v.number(),
  }).index("by_userId", ["userId"]),

  //////////////////PICKEM//////////////////////////////
  pickemMatchups: defineTable({
    campaignId: v.id("pickemCampaigns"),
    title: v.string(),
    gameId: v.string(),
    league: v.string(),
    startTime: v.number(),
    status: pickem_matchup_status,
    seasonType: v.optional(
      v.union(
        v.literal("PRESEASON"),
        v.literal("REGULAR_SEASON"),
        v.literal("POSTSEASON")
      )
    ),
    winnerId: v.optional(v.string()),
    week: v.optional(v.number()),
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
    metadata: v.optional(v.any()),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_week", ["week"]),

  pickemCampaigns: defineTable({
    name: v.string(),
    description: v.string(),
    league: v.string(),
    type: pickem_type,
    scoringType: pickem_scoring_type,
    active: v.boolean(),
    featured: v.boolean(),
    startDate: v.number(),
    endDate: v.number(),
    weekStartDate: v.optional(v.number()), // For weekly pickem
    weekEndDate: v.optional(v.number()),
    maxParticipants: v.optional(v.number()),
    entryFee: v.number(), // Coins required to join
    prizes: v.optional(
      v.array(
        v.object({
          place: v.number(),
          coins: v.number(),
          merch: v.optional(v.string()),
          merchStorageId: v.optional(v.id("_storage")),
          description: v.string(),
        })
      )
    ),
    settings: v.object({
      allowTies: v.boolean(),
      dropLowestWeeks: v.optional(v.number()), // Drop X lowest scoring weeks
      excludeGames: v.optional(v.array(v.string())), // Game IDs to exclude
      confidencePoints: v.optional(v.boolean()), // Enable confidence points
      pointSpreads: v.optional(v.boolean()), // Enable point spreads
      includePreseason: v.optional(v.boolean()), // Include preseason games
      includePlayoffs: v.optional(v.boolean()), // Include playoff games
    }),
    metadata: v.optional(v.any()),
  })
    .index("by_league_active", ["league", "active"])
    .index("by_type_active", ["type", "active"])
    .index("by_startDate", ["startDate"]),

  pickemParticipants: defineTable({
    campaignId: v.id("pickemCampaigns"),
    userId: v.id("users"),
    joinedAt: v.number(),
    active: v.boolean(),
    eliminated: v.boolean(), // For survivor pickem
    eliminatedWeek: v.optional(v.number()),
    totalPoints: v.number(),
    weeklyPoints: v.any(), // { week1: points, week2: points, ... }
    picksMade: v.number(),
    correctPicks: v.number(),
    incorrectPicks: v.number(),
    pushedPicks: v.number(),
    usedTeams: v.array(v.string()), // For survivor - teams already picked
    metadata: v.optional(v.any()),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_userId", ["userId"])
    .index("by_campaign_user", ["campaignId", "userId"])
    .index("by_totalPoints", ["totalPoints"]),

  pickemPicks: defineTable({
    campaignId: v.id("pickemCampaigns"),
    participantId: v.id("pickemParticipants"),
    matchupId: v.id("pickemMatchups"), // Updated to reference pickemMatchups
    week: v.number(),
    pick: v.object({
      teamId: v.string(),
      teamName: v.string(),
      teamImage: v.string(),
    }),
    confidencePoints: v.optional(v.number()), // 1-16 for confidence points
    pointSpread: v.optional(v.number()), // For spread betting
    status: pick_status,
    pointsEarned: v.number(),
    submittedAt: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_participantId", ["participantId"])
    .index("by_matchupId", ["matchupId"])
    .index("by_week", ["week"])
    .index("by_campaign_week", ["campaignId", "week"]),

  pickemWeeks: defineTable({
    campaignId: v.id("pickemCampaigns"),
    weekNumber: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    matchups: v.array(v.id("pickemMatchups")), // Updated to reference pickemMatchups
    status: v.union(
      v.literal("PENDING"),
      v.literal("ACTIVE"),
      v.literal("LOCKED"),
      v.literal("COMPLETE")
    ),
    totalParticipants: v.number(),
    participantsWithPicks: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_week", ["weekNumber"])
    .index("by_campaign_week", ["campaignId", "weekNumber"]),

  //////////////////USERS//////////////////////////////

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

  referrals: defineTable({
    userId: v.string(),
    referredBy: v.string(),
    coins: v.number(),
  }),

  legacyUsers: defineTable({
    userId: v.string(),
    data: v.any(),
  }).index("by_userId", ["userId"]),

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
    metadata: v.optional(
      v.object({
        avatarBackground: v.optional(v.string()),
        avatarBackgrounds: v.optional(v.array(v.string())),
      })
    ),
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
