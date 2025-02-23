import type { RequestHandler } from '../$types';

export const GET = (async () => {
	try {
		return new Response(JSON.stringify('Hello World'));
	} catch (err) {
		console.error('Error executing query', err);
		return new Response(JSON.stringify([]));
	}
}) satisfies RequestHandler;
