CREATE TABLE IF NOT EXISTS "chunks" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"fileId" text NOT NULL,
	"projectId" text NOT NULL,
	"order" integer NOT NULL,
	"nextChunkId" text,
	"embedding" numeric[1536] NOT NULL,
	"tokenLength" integer NOT NULL
);
