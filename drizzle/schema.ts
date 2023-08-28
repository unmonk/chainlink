import { InferModel, relations, sql } from "drizzle-orm";
import {
  int,
  text,
  mysqlEnum,
  mysqlTable,
  timestamp,
  boolean,
  serial,
  uniqueIndex,
  varchar,
  bigint,
  index,
  mediumint,
  smallint,
  datetime,
  unique,
  primaryKey,
} from "drizzle-orm/mysql-core";

//Tables

export const campaigns = mysqlTable(
  "campaigns",
  {
    id: serial("id").primaryKey().autoincrement(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    name: varchar("name", {
      length: 128,
    }).notNull(),
    active: boolean("active").default(false).notNull(),
    created_by: varchar("created_by", {
      length: 64,
    }),
    winner_id: varchar("winner_id", {
      length: 64,
    }),
    start_date: datetime("start_date", {
      mode: "date",
      fsp: 2,
    }).notNull(),
    end_date: datetime("end_date", {
      mode: "date",
      fsp: 2,
    }).notNull(),
  },
  (table) => {
    return {
      activeIdx: index("active_idx").on(table.active),
      startDateIdx: index("start_date_idx").on(table.start_date),
    };
  },
);

export const matchups = mysqlTable(
  "matchups",
  {
    id: serial("id").primaryKey().autoincrement(),
    question: varchar("question", {
      length: 255,
    }).notNull(),
    game_id: varchar("game_id", {
      length: 64,
    }).notNull(),
    status: mysqlEnum("status", [
      "STATUS_IN_PROGRESS",
      "STATUS_FINAL",
      "STATUS_SCHEDULED",
      "STATUS_POSTPONED",
      "STATUS_CANCELED",
      "STATUS_SUSPENDED",
      "STATUS_DELAYED",
      "STATUS_UNKNOWN",
      "STATUS_END_PERIOD",
    ]).notNull(),
    league: mysqlEnum("leagues", [
      "NFL",
      "NBA",
      "MLB",
      "NHL",
      "COLLEGE-FOOTBALL",
      "MBB",
      "WBB",
      "WNBA",
      "NCAA",
      "OTHER",
    ]).notNull(),
    operator: mysqlEnum("operator", [
      "LESS_THAN",
      "GREATER_THAN",
      "EQUAL_TO",
      "NOT_EQUAL_TO",
      "LESS_THAN_OR_EQUAL_TO",
      "GREATER_THAN_OR_EQUAL_TO",
    ]).notNull(),
    network: varchar("network", {
      length: 32,
    })
      .notNull()
      .default("N/A"),
    home_team: varchar("home_team", {
      length: 64,
    }).notNull(),
    home_value: mediumint("home_value").notNull().default(0),
    home_image: varchar("home_image", {
      length: 600,
    }),
    home_id: varchar("home_id", {
      length: 64,
    }),
    home_win_condition: varchar("home_win_condition", {
      length: 64,
    }).notNull(),
    home_win_condition_operator: mysqlEnum("home_win_condition_operator", [
      "LESS_THAN",
      "GREATER_THAN",
      "EQUAL_TO",
      "NOT_EQUAL_TO",
      "LESS_THAN_OR_EQUAL_TO",
      "GREATER_THAN_OR_EQUAL_TO",
    ]),
    home_win_condition_value: mediumint("home_win_condition_value"),
    away_value: mediumint("away_value").notNull().default(0),
    away_team: varchar("away_team", {
      length: 64,
    }).notNull(),
    away_image: varchar("away_image", {
      length: 600,
    }),
    away_id: varchar("away_id", {
      length: 64,
    }),
    away_win_condition: varchar("away_win_condition", {
      length: 64,
    }).notNull(),
    away_win_condition_operator: mysqlEnum("away_win_condition_operator", [
      "LESS_THAN",
      "GREATER_THAN",
      "EQUAL_TO",
      "NOT_EQUAL_TO",
      "LESS_THAN_OR_EQUAL_TO",
      "GREATER_THAN_OR_EQUAL_TO",
    ]),
    away_win_condition_value: mediumint("away_win_condition_value"),
    winner_id: varchar("winner_id", {
      length: 64,
    }),
    created_at: timestamp("created_at", { mode: "date", fsp: 2 }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date", fsp: 2 }).defaultNow(),
    start_time: datetime("start_time", { mode: "date", fsp: 2 }).notNull(),
  },
  (table) => {
    return {
      start_date_idx: index("start_date_idx").on(table.start_time),
      status_idx: index("status_idx").on(table.status),
      league_idx: index("league_idx").on(table.league),
      unique_matchup_idx: unique("unique_matchup_idx").on(
        table.start_time,
        table.game_id,
        table.league,
      ),
    };
  },
);

export const streaks = mysqlTable(
  "streaks",
  {
    id: serial("id").primaryKey().autoincrement(),
    user_id: varchar("user_id", {
      length: 64,
    }).notNull(),
    campaign_id: bigint("campaign_id", {
      mode: "number",
    }).notNull(),
    streak: smallint("streak").notNull().default(0),
    wins: smallint("wins").notNull().default(0),
    losses: smallint("losses").notNull().default(0),
    pushes: smallint("pushes").notNull().default(0),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
    active: boolean("active").notNull().default(true),
  },
  (table) => {
    return {
      user_active_idx: index("user_active_idx").on(table.user_id, table.active),
    };
  },
);

export const picks = mysqlTable(
  "picks",
  {
    id: serial("id").primaryKey().autoincrement(),
    user_id: varchar("user_id", {
      length: 64,
    }).notNull(),
    matchup_id: bigint("matchup_id", {
      mode: "number",
    }).notNull(),
    streak_id: bigint("streak_id", {
      mode: "number",
    }),
    pick_type: mysqlEnum("pick_type", ["HOME", "AWAY"]).notNull(),
    active: boolean("active").notNull().default(true),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
    pick_status: mysqlEnum("pick_status", [
      "PENDING",
      "WIN",
      "LOSS",
      "PUSH",
      "STATUS_IN_PROGRESS",
      "STATUS_UNKNOWN",
    ])
      .notNull()
      .default("PENDING"),
  },
  (table) => {
    return {
      user_active_idx: index("user_active_idx").on(table.user_id, table.active),
    };
  },
);

export const profiles = mysqlTable("profiles", {
  user_id: varchar("user_id", {
    length: 64,
  })
    .primaryKey()
    .unique(),
  created_at: timestamp("created_at", { mode: "date" }).default(
    sql`current_timestamp()`,
  ),
  updated_at: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp()`,
  ),
});

export const squads = mysqlTable(
  "squads",
  {
    id: serial("id").primaryKey().autoincrement(),
    name: varchar("name", {
      length: 128,
    }).notNull(),
    owner_id: varchar("owner_id", {
      length: 64,
    }).notNull(),
    created_at: timestamp("created_at", { mode: "date" }).default(
      sql`current_timestamp()`,
    ),
    updated_at: timestamp("updated_at", { mode: "date" }).default(
      sql`current_timestamp()`,
    ),
  },
  (table) => {
    return {
      name_idx: index("name_idx").on(table.name),
    };
  },
);

export const achievements = mysqlTable("achievements", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar("name", {
    length: 128,
  }).notNull(),
  description: varchar("description", {
    length: 128,
  }).notNull(),
  image: varchar("image", {
    length: 512,
  }).notNull(),
  created_at: timestamp("created_at", { mode: "date" }).default(
    sql`current_timestamp()`,
  ),
});

export const profileAchievements = mysqlTable(
  "profile_achievements",
  {
    profile_id: varchar("profile_id", {
      length: 64,
    }).notNull(),
    achievement_id: bigint("achievement_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      profile_id_idx: index("profile_id_idx").on(table.profile_id),
      profile_achievement_idx: primaryKey(
        table.profile_id,
        table.achievement_id,
      ),
    };
  },
);

export const ownedSquads = mysqlTable(
  "owned_squads",
  {
    squad_id: bigint("squad_id", {
      mode: "number",
    }).notNull(),
    profile_id: varchar("profile_id", {
      length: 64,
    }).notNull(),
  },
  (table) => {
    return {
      squad_id_idx: index("squad_id_idx").on(table.squad_id),
      profile_id_idx: index("profile_id_idx").on(table.profile_id),
      unique_owned_squads_idx: primaryKey(table.squad_id, table.profile_id),
    };
  },
);

export const squadMembers = mysqlTable(
  "squad_members",
  {
    squad_id: bigint("squad_id", {
      mode: "number",
    }).notNull(),
    profile_id: varchar("profile_id", {
      length: 64,
    }).notNull(),
  },
  (table) => {
    return {
      squad_id_idx: index("squad_id_idx").on(table.squad_id),
      profile_id_idx: index("profile_id_idx").on(table.profile_id),
      unique_squad_member_idx: primaryKey(table.squad_id, table.profile_id),
    };
  },
);

//Relationships

export const ownedSquadRelations = relations(ownedSquads, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [ownedSquads.profile_id],
    references: [profiles.user_id],
  }),
  squad: one(squads, {
    fields: [ownedSquads.squad_id],
    references: [squads.id],
  }),
}));

export const squadMemberRelations = relations(
  squadMembers,
  ({ one, many }) => ({
    profile: one(profiles, {
      fields: [squadMembers.profile_id],
      references: [profiles.user_id],
    }),
    squad: one(squads, {
      fields: [squadMembers.squad_id],
      references: [squads.id],
    }),
  }),
);

export const squadRelations = relations(squads, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [squads.owner_id],
    references: [profiles.user_id],
  }),
  members: many(squadMembers),
}));

export const profileAchievementRelations = relations(
  profileAchievements,
  ({ one, many }) => ({
    profile: one(profiles, {
      fields: [profileAchievements.profile_id],
      references: [profiles.user_id],
    }),
    achievement: one(achievements, {
      fields: [profileAchievements.achievement_id],
      references: [achievements.id],
    }),
  }),
);

export const profileRelations = relations(profiles, ({ one, many }) => ({
  streaks: many(streaks),
  picks: many(picks),
  squads: many(squads),
  ownedSquads: many(ownedSquads),
  achievements: many(profileAchievements),
}));

export const campaignRelations = relations(campaigns, ({ one, many }) => ({
  streaks: many(streaks),
}));

export const matchupRelations = relations(matchups, ({ one, many }) => ({
  picks: many(picks),
}));

export const pickRelations = relations(picks, ({ one, many }) => ({
  matchup: one(matchups, {
    fields: [picks.matchup_id],
    references: [matchups.id],
  }),
  streak: one(streaks, {
    fields: [picks.streak_id],
    references: [streaks.id],
  }),
  profile: one(profiles, {
    fields: [picks.user_id],
    references: [profiles.user_id],
  }),
}));

export const streakRelations = relations(streaks, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [streaks.campaign_id],
    references: [campaigns.id],
  }),
  profile: one(profiles, {
    fields: [streaks.user_id],
    references: [profiles.user_id],
  }),
  picks: many(picks),
}));

//Types
export type Campaign = InferModel<typeof campaigns>;
export type Matchup = InferModel<typeof matchups>;
export type Pick = InferModel<typeof picks>;
export type Streak = InferModel<typeof streaks>;
export type Profile = InferModel<typeof profiles>;
export type Squad = InferModel<typeof squads>;
export type Achievement = InferModel<typeof achievements>;

export type NewCampaign = InferModel<typeof campaigns, "insert">;
export type NewMatchup = InferModel<typeof matchups, "insert">;
export type NewPick = InferModel<typeof picks, "insert">;
export type NewStreak = InferModel<typeof streaks, "insert">;
export type NewProfile = InferModel<typeof profiles, "insert">;
export type NewSquad = InferModel<typeof squads, "insert">;
export type NewAchievement = InferModel<typeof achievements, "insert">;

export type FullProfile = Profile & {
  streaks: Streak[];
  picks: Pick[];
  squads: Squad[];
  ownedSquads: Squad[];
  achievements: Achievement[];
};

export type CampaignWithMatchups = Campaign & {
  matchups: Matchup[];
};

export type CampaignWithStreaks = Campaign & {
  streaks: Streak[];
};

export type MatchupWithPicks = Matchup & {
  picks: Pick[];
};

export type StreakWithPicks = Streak & {
  picks: Pick[];
};

export type PickWithMatchup = Pick & {
  matchup: Matchup;
};

export type PickWithStreak = Pick & {
  streak: Streak;
};

export type PickWithMatchupAndStreak = Pick & {
  matchup: Matchup;
  streak: Streak;
};

export type League =
  | "NFL"
  | "NBA"
  | "MLB"
  | "NHL"
  | "COLLEGE-FOOTBALL"
  | "MBB"
  | "WBB"
  | "WNBA"
  | "NCAA";

export type MatchupStatus =
  | "STATUS_IN_PROGRESS"
  | "STATUS_FINAL"
  | "STATUS_SCHEDULED"
  | "STATUS_POSTPONED"
  | "STATUS_CANCELED"
  | "STATUS_SUSPENDED"
  | "STATUS_DELAYED"
  | "STATUS_UNKNOWN"
  | "STATUS_END_PERIOD";

export type Operator =
  | "LESS_THAN"
  | "GREATER_THAN"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO";

export type PickType = "HOME" | "AWAY";

export type PickStatus =
  | "PENDING"
  | "WIN"
  | "LOSS"
  | "PUSH"
  | "STATUS_IN_PROGRESS"
  | "STATUS_UNKNOWN";
