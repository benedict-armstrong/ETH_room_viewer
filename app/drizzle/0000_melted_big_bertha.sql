CREATE TABLE "Booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"event_id" integer NOT NULL,
	"room_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "EVENT" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"organizer" varchar(255),
	"type" varchar(255),
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "MapData" (
	"id" serial PRIMARY KEY NOT NULL,
	"points" varchar(10000),
	"height" varchar(10),
	"width" varchar(10),
	"room_id" integer NOT NULL,
	CONSTRAINT "MapData_room_id_unique" UNIQUE("room_id")
);
--> statement-breakpoint
CREATE TABLE "Room" (
	"id" serial PRIMARY KEY NOT NULL,
	"room" varchar(127) NOT NULL,
	"floor" varchar(63) NOT NULL,
	"building" varchar(127) NOT NULL,
	"area" varchar(127) NOT NULL,
	"region" varchar(127) NOT NULL,
	"room_type" varchar(63) NOT NULL,
	"latitude" varchar(63),
	"longitude" varchar(63)
);
--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_event_id_EVENT_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."EVENT"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_Room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MapData" ADD CONSTRAINT "MapData_room_id_Room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE no action ON UPDATE no action;