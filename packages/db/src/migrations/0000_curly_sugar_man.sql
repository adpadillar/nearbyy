CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"url" text NOT NULL,
	"projectid" text NOT NULL,
	"type" text NOT NULL,
	"embedding" numeric[1536] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"salt" text NOT NULL,
	"projectid" text NOT NULL
);
