ALTER TABLE "blinksights_blink_event" ADD COLUMN "blink_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" DROP COLUMN IF EXISTS "_id";--> statement-breakpoint
ALTER TABLE "blinksights_blink" DROP COLUMN IF EXISTS "_id";