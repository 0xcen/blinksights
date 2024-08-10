ALTER TABLE "blinksights_blink_event" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();