ALTER TABLE "files" ALTER COLUMN "text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "projectid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "embedding" SET DATA TYPE double precision[1536];--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "embedding" SET NOT NULL;