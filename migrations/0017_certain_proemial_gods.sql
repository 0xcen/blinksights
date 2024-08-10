ALTER TABLE "blinksights_blink_event" ALTER COLUMN "_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" ALTER COLUMN "_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "_id" SET NOT NULL;