import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql, eq, desc } from 'drizzle-orm';
import { Room } from '$lib/server/db/schema';

interface Booking {
	start: Date;
	end: Date;
	eventName: string;
}

interface RoomWithBookings {
	id: number;
	name: string;
	room: string;
	building: string;
	floor: string;
	floorDistance: number;
	currentlyFree: boolean;
	currentBooking: Booking | null;
	nextBooking: Booking | null;
}

export const load: PageServerLoad = async ({ params }) => {
	const { building, floor } = params;

	// Get current time in Zurich timezone
	const now = new Date();
	const zurichTime = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Europe/Zurich',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	}).format(now);

	// Get rooms with their next booking and calculate floor distance
	const rooms = await db
		.select({
			id: Room.id,
			room: Room.room,
			name: Room.name,
			building: Room.building,
			floor: Room.floor,
			floorDistance: sql<number>` ABS(ASCII(${floor}) - ASCII(${Room.floor}))`.as('floor_distance'),
			// Get current booking if exists
			currentBookingStart: sql<string | null>`
				(SELECT b.start_time
				FROM "Booking" b
				WHERE b.room_id = "Room".id
				AND b.start_time <= (${zurichTime}::timestamp + interval '1 hour')
				AND b.end_time >= (${zurichTime}::timestamp + interval '1 hour')
				LIMIT 1
				)`.as('current_booking_start'),
			currentBookingEnd: sql<string | null>`
				(SELECT b.end_time
				FROM "Booking" b
				WHERE b.room_id = "Room".id
				AND b.start_time <= (${zurichTime}::timestamp + interval '1 hour')
				AND b.end_time >= (${zurichTime}::timestamp + interval '1 hour')
				LIMIT 1
				)`.as('current_booking_end'),
			currentBookingEvent: sql<string | null>`
				(SELECT e.name
				FROM "Booking" b
				LEFT JOIN "Event" e ON e.id = b.event_id
				WHERE b.room_id = "Room".id
				AND b.start_time <= (${zurichTime}::timestamp + interval '1 hour')
				AND b.end_time >= (${zurichTime}::timestamp + interval '1 hour')
				LIMIT 1
				)`.as('current_booking_event'),
			// Get next booking
			nextBookingStart: sql<string | null>`
				(SELECT b.start_time
				FROM "Booking" b
				WHERE b.room_id = "Room".id
				AND b.start_time > (${zurichTime}::timestamp + interval '1 hour')
				ORDER BY b.start_time ASC
				LIMIT 1
				)`.as('next_booking_start'),
			nextBookingEnd: sql<string | null>`
				(SELECT b.end_time
				FROM "Booking" b
				WHERE b.room_id = "Room".id
				AND b.start_time > (${zurichTime}::timestamp + interval '1 hour')
				ORDER BY b.start_time ASC
				LIMIT 1
				)`.as('next_booking_end'),
			nextBookingEvent: sql<string | null>`
				(SELECT e.name
				FROM "Booking" b
				LEFT JOIN "Event" e ON e.id = b.event_id
				WHERE b.room_id = "Room".id
				AND b.start_time > (${zurichTime}::timestamp + interval '1 hour')
				ORDER BY b.start_time ASC
				LIMIT 1
				)`.as('next_booking_event'),
			// Check if the room is currently free
			currentlyFree: sql<boolean>`
				NOT EXISTS (
					SELECT 1
					FROM "Booking"
					WHERE "Booking".room_id = "Room".id
					AND start_time <= (${zurichTime}::timestamp + interval '1 hour')
					AND end_time >= (${zurichTime}::timestamp + interval '1 hour')
				)
			`.as('currently_free')
		})
		.from(Room)
		.where(eq(Room.building, building))
		.orderBy(sql`floor_distance`, desc(sql`currently_free`), desc(sql`next_booking_start`));

	// Transform the data to include properly formatted bookings
	const roomsWithBookings: RoomWithBookings[] = rooms.map((room) => ({
		id: room.id,
		room: room.room,
		name: room.name,
		building: room.building,
		floor: room.floor,
		floorDistance: room.floorDistance,
		currentlyFree: room.currentlyFree,
		currentBooking:
			room.currentBookingStart && room.currentBookingEnd
				? {
						start: new Date(room.currentBookingStart),
						end: new Date(room.currentBookingEnd),
						eventName: room.currentBookingEvent || 'Unnamed Event'
					}
				: null,
		nextBooking:
			room.nextBookingStart && room.nextBookingEnd
				? {
						start: new Date(room.nextBookingStart),
						end: new Date(room.nextBookingEnd),
						eventName: room.nextBookingEvent || 'Unnamed Event'
					}
				: null
	}));

	return { rooms: roomsWithBookings };
};
