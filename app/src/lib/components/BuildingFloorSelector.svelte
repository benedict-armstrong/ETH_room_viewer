<script lang="ts">
	import { onMount } from 'svelte';
	import OptionBox from './optionBox.svelte';
	import ScrollSelectOption from './scrollSelect/ScrollSelectOption.svelte';
	import type { BuildingWithFloors } from '../../routes/proxy+page.server';

	interface PageData {
		buildings: BuildingWithFloors[];
	}

	let { data, selectionCallback } = $props<{
		data: PageData;
		selectionCallback: (building: string, floor: string) => void;
	}>();

	let selectedBuilding: string | undefined = $state();
	let selectedFloor: string | undefined = $state();
	let floorSelectorElement: HTMLDivElement | undefined = $state();
	let currentBuilding: BuildingWithFloors | undefined = $state();

	// Format distance for display
	function formatDistance(distance: number) {
		if (distance < 1000) {
			return `${distance} m`;
		} else {
			const km = distance / 1000;
			return `${km.toFixed(1)} km`;
		}
	}

	// Handle building selection
	async function handleBuildingSelect(selected: string | number | null) {
		if (selected) {
			if (selectedBuilding === selected) {
				return;
			}
			selectedFloor = undefined;
			selectedBuilding = selected as string;
			currentBuilding = data.buildings.find((b: BuildingWithFloors) => b.name === selectedBuilding);

			// Automatically open the floor selector after a short delay
			setTimeout(() => {
				if (floorSelectorElement) {
					const openButton = floorSelectorElement.querySelector('[role="button"]');
					if (openButton instanceof HTMLElement) {
						openButton.focus();
						openButton.click();
					}
				}
			}, 100);
		}
	}

	// Handle floor selection
	function handleFloorSelect(selected: string | number | null) {
		if (selected) {
			selectedFloor = selected as string;
			if (selectedBuilding) {
				selectionCallback(selectedBuilding, selectedFloor);
			}
		}
	}

	onMount(() => {
		// Check if building is already in URL
		const urlParams = new URLSearchParams(window.location.search);
		const buildingParam = urlParams.get('building');
		if (buildingParam) {
			selectedBuilding = buildingParam;
			currentBuilding = data.buildings.find((b: BuildingWithFloors) => b.name === selectedBuilding);
		}
	});
</script>

<div class="flex flex-col space-y-4">
	<!-- Building Selector -->
	<OptionBox
		title="Select Building:"
		selectedLabel="Building:"
		select={handleBuildingSelect}
		initialValue={selectedBuilding}
		class="m-3 rounded-lg bg-[#273F76] outline-[#273F76] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid"
	>
		{#each data.buildings as building}
			<ScrollSelectOption
				value={building.name}
				class="flex h-12 items-center justify-center font-black"
				selectedClass="text-white text-4xl"
				notSelectedClass="text-gray-300 text-2xl opacity-80"
			>
				<div class="relative">
					<div>{building.name}</div>
					{#if building.distance !== null}
						<div class="absolute top-[50%] left-20 ml-3 w-30 text-[0.7rem] text-gray-200">
							{formatDistance(building.distance)}
						</div>
					{/if}
				</div>
			</ScrollSelectOption>
		{/each}
	</OptionBox>

	<!-- Floor Selector - only enabled after building selection -->
	<div bind:this={floorSelectorElement}>
		<OptionBox
			title={`Select Floor (${currentBuilding?.name || ''}):`}
			selectedLabel="Floor:"
			select={handleFloorSelect}
			initialValue={selectedFloor}
			disabled={!currentBuilding}
			class="m-3 rounded-lg bg-[#9EBD6E] outline-[#9EBD6E] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid"
		>
			{#if currentBuilding}
				{#each currentBuilding.floors as floor}
					<ScrollSelectOption
						value={floor}
						class="flex h-12 items-center justify-center font-black"
						selectedClass="text-white text-4xl"
						notSelectedClass="text-gray-300 text-2xl opacity-80"
					>
						{floor}
					</ScrollSelectOption>
				{/each}
			{/if}
		</OptionBox>
	</div>
</div>
