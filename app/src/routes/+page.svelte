<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { invalidateAll, replaceState, goto } from '$app/navigation';
	import BuildingFloorSelector from '$lib/components/BuildingFloorSelector.svelte';

	let location_available = $state(false);

	onMount(() => {
		if ('geolocation' in navigator && !document.cookie.includes('location')) {
			navigator.geolocation.getCurrentPosition((position) => {
				// set cookie with location data (expires when browser is closed)
				document.cookie = `location=${JSON.stringify(position.coords)}`;

				// force re-render using invalidate
				invalidateAll();

				location_available = true;
			});
		}

		if (document.cookie.includes('location')) {
			location_available = true;
		}
	});

	function handleSelection(building: string, floor: string) {
		// Update URL with selected building and floor
		const url = new URL(window.location.href);
		url.searchParams.set('building', building);
		url.searchParams.set('floor', floor);
		replaceState(url, { building, floor });

		// Navigate to the room view
		goto(`/rooms/${building}/${floor}`);
	}

	let { data }: PageProps = $props();
</script>

<p class="text-md m-2 text-center text-gray-500">
	Select the building and floor where you want to find a free room
</p>

{#if data}
	<BuildingFloorSelector {data} selectionCallback={handleSelection} />
{/if}
