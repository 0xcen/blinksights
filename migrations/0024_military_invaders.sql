ALTER TABLE "blinksights_blink_event" RENAME COLUMN "blink_id" TO "_blink_id";--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" DROP CONSTRAINT "blinksights_blink_event_blink_id_blinksights_blink_id_fk";
--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" ALTER COLUMN "_blink_id" SET DATA TYPE integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event__blink_id_blinksights_blink_id_fk" FOREIGN KEY ("_blink_id") REFERENCES "public"."blinksights_blink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
