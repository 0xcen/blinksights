ALTER TABLE "blinksights_blink_event" RENAME COLUMN "org_id" TO "_org_id";--> statement-breakpoint
ALTER TABLE "blinksights_blink_event" DROP CONSTRAINT "blinksights_blink_event_org_id_blinksights_organization_id_fk";
