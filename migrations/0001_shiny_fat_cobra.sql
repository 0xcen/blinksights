CREATE TABLE IF NOT EXISTS "blinksights_blink_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"blink_i" integer NOT NULL,
	"orgId" integer NOT NULL,
	"event_type" jsonb NOT NULL,
	"path" varchar(255),
	"user_pub_key" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blinksights_organization" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"api_key" varchar(255),
	"subscription" varchar(255),
	"subscription_start_date" timestamp with time zone,
	"subscription_end_date" timestamp with time zone,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event_blink_i_blinksights_blink_id_fk" FOREIGN KEY ("blink_i") REFERENCES "public"."blinksights_blink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_blink_event" ADD CONSTRAINT "blinksights_blink_event_orgId_blinksights_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."blinksights_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
