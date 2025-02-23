import { pgTable, serial, varchar, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';

// Room table
export const Room = pgTable(
	'Room',
	{
		id: serial('id').primaryKey(),

		room: varchar('room', { length: 127 }).notNull(),
		floor: varchar('floor', { length: 63 }).notNull(),
		building: varchar('building', { length: 127 }).notNull(),
		area: varchar('area', { length: 127 }).notNull(),
		region: varchar('region', { length: 127 }).notNull(),

		type: varchar('type', { length: 63 }).notNull(),
		latitude: varchar('latitude', { length: 63 }),
		longitude: varchar('longitude', { length: 63 }),

		name: varchar('name', { length: 255 })
			.notNull()
			.generatedAlwaysAs(
				(): SQL => sql`${Room.building} || ' ' || ${Room.floor} || ' ' || ${Room.room}`
			)
	},
	(table) => [
		// Add unique constraint for room, floor & building
		unique().on(table.room, table.floor, table.building)
	]
);

// MapData table
export const MapData = pgTable('MapData', {
	id: serial('id').primaryKey(),
	points: varchar('points', { length: 10000 }),
	height: varchar('height', { length: 10 }),
	width: varchar('width', { length: 10 }),
	roomId: integer('room_id')
		.notNull()
		.unique()
		.references(() => Room.id)
});

// Event table
export const Event = pgTable('Event', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	organizer: varchar('organizer', { length: 255 }),
	type: varchar('type', { length: 255 }),
	description: varchar('description', { length: 255 })
});

// Booking table
export const Booking = pgTable('Booking', {
	id: serial('id').primaryKey(),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time').notNull(),
	eventId: integer('event_id').references(() => Event.id),
	roomId: integer('room_id')
		.notNull()
		.references(() => Room.id)
});
