import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getTableColumns, sql } from 'drizzle-orm';
import { Room } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies }) => {
	// get the query string from location cookie
	const location = JSON.parse(cookies.get('location') ?? '{}');
	const latitude = location?.latitude;
	const longitude = location?.longitude;

	if (!latitude || !longitude) {
		const rooms = await db.select().from(Room);
		// add distance to each room
		return { rooms: rooms.map((room) => ({ ...room, distance: -1 })) };
	}

	const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)`;

	// get all rooms from the database sorted by distance from the given coordinates
	const rooms = await db
		.select({
			...getTableColumns(Room),
			distance: sql<number>`ST_Distance(${Room.location}, ${sqlPoint}, TRUE)`
		})
		.from(Room)
		.orderBy(sql`${Room.location} <-> ${sqlPoint}`);

	console.log(rooms[0].distance);

	// return rooms
	return { rooms };
};
