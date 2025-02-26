import type { RequestHandler } from '../$types';
import { fetchBookings } from '$lib/server/get_bookings';

export const GET: RequestHandler = async () => {
	try {
		await fetchBookings();
		return new Response('OK', {
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	} catch (error) {
		console.error('API fetch data error:', error);
		return new Response(`Error: ${error instanceof Error ? error.message : String(error)}`, {
			status: 500,
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	}
};
