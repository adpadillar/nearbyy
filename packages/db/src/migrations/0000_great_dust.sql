CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now(),
	"embeddings" numeric[]
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "users" ("name");