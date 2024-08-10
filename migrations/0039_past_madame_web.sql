ALTER TABLE "blinksights_blink_event" RENAME COLUMN "blink_id" TO "_blink_id";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'blinksights_blink'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "blinksights_blink" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "blinksights_blink" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blinksights_blink" ALTER COLUMN "_id" DROP NOT NULL;