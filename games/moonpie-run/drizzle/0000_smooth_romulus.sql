CREATE TABLE `completed_runs` (
	`run_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`score` integer NOT NULL,
	`cleared_routes` integer NOT NULL,
	`lives_lost` integer NOT NULL,
	`won` integer NOT NULL,
	`active_seconds` real NOT NULL,
	`finished_at` integer NOT NULL,
	`payload_json` text NOT NULL,
	FOREIGN KEY (`run_id`) REFERENCES `runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `players`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `completed_user_score` ON `completed_runs` (`user_id`,`score`);--> statement-breakpoint
CREATE TABLE `player_stats` (
	`user_id` text PRIMARY KEY NOT NULL,
	`coins` integer DEFAULT 0 NOT NULL,
	`pies` integer DEFAULT 0 NOT NULL,
	`ghosts` integer DEFAULT 0 NOT NULL,
	`bonuses` integer DEFAULT 0 NOT NULL,
	`routes` integer DEFAULT 0 NOT NULL,
	`wins` integer DEFAULT 0 NOT NULL,
	`perfect_wins` integer DEFAULT 0 NOT NULL,
	`max_chain` integer DEFAULT 0 NOT NULL,
	`best_score` integer DEFAULT 0 NOT NULL,
	`runs` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `players`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players` (
	`user_id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`username_key` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_username_key_unique` ON `players` (`username_key`);--> statement-breakpoint
CREATE TABLE `runs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`payload_digest` text,
	`rules_version` text DEFAULT '1.6' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `runs_user_started` ON `runs` (`user_id`,`started_at`);