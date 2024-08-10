ALTER TABLE "blinksights_blink_event" DROP CONSTRAINT "blinksights_blink_event_blink_id_blinksights_blink_id_fk";
--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" DROP COLUMN IF EXISTS "blink_id";