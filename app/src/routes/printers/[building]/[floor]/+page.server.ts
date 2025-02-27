import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';
import { Room, Printer } from '$lib/server/db/schema';

export interface PrinterWithStatus {
	id: number;
	name: string;
	building: string;
	floor: string;
	room: string;
	type: string;
	description?: string;
	floorDistance: number;
}

export const load: PageServerLoad = async ({ params }) => {
	const { building, floor } = params;

	// Get printers with their room information and calculate floor distance
	const printers = await db
		.select({
			id: Printer.id,
			name: Printer.name,
			type: Printer.type,
			building: Room.building,
			floor: Room.floor,
			room: Room.room,
			floorDistance: sql<number>`ABS(ASCII(${floor}) - ASCII(${Room.floor}))`.as('floor_distance')
		})
		.from(Printer)
		.innerJoin(Room, eq(Printer.roomId, Room.id))
		.where(eq(Room.building, building))
		.orderBy(sql`floor_distance`);

	return { printers };
};
