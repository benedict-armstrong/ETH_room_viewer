<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';

	let location_available = $state(false);

	function formatDistance(distance: number) {
		if (distance < 1000) {
			return `${distance} m`;
		} else {
			const km = distance / 1000;
			return `${km.toFixed(1)} km`;
		}
	}

	onMount(() => {
		if ('geolocation' in navigator && !document.cookie.includes('location')) {
			navigator.geolocation.getCurrentPosition((position) => {
				// set cookie with location data
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

	let { data }: PageProps = $props();
</script>

<h1>Page</h1>
{#if location_available}
	<p>Location available</p>
{:else}
	<p>Location not available</p>
{/if}

{#if data}
	<!-- For room in data.rooms -->
	{#each data.rooms as room}
		<p>{room.name} {formatDistance(room.distance)}</p>
	{/each}
{/if}
