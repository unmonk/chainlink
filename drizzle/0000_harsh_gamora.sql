CREATE TABLE `campaigns` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now(2)),
	`name` varchar(128) NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`created_by` varchar(64),
	`winner_id` varchar(64),
	`start_date` datetime(6) NOT NULL,
	`end_date` datetime(6) NOT NULL,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matchups` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`game_id` varchar(64) NOT NULL,
	`matchup_status` enum('STATUS_IN_PROGRESS','STATUS_FINAL','STATUS_SCHEDULED','STATUS_POSTPONED','STATUS_CANCELED','STATUS_SUSPENDED','STATUS_DELAYED','STATUS_UNKNOWN') NOT NULL DEFAULT 'STATUS_SCHEDULED',
	`leagues` enum('NFL','NBA','MLB','NHL','CFB','MBB','WBB','WNBA','NCAA','OTHER') NOT NULL,
	`operators` enum('LESS_THAN','GREATER_THAN','EQUAL_TO','NOT_EQUAL_TO','LESS_THAN_OR_EQUAL_TO','GREATER_THAN_OR_EQUAL_TO') NOT NULL,
	`network` varchar(32) NOT NULL DEFAULT 'N/A',
	`home_team` varchar(64) NOT NULL,
	`home_value` mediumint NOT NULL DEFAULT 0,
	`home_image` varchar(600),
	`home_id` varchar(64),
	`home_win_condition` varchar(64) NOT NULL,
	`home_win_condition_value` mediumint,
	`away_value` mediumint NOT NULL DEFAULT 0,
	`away_team` varchar(64) NOT NULL,
	`away_image` varchar(600),
	`away_id` varchar(64),
	`away_win_condition` varchar(64) NOT NULL,
	`away_win_condition_value` mediumint,
	`winner_id` varchar(64),
	`created_at` timestamp DEFAULT (now(2)),
	`updated_at` timestamp DEFAULT (now(2)),
	`start_time` datetime NOT NULL,
	CONSTRAINT `matchups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `picks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`matchup_id` bigint NOT NULL,
	`streak_id` bigint,
	`pick_type` enum('HOME','AWAY') NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now(2)),
	`updated_at` timestamp DEFAULT (now(2)),
	`pick_status` enum('PENDING','WIN','LOSS','PUSH','STATUS_IN_PROGRESS','STATUS_UNKNOWN') NOT NULL DEFAULT 'PENDING',
	CONSTRAINT `picks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streaks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`campaign_id` bigint NOT NULL,
	`streak` smallint NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now(2)),
	`updated_at` timestamp DEFAULT (now(2)),
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `streaks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `active_idx` ON `campaigns` (`active`);--> statement-breakpoint
CREATE INDEX `start_date_idx` ON `campaigns` (`start_date`);--> statement-breakpoint
CREATE INDEX `start_date_idx` ON `matchups` (`start_time`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `matchups` (`matchup_status`);--> statement-breakpoint
CREATE INDEX `league_idx` ON `matchups` (`leagues`);--> statement-breakpoint
CREATE INDEX `user_active_idx` ON `picks` (`user_id`,`active`);--> statement-breakpoint
CREATE INDEX `user_active_idx` ON `streaks` (`user_id`,`active`);