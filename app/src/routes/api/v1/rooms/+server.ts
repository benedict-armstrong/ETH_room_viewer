import { getRoomsWithNextBooking } from '$lib/server/dao';
// import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET = (async () => {
	try {
		const rooms = await getRoomsWithNextBooking();
		return new Response(JSON.stringify(rooms));
	} catch (err) {
		console.error('Error executing query', err);
		return new Response(JSON.stringify([]));
	}
}) satisfies RequestHandler;
