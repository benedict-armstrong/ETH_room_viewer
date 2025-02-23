ALTER TABLE "EVENT" RENAME TO "Event";--> statement-breakpoint
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_event_id_EVENT_id_fk";
--> statement-breakpoint
ALTER TABLE "Room" ADD COLUMN "name" varchar(255) GENERATED ALWAYS AS ("Room"."room" || ' ' || "Room"."floor" || ' ' || "Room"."building") STORED;--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE no action ON UPDATE no action;