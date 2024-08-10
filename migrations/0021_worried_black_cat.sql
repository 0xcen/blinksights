ALTER TABLE "blinksights_blink_event" DROP CONSTRAINT "blinksights_blink_event_blink_id_blinksights_blink__id_fk";
--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" ADD PRIMARY KEY ("_id");--> statement-breakpoint
ALTER TABLE "blinksights_blink" ADD PRIMARY KEY ("_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event_blink_id_blinksights_blink_id_fk" FOREIGN KEY ("blink_id") REFERENCES "public"."blinksights_blink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
