import type { RequestHandler } from './$types';

export const GET = (() => {
	return new Response(String('OK'));
}) satisfies RequestHandler;
