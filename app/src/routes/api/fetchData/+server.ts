import type { RequestHandler } from '../$types';
import { fetch_bookings } from '$lib/server/get_bookings';

export const GET: RequestHandler = async () => {
	try {
		await fetch_bookings();
		return new Response(String('OK'));
	} catch (error) {
		return new Response(String(`Error: ${error}`), { status: 500 });
	}
};
