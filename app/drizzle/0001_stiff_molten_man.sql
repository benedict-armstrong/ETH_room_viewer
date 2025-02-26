CREATE TABLE "DataFetch" (
	"id" serial PRIMARY KEY NOT NULL,
	"fetch_time" timestamp NOT NULL,
	"fetch_duration" integer NOT NULL,
	"fetch_status" text NOT NULL
);
