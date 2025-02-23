import { db } from '$lib/server/db';
import { getTableColumns, sql } from 'drizzle-orm';
import { Room } from '$lib/server/db/schema';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	// get the query string from the URL
	const latitude = url.searchParams.get('lat');
	const longitude = url.searchParams.get('long');

	if (!latitude || !longitude) {
		const rooms = await db.select().from(Room);
		return json(rooms);
	}

	const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)`;

	// get all rooms from the database sorted by distance from the given coordinates
	const rooms = await db
		.select({
			...getTableColumns(Room),
			distance: sql`ST_Distance(${Room.location}, ${sqlPoint})`
		})
		.from(Room)
		.orderBy(sql`${Room.location} <-> ${sqlPoint}`);

	// return rooms
	return json(rooms);
};
