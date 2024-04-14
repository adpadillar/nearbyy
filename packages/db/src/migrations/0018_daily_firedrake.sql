CREATE TABLE IF NOT EXISTS "presigned_urls" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"fileId" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"projectId" text NOT NULL,
	"contentType" text NOT NULL,
	"url" text NOT NULL,
	"fields" json NOT NULL
);
