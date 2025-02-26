import { Room, Booking, Event, DataFetch } from './db/schema';
import { db } from './db';
import { eq, and, isNull } from 'drizzle-orm';
import { format } from 'date-fns';

// Constants
const DAYS_TO_FETCH = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT = 30000; // 30 seconds timeout

/**
 * Generate booking URL for a specific room and date range
 */
function getBookingUrl(roomName: string, fromDate: Date, toDate: Date): string {
	return `https://ethz.ch/bin/ethz/roominfo?path=/rooms/${roomName}/allocations&from=${format(fromDate, 'yyyy-MM-dd')}&to=${format(toDate, 'yyyy-MM-dd')}`;
}

/**
 * Event data structure from the API
 */
interface EventData {
	allocationTitle: string;
	veranstalter?: string;
	veranstaltungstyp?: string;
	[key: string]: any;
}

/**
 * Get or create an event in the database
 */
async function getOrCreateEvent(
	event: EventData | null
): Promise<{ id: number; name: string } | null> {
	if (!event) {
		return null;
	}

	const eventName = event.allocationTitle;
	const eventOrganizer = event['veranstalter'];
	const eventType = event['veranstaltungstyp'];

	// Check if the event is in the database
	let existingEvent = await db
		.select({
			id: Event.id,
			name: Event.name
		})
		.from(Event)
		.where(eq(Event.name, eventName));

	if (existingEvent.length === 0) {
		console.log(`Adding new event to database: ${eventName}`);

		existingEvent = await db
			.insert(Event)
			.values({
				name: eventName,
				organizer: eventOrganizer,
				type: eventType
			})
			.returning({
				id: Event.id,
				name: Event.name
			})
			.execute();
	}

	return existingEvent[0];
}

/**
 * Fetch bookings for a specific room
 */
async function fetchBookingsForRoom(roomId: number): Promise<void> {
	try {
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

		// Calculate date range (from today to DAYS_TO_FETCH days from now)
		const today = new Date();
		const endDate = new Date(Date.now() + DAYS_TO_FETCH * MS_PER_DAY);
		const url = getBookingUrl(roomName, today, endDate);

		console.log(`Fetching bookings using ${url}`);

		// Use AbortController for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

		try {
			const booking_response = await fetch(url, {
				signal: controller.signal
			});

			if (!booking_response.ok) {
				throw new Error(`HTTP error! Status: ${booking_response.status}`);
			}

			const bookings = await booking_response.json();

			// Process each booking in the response
			const bookingPromises = bookings.map(async (booking: any) => {
				try {
					const event = await getOrCreateEvent(
						booking['belegungsserie']?.['veranstaltung'] || null
					);

					const eventId = event?.id || null;
					const eventName = event?.name || null;
					const startTime = new Date(booking['date_from']);
					const endTime = new Date(booking['date_to']);

					// Check if the booking is already in the database
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
						console.log(`Adding new booking to database: ${eventName}`);

						await db
							.insert(Booking)
							.values({
								startTime: startTime,
								endTime: endTime,
								eventId: eventId,
								roomId: roomId
							})
							.execute();
					} else {
						console.log(`Updating booking in database: ${eventName}`);
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
					console.error(`Error processing booking for room ${roomName}:`, error);
				}
			});

			// Wait for all booking operations to complete
			await Promise.all(bookingPromises);
		} finally {
			clearTimeout(timeoutId);
		}
	} catch (error) {
		console.error(`Error fetching bookings for room ID ${roomId}:`, error);
	}
}

/**
 * Fetch all bookings from the API and update the database
 */
export async function fetchBookings(): Promise<void> {
	const fetchStartTime = new Date();
	try {
		console.log('Fetching bookings from API');

		// Fetch all rooms from the API
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

		try {
			const response = await fetch('https://ethz.ch/bin/ethz/roominfo?path=/rooms&lang=en', {
				signal: controller.signal
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const rooms = await response.json();

			// Process rooms in batches to avoid overwhelming the database
			const batchSize = 10;
			const roomPromises = [];

			for (let i = 0; i < rooms.length; i += batchSize) {
				const batch = rooms.slice(i, i + batchSize);
				const batchPromise = Promise.all(
					batch.map(async (newRoom: any) => {
						// Check if room exists in database
						let existingRoom = await db
							.select({
								id: Room.id
							})
							.from(Room)
							.where(
								and(
									eq(Room.room, newRoom.room),
									eq(Room.floor, newRoom.floor),
									eq(Room.building, newRoom.building)
								)
							);

						if (existingRoom.length === 0) {
							console.log(
								`Adding new room to database: ${newRoom.room} ${newRoom.floor} ${newRoom.building}`
							);
							existingRoom = await db
								.insert(Room)
								.values({
									room: newRoom.room,
									floor: newRoom.floor,
									building: newRoom.building,
									area: newRoom.area,
									region: newRoom.region,
									type: newRoom.type
								})
								.returning({
									id: Room.id
								})
								.execute();
						}

						return existingRoom[0].id;
					})
				);

				roomPromises.push(batchPromise);
			}

			// Wait for all room processing to complete
			const roomIdBatches = await Promise.all(roomPromises);
			const roomIds = roomIdBatches.flat();

			// Fetch bookings for each room (in parallel)
			await Promise.all(roomIds.map(fetchBookingsForRoom));
		} finally {
			clearTimeout(timeoutId);
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
