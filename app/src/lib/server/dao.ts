import type { RoomWithNextBooking } from '$lib/models/types';
import { Pool } from 'pg';

const pool = new Pool({
	host: import.meta.env.VITE_PGHOST,
	user: import.meta.env.VITE_PGUSER,
	password: import.meta.env.VITE_PGPASSWORD,
	database: import.meta.env.VITE_PGDATABASE,
	port: Number(import.meta.env.VITE_PGPORT),
	idleTimeoutMillis: 30000,
	max: 20,
	connectionTimeoutMillis: 2000
});

export async function getRoomsWithNextBooking(): Promise<RoomWithNextBooking[]> {
	return pool
		.query<RoomWithNextBooking>({
			text: `SELECT
			rooms.id AS id,
			rooms.name AS name,
			rooms.capacity AS capacity,
			rooms.area AS area,
			rooms.building AS building,
			rooms.floor AS floor,
			rooms.region AS region,
			rooms.room_number AS room_number,
			rooms.room_type AS room_type,
			rooms.latitude AS latitude,
			rooms.longitude AS longitude,
			bookings.start_time AS booking_start_time,
			bookings.end_time AS booking_end_time,
			bookings.name AS booking_name,
			bookings.id AS booking_id
		FROM rooms AS rooms LEFT JOIN (
			SELECT
				*,
				ROW_NUMBER() OVER (PARTITION BY room_id ORDER BY start_time) AS rn
			FROM bookings
			WHERE bookings.end_time >= NOW()
		) bookings ON rooms.id = bookings.room_id
		WHERE bookings.rn = 1`
		})
		.then((res) => {
			const rows = res.rows;
			// console.log(res);
			return rows;
		})
		.catch((err) => {
			console.error('Error executing query', err.stack);
			return [];
		});
}
