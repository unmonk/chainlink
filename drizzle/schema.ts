import { connect } from "@planetscale/database";
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
} from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/planetscale-serverless";

//Enums

export const leagues = mysqlEnum("leagues", [
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  "CFB",
  "MBB",
  "WBB",
  "WNBA",
  "NCAA",
  "OTHER",
]);
export type League =
  | "NFL"
  | "NBA"
  | "MLB"
  | "NHL"
  | "CFB"
  | "MBB"
  | "WBB"
  | "WNBA"
  | "NCAA";

const matchup_status = mysqlEnum("matchup_status", [
  "STATUS_IN_PROGRESS",
  "STATUS_FINAL",
  "STATUS_SCHEDULED",
  "STATUS_POSTPONED",
  "STATUS_CANCELED",
  "STATUS_SUSPENDED",
  "STATUS_DELAYED",
  "STATUS_UNKNOWN",
]);

export type MatchupStatus =
  | "STATUS_IN_PROGRESS"
  | "STATUS_FINAL"
  | "STATUS_SCHEDULED"
  | "STATUS_POSTPONED"
  | "STATUS_CANCELED"
  | "STATUS_SUSPENDED"
  | "STATUS_DELAYED"
  | "STATUS_UNKNOWN";

const operators = mysqlEnum("operators", [
  "LESS_THAN",
  "GREATER_THAN",
  "EQUAL_TO",
  "NOT_EQUAL_TO",
  "LESS_THAN_OR_EQUAL_TO",
  "GREATER_THAN_OR_EQUAL_TO",
]);

export type Operator =
  | "LESS_THAN"
  | "GREATER_THAN"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO";

const pick_type = mysqlEnum("pick_type", ["HOME", "AWAY"]);

const pick_status = mysqlEnum("pick_status", [
  "PENDING",
  "WIN",
  "LOSS",
  "PUSH",
  "STATUS_IN_PROGRESS",
  "STATUS_UNKNOWN",
]);
export type PickStatus =
  | "PENDING"
  | "WIN"
  | "LOSS"
  | "PUSH"
  | "STATUS_IN_PROGRESS"
  | "STATUS_UNKNOWN";

//Tables

export const campaigns = mysqlTable(
  "campaigns",
  {
    id: serial("id").primaryKey().autoincrement(),
    created_at: timestamp("created_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
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
      fsp: 6,
    }).notNull(),
    end_date: datetime("end_date", {
      mode: "date",
      fsp: 6,
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
    status: matchup_status.notNull().default("STATUS_SCHEDULED"),
    league: leagues.notNull(),
    operator: operators.notNull(),
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
    home_win_condition_operator: operators,
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
    away_win_condition_operator: operators,
    away_win_condition_value: mediumint("away_win_condition_value"),
    winner_id: varchar("winner_id", {
      length: 64,
    }),
    created_at: timestamp("created_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
    updated_at: timestamp("updated_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
    start_time: datetime("start_time", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      start_date_idx: index("start_date_idx").on(table.start_time),
      status_idx: index("status_idx").on(table.status),
      league_idx: index("league_idx").on(table.league),
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
      mode: "bigint",
    }).notNull(),
    streak: smallint("streak").notNull().default(0),
    created_at: timestamp("created_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
    updated_at: timestamp("updated_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
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
      mode: "bigint",
    }).notNull(),
    streak_id: bigint("streak_id", {
      mode: "bigint",
    }),
    pick_type: pick_type.notNull(),
    active: boolean("active").notNull().default(true),
    created_at: timestamp("created_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
    updated_at: timestamp("updated_at", { mode: "date" }).default(
      sql`(now(2))`,
    ),
    pick_status: pick_status.notNull().default("PENDING"),
  },
  (table) => {
    return {
      user_active_idx: index("user_active_idx").on(table.user_id, table.active),
    };
  },
);

//Relationships
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
}));

export const streakRelations = relations(streaks, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [streaks.campaign_id],
    references: [campaigns.id],
  }),
}));

//Types
export type Campaign = InferModel<typeof campaigns>;
export type Matchup = InferModel<typeof matchups>;
export type Pick = InferModel<typeof picks>;
export type Streak = InferModel<typeof streaks>;

export type NewCampaign = InferModel<typeof campaigns, "insert">;
export type NewMatchup = InferModel<typeof matchups, "insert">;
export type NewPick = InferModel<typeof picks, "insert">;
export type NewStreak = InferModel<typeof streaks, "insert">;

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

//Database
const connection = connect({
  url: process.env["DATABASE_URL"],
});

export const db = drizzle(connection);
