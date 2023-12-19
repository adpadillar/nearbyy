CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (cast (unixepoch () as int))
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `users` (`name`);