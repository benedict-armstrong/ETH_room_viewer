import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const rooms = await prisma.room.findMany({
		where: {
			building: params.building
		},
		include: {
			Bookings: {
				where: {
					end_time: {
						gt: new Date()
					}
				},
				orderBy: {
					start_time: 'asc'
				},
				take: 1
			},
			MapData: true
		}
	});

	const floors = [];
	const floors_list = [...new Set(rooms.map((room) => room.floor))].sort();
	for (const floor of floors_list) {
		floors.push({
			floor: floor,
			rooms: rooms.filter((room) => room.floor === floor)
		});
	}

	return {
		building: params.building,
		floors
	};
}) satisfies PageServerLoad;
