// import { getRoomsWithNextBooking } from '$lib/server/dao';
import prisma from '$lib/server/prisma';

export const load = async () => {
	const rooms = await prisma.room.findMany({
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
			}
		}
	});

	// for (const room of freeRooms) {
	// 	console.log(room.Bookings[0]);
	// }

	// console.log(freeRooms);
	return {
		rooms
	};
};
