ALTER TABLE "blinksights_blink" RENAME COLUMN "org_id" TO "_org_id";--> statement-breakpoint
ALTER TABLE "blinksights_blink" DROP CONSTRAINT "blinksights_blink_org_id_blinksights_organization_id_fk";
