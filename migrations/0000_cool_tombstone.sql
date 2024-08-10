CREATE TABLE IF NOT EXISTS "blinksights_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "blinksights_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blinksights_blink" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" varchar(255),
	"actions" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blinksights_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blinksights_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blinksights_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "blinksights_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_account" ADD CONSTRAINT "blinksights_account_user_id_blinksights_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."blinksights_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blinksights_session" ADD CONSTRAINT "blinksights_session_user_id_blinksights_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."blinksights_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "blinksights_account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "blinksights_session" ("user_id");

ALTER TABLE blinksights_blink DROP COLUMN created_by;
ALTER TABLE blinksights_blink DROP COLUMN updated_at;
ALTER TABLE blinksights_blink DROP COLUMN blinksights_user;
ALTER TABLE blinksights_blink DROP COLUMN blinksights_name;
ALTER TABLE blinksights_blink DROP COLUMN blinksights_description;
