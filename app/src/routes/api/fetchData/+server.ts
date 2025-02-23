import type { RequestHandler } from '../$types';
import { fetch_bookings } from '$lib/server/get_bookings';

export const GET: RequestHandler = async () => {
	await fetch_bookings();
	return new Response(String('OK'));
};
