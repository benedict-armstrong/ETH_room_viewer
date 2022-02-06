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
	import Search from '$lib/components/search.svelte';

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

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"
	/>
</svelte:head>

<div class="sticky top-[60px]">
	<Search />
</div>

<p class="m-5 text-center">
	Be aware that rooms might be locked even if they are free. Click on the
	<span class="inline-block">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98 4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"
			/>
		</svg>
	</span>
	icon to view a map of the free Rooms.<br />
	During lernphase you can find rooms for studying
	<a sveltekit:prefetch class="text-sky-700 underline" href="/rooms/lernphase">here</a>.
</p>
{#if !filtered}
	<Loading />
{:else}
	<AreaList areas={groupIntoAreas(filtered)} />
{/if}
