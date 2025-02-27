CREATE TABLE "Printer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"room_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Printer" ADD CONSTRAINT "Printer_room_id_Room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE no action ON UPDATE no action;