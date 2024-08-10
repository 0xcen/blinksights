ALTER TABLE "blinksights_blink_event" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blinksights_organization" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blinksights_organization" ALTER COLUMN "id" DROP DEFAULT;