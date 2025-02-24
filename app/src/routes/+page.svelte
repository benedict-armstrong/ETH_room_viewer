<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import ScrollSelect from '$lib/components/ui/scrollSelect/ScrollSelect.svelte';
	import ScrollSelectOption from '$lib/components/ui/scrollSelect/ScrollSelectOption.svelte';

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
		alert(selected);
	}

	let { data }: PageProps = $props();
</script>

{#if data}
	<div class="grid">
		<div class="m-3 h-[70vh] rounded-lg bg-blue-600">
			<h2 class="m-4 text-2xl font-black text-white">Select Building:</h2>
			<ScrollSelect select={handleSelect}>
				<!-- <ScrollSelectOption value="Option1">Option1</ScrollSelectOption> -->
				{#each data.buildings as building}
					<ScrollSelectOption
						value={building.building}
						class="flex h-12 items-center justify-center font-black"
						selectedClass="text-white text-4xl"
						notSelectedClass="text-gray-300 text-2xl opacity-80"
					>
						<div class="relative">
							<div>
								{building.building}
							</div>
							{#if building.distance}
								<div class="w-30 absolute left-20 top-[50%] ml-3 text-[0.7rem] text-gray-200">
									{formatDistance(building.distance)}
								</div>
							{/if}
						</div>
					</ScrollSelectOption>
				{/each}
			</ScrollSelect>
		</div>
	</div>
{/if}
