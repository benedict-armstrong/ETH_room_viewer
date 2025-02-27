<script lang="ts">
	import type { PageProps } from './$types';
	import { replaceState, goto } from '$app/navigation';
	import BuildingFloorSelector from '$lib/components/BuildingFloorSelector.svelte';
	import ServiceSelector from '$lib/components/ServiceSelector.svelte';
	import InfoMenu from '$lib/components/InfoMenu.svelte';

	let selectedService = $state<'printer' | 'room' | null>(null);

	/**
	 * Handle building and floor selection
	 */
	function handleSelection(building: string, floor: string): void {
		// Update URL with selected building and floor
		const url = new URL(window.location.href);
		url.searchParams.set('building', building);
		url.searchParams.set('floor', floor);
		replaceState(url, { building, floor });

		// Navigate to the room view
		goto(`/rooms/${building}/${floor}`);
	}

	function handleServiceSelect(service: 'printer' | 'room') {
		selectedService = service;
	}

	let { data }: PageProps = $props();
</script>

<div class="flex flex-col">
	<div class="p-4">
		<ServiceSelector onSelect={handleServiceSelect} />

		{#if selectedService && data}
			<BuildingFloorSelector {data} selectionCallback={handleSelection} />
		{/if}
	</div>
</div>
