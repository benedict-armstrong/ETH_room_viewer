import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql, eq, desc } from 'drizzle-orm';
import { Room } from '$lib/server/db/schema';

export interface BuildingWithFloors {
	name: string;
	distance: number | null;
	floors: string[];
}

export const load: PageServerLoad = async ({ cookies }) => {
	// get the query string from location cookie
	const location = JSON.parse(cookies.get('location') ?? '{}');
	const latitude = location?.latitude;
	const longitude = location?.longitude;
	console.log(latitude, longitude);

	const buildings: BuildingWithFloors[] = [];

	if (!latitude || !longitude) {
		// Get buildings without distance
		const buildingsQuery = await db
			.selectDistinct({ building: Room.building, area: Room.area })
			.from(Room)
			.orderBy(desc(Room.area), Room.building);

		// For each building, get its floors
		for (const b of buildingsQuery) {
			const floors = await db
				.selectDistinct({ floor: Room.floor })
				.from(Room)
				.where(eq(Room.building, b.building))
				.orderBy(Room.floor);

			buildings.push({
				name: b.building,
				distance: null,
				floors: floors.map((f) => f.floor)
			});
		}
	} else {
		const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)`;

		// Get buildings with distances
		const buildingsWithDistance = await db
			.selectDistinct({
				building: Room.building,
				distance: sql<number>`ST_Distance(${Room.location}, ${sqlPoint}, TRUE)`.as('distance'),
				orderDistance: sql`${Room.location} <-> ${sqlPoint}`.as('orderDistance')
			})
			.from(Room)
			.orderBy(sql`"orderDistance"`);

		// For each building, get its floors
		for (const b of buildingsWithDistance) {
			const floors = await db
				.selectDistinct({ floor: Room.floor })
				.from(Room)
				.where(eq(Room.building, b.building))
				.orderBy(Room.floor);

			buildings.push({
				name: b.building,
				distance: b.distance,
				floors: floors.map((f) => f.floor)
			});
		}
	}

	console.log(buildings.map((b) => b.distance));

	return { buildings };
};
