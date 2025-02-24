import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { Room } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ cookies }) => {
	// get the query string from location cookie
	const location = JSON.parse(cookies.get('location') ?? '{}');
	const latitude = location?.latitude;
	const longitude = location?.longitude;

	if (!latitude || !longitude) {
		const buildings = await db
			.selectDistinct({ building: Room.building })
			.from(Room)
			.orderBy(Room.building);
		// add distance to each room
		return { buildings: buildings.map((b) => ({ ...b, distance: null })) };
	}

	const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)`;

	// Build the subquery with the ordering expression included
	const subquery = db
		.selectDistinct({
			building: Room.building,
			distance: sql<number>`ST_Distance(${Room.location}, ${sqlPoint}, TRUE)`.as('distance'),
			orderDistance: sql`${Room.location} <-> ${sqlPoint}`.as('orderDistance')
		})
		.from(Room)
		.as('sub');

	// Now select only the desired columns and order by the ordering expression
	const buildings = await db
		.select({
			building: subquery.building,
			distance: subquery.distance
		})
		.from(subquery)
		.orderBy(subquery.orderDistance);

	console.log(buildings[0].distance);

	// return buildings
	return { buildings };
};
