<script lang="ts">
	import AreaList from '$lib/components/area-list.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { groupIntoAreas } from '$lib/util/group';
	import { filtered, rooms } from '$lib/stores/rooms';
	import { search } from '$lib/stores/search';
	import { onDestroy, onMount } from 'svelte';
	import { pwaTrackingListeners } from '$lib/util/pwaListener';

	const unsubscribe = search.subscribe((s) => {
		if (s.length > 0) {
			filtered.set(
				$rooms.filter(
					(r) =>
						r.name.toLowerCase().includes(s.toLowerCase()) ||
						r.area.toLowerCase().includes(s.toLowerCase()) ||
						r.room_type.toLowerCase().includes(s.toLowerCase())
				)
			);
		} else {
			filtered.set($rooms);
		}
	});

	onDestroy(() => unsubscribe);

	onMount(() => {
		const isBrowser = typeof window !== 'undefined';

		if (isBrowser) {
			pwaTrackingListeners();
		}

		if (isBrowser && 'serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker
					.register('/sw.js')
					.then(() => {
						console.log('Service worker registered');
					})
					.catch((err) => {
						console.log('Service worker registration failed', err);
					});
			});
		}
	});
</script>

<!-- <div class="text-center my-8 mx-5">
	<h1 class="text-4xl my-2">ETH Rooms Tool</h1>
	<p>
		This page shows you all currently available rooms at ETH<br />
		Click on a room to go to the
		<a class="underline text-sky-700" href="http://www.rauminfo.ethz.ch/IndexPre.do">Rauminfo</a> page
		for that room
	</p>
</div> -->
<p class="m-5 text-center">
	Be aware that rooms might be locked even if they are free. During lernphase you can find rooms for
	studying
	<a class="underline text-sky-700" href="/rooms/lernphase">here</a>
</p>
{#if !$filtered}
	<Loading />
{:else}
	<AreaList areas={groupIntoAreas($filtered)} />
{/if}
