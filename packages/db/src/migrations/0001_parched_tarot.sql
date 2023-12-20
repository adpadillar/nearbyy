CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text,
	"url" text,
	"projectid" text,
	"type" text,
	"embedding" numeric[1536]
);
--> statement-breakpoint
DROP TABLE "users";