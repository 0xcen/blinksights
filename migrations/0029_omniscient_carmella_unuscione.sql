DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event_blink_id_blinksights_blink_id_fk" FOREIGN KEY ("blink_id") REFERENCES "public"."blinksights_blink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event_org_id_blinksights_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."blinksights_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink" ADD CONSTRAINT "blinksights_blink_org_id_blinksights_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."blinksights_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
