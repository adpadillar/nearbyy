CREATE TABLE IF NOT EXISTS "emails" (
	"id" text PRIMARY KEY NOT NULL,
	"emailAddress" text NOT NULL,
	"userId" text NOT NULL,
	"isVerified" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"imageUrl" text NOT NULL,
	"profileImageUrl" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"fullName" text NOT NULL,
	"createdAt" bigint,
	"updatedAt" bigint,
	"twoFactorEnabled" boolean NOT NULL,
	"primaryEmailAddressId" text NOT NULL
);
