ALTER TABLE "blinksights_blink_event" RENAME COLUMN "_org_id" TO "org_id";--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" DROP CONSTRAINT "blinksights_blink_event__org_id_blinksights_organization__id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event_org_id_blinksights_organization__id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."blinksights_organization"("_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
