CREATE TABLE IF NOT EXISTS "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"externalId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner" text NOT NULL
);
