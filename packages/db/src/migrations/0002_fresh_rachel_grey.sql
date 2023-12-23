CREATE TABLE IF NOT EXISTS "keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text,
	"salt" text,
	"projectid" text
);
