<script context="module" lang="ts">
	import { api_url } from '$lib/global/globals';

	export async function load({ fetch }) {
		const url = `${api_url}/rooms`;
		const res = await fetch(url);

		const rooms = await res.json();

		if (res.ok) {
			return {
				props: {
					rooms,
					filtered: rooms
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import AreaList from '$lib/components/area-list.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { groupIntoAreas } from '$lib/util/group';
	import { search } from '$lib/stores/search';
	import { onDestroy, onMount } from 'svelte';
	import { pwaTrackingListeners } from '$lib/util/pwaListener';

	export let rooms;
	export let filtered;

	const unsubscribe = search.subscribe((s) => {
		if (s.length > 0) {
			filtered = rooms.filter(
				(r) =>
					r.name.toLowerCase().includes(s.toLowerCase()) ||
					r.area.toLowerCase().includes(s.toLowerCase()) ||
					r.room_type.toLowerCase().includes(s.toLowerCase())
			);
		} else {
			filtered = rooms;
		}
	});

	onDestroy(() => unsubscribe);

	// Service worker code
	onMount(() => {
		const isBrowser = typeof window !== 'undefined';

		if (isBrowser) {
			pwaTrackingListeners();
		}

		// if (isBrowser && 'serviceWorker' in navigator) {
		// 	window.addEventListener('load', () => {
		// 		navigator.serviceWorker
		// 			.register('/sw.js')
		// 			.then(() => {
		// 				console.log('Service worker registered');
		// 			})
		// 			.catch((err) => {
		// 				console.log('Service worker registration failed', err);
		// 			});
		// 	});
		// }
	});
</script>

<p class="m-5 text-center">
	Be aware that rooms might be locked even if they are free. During lernphase you can find rooms for
	studying
	<a sveltekit:prefetch class="underline text-sky-700" href="/rooms/lernphase">here</a>
	<br />
	<a class="underline text-sky-700" href="/map-view/hg">Map View</a>
</p>
{#if !filtered}
	<Loading />
{:else}
	<AreaList areas={groupIntoAreas(filtered)} />
{/if}
