CREATE TABLE `visitor_profiles` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `visitor_profiles_user_id_unique` ON `visitor_profiles` (`user_id`);