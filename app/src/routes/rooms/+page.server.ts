import { getRoomsWithNextBooking } from '$lib/server/dao';

export const load = async () => {
	return {
		rooms: await getRoomsWithNextBooking()
	};
};
