// import { getRoomsWithNextBooking } from '$lib/server/dao';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load = (async ({ params }) => {
	const room = await prisma.room.findUnique({
		where: {
			id: parseInt(params.id)
		},
		include: {
			Bookings: {
				where: {
					OR: [
						{
							start_time: {
								lt: new Date()
							},
							end_time: {
								gt: new Date()
							}
						},
						{
							start_time: {
								gt: new Date()
							}
						}
					]
				},
				orderBy: {
					start_time: 'asc'
				}
			},
			MapData: true
		}
	});

	// console.log(room);
	return { room };
}) satisfies PageServerLoad;
