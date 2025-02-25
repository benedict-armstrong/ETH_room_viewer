<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import OptionBox from '$lib/components/optionBox.svelte';

	let location_available = $state(false);

	let building = $state();

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

	function handleSelect(selected: string | number | null) {
		// alert(selected);
		if (selected) {
			building = selected as string;
		}
	}

	let { data }: PageProps = $props();
</script>

{#if data}
	<div class="grid">
		<OptionBox select={handleSelect} {data}></OptionBox>
		<OptionBox select={handleSelect} {data}></OptionBox>
	</div>
{/if}
