<script lang="ts">
	import type { Filter, Area } from 'src/models/types';
	import FilterList from './filter-list.svelte';

	let hide: boolean = true;

	function toggleVisibility() {
		hide = !hide;
	}

	const filter: Filter = {
		name: 'Area',
		values: ['Zentrum', 'Hönggerberg', 'Other'],
		filterFunction: (a, value) => {
			if (value !== 'Other') {
				return a.filter((area) => area.name === value);
			} else {
				return a.filter((area) => area.name !== 'Hönggerberg' && area.name !== 'Zentrum');
			}
		}
	};

	// const filter2: Filter = {
	// 	name: 'Building',
	// 	values: ['HG', 'CAB', 'CHN', 'CLA', 'ETA', 'HIT'],
	// 	filterFunction: (a, value) => {
	// 		// Filter buildings from areas where building is equal to value
	// 		console.log(a);
	// 		let copy = JSON.parse(JSON.stringify(a));
	// 		return copy.filter(
	// 			(area) =>
	// 				(area.buildings = area.buildings.filter((building) => building.name === value)).length > 0
	// 		);
	// 	}
	// };
</script>

<div class="text-center">
	<p class="m-5">Filters</p>
	<button class=" text-gray-400 hover:text-black" on:click={toggleVisibility}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			fill="currentColor"
			class="bi bi-filter-circle"
			viewBox="0 0 16 16"
		>
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
			<path
				d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
			/>
		</svg>
	</button>

	{#if !hide}
		<FilterList {filter} />
		<!-- <FilterList filter={filter2} /> -->
	{/if}
</div>
