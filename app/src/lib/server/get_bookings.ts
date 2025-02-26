import { Room, Booking, Event, DataFetch } from './db/schema';
import { db } from './db';
import { eq, and, isNull } from 'drizzle-orm';
import { format } from 'date-fns';

function booking_url(room_name: string, from_date: Date, to_date: Date): string {
	// Dates to %Y-%m-%d format
	return `https://ethz.ch/bin/ethz/roominfo?path=/rooms/${room_name}/allocations&from=${format(from_date, 'yyyy-MM-dd')}&to=${format(to_date, 'yyyy-MM-dd')}`;
}

async function get_or_create_event(event: any) {
	if (!event) {
		return null;
	}

	const event_name = event.allocationTitle;
	const event_organizer = event['veranstalter'];
	const event_type = event['veranstaltungstyp'];

	// Check if the event is in the database
	let existingEvent = await db
		.select({
			id: Event.id,
			name: Event.name
		})
		.from(Event)
		.where(eq(Event.name, event_name));
	if (existingEvent.length === 0) {
		console.log(`Adding new event to database: ${event.name}`);

		existingEvent = await db
			.insert(Event)
			.values({
				name: event_name,
				organizer: event_organizer,
				type: event_type
			})
			.returning({
				id: Event.id,
				name: Event.name
			})
			.execute();
	}

	return existingEvent[0];
}

async function fetch_bookings_for_room(roomId: number) {
	const room_q = await db
		.select({
			name: Room.name
		})
		.from(Room)
		.where(eq(Room.id, roomId))
		.execute();
	if (room_q.length === 0) {
		console.error(`Room with id ${roomId} not found`);
		return;
	}
	const roomName = room_q[0].name;

	// For each booking for the room (from today to 7 days from now)
	const url = booking_url(roomName, new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

	console.log(`Fetching bookings using ${url}`);

	const booking_response = await fetch(url);
	const bookings = await booking_response.json();
	for (const booking of bookings) {
		try {
			const event = await get_or_create_event(booking['belegungsserie']['veranstaltung']);

			const eventId = event ? event.id : null;
			const event_name = event ? event.name : null;
			const startTime = new Date(booking['date_from']);
			const endTime = new Date(booking['date_to']);

			// Check if the booking is in the database
			const existingBooking = await db
				.select({
					id: Booking.id
				})
				.from(Booking)
				.where(
					and(
						eq(Booking.startTime, startTime),
						eq(Booking.endTime, endTime),
						eventId ? eq(Booking.eventId, eventId) : isNull(Booking.eventId),
						eq(Booking.roomId, roomId)
					)
				);
			if (existingBooking.length === 0) {
				console.log(`Adding new booking to database: ${event_name}`);

				await db
					.insert(Booking)
					.values({
						startTime: startTime,
						endTime: endTime,
						eventId: eventId,
						roomId: roomId
					})
					.execute();
			}

			// Update the booking in the database
			else {
				console.log(`Updating booking in database: ${event_name}`);
				await db
					.update(Booking)
					.set({
						startTime: startTime,
						endTime: endTime,
						eventId: eventId,
						roomId: roomId
					})
					.where(eq(Booking.id, existingBooking[0].id))
					.execute();
			}
		} catch (error) {
			console.error('Error fetching API data:', error);
		}
	}
}

export async function fetch_bookings() {
	const fetchStartTime = new Date();
	try {
		console.log('Fetching bookings from API');

		const response = await fetch('https://ethz.ch/bin/ethz/roominfo?path=/rooms&lang=en');
		const rooms = await response.json();

		// For each room in Rooms check if it is in the database
		// If not, add it to the database
		for (const new_room of rooms) {
			let existingRoom = await db
				.select({
					id: Room.id
				})
				.from(Room)
				.where(
					and(
						eq(Room.room, new_room.room),
						eq(Room.floor, new_room.floor),
						eq(Room.building, new_room.building)
					)
				);
			if (existingRoom.length === 0) {
				console.log(
					`Adding new room to database: ${new_room.room} ${new_room.floor} ${new_room.building}`
				);
				existingRoom = await db
					.insert(Room)
					.values({
						room: new_room.room,
						floor: new_room.floor,
						building: new_room.building,
						area: new_room.area,
						region: new_room.region,
						type: new_room.type
					})
					.returning({
						id: Room.id
					})
					.execute();
			}
			const roomId = existingRoom[0].id;

			fetch_bookings_for_room(roomId);
		}

		const fetchEndTime = new Date();
		const fetchDuration = fetchEndTime.getTime() - fetchStartTime.getTime();

		await db.insert(DataFetch).values({
			fetchTime: fetchStartTime,
			fetchDuration: fetchDuration,
			fetchStatus: 'OK'
		});
	} catch (error) {
		console.error('Error fetching API data:', error);
		await db.insert(DataFetch).values({
			fetchTime: fetchStartTime,
			fetchDuration: 0,
			fetchStatus: `Error: ${error}`
		});
		throw error;
	}
}
