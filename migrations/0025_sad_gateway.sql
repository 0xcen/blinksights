ALTER TABLE "blinksights_blink_event" DROP CONSTRAINT "blinksights_blink_event__blink_id_blinksights_blink_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event__blink_id_blinksights_blink__id_fk" FOREIGN KEY ("_blink_id") REFERENCES "public"."blinksights_blink"("_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
