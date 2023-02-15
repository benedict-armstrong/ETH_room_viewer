import { dev } from '$app/env';
import { api_url } from '$lib/global/globals';

/** @type {import('@sveltejs/kit').ExternalFetch} */
export async function externalFetch(request) {
	if (request.url.startsWith(api_url) && !dev) {
		// clone the original request, but change the URL

		request = new Request(
			request.url.replace('https://eth.benarmstro.ng/api/', 'http://api:3000/api/'),
			request
		);
	}

	return fetch(request);
}
