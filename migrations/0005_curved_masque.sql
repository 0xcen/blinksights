ALTER TABLE "blinksights_organization" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "blinksights_organization" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "blinksights_organization" ADD COLUMN "_id" serial NOT NULL;