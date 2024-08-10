ALTER TABLE "blinksights_blink_event" ADD COLUMN "org_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ADD COLUMN "org_id" uuid NOT NULL;