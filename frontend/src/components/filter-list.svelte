<script lang="ts">
	import type { Filter } from 'src/models/types';

	import { areas, fetchAreas, filtered } from '../stores/rooms';

	export let filter: Filter;
	let appliedFilter: string;

	async function applyFilter(e) {
		//await fetchAreas();

		if (appliedFilter == e.target.value) {
			filtered.set($areas);
			console.log('no filter applied');
			appliedFilter = 'none';
			return;
		}
		appliedFilter = e.target.value;
		// filter the areas array based on the selected value
		//let temp = $filtered;

		filtered.set(filter.filterFunction($areas, e.target.value));
	}
</script>

<div class="text-center">
	<div>
		<p>{filter.name}:</p>
		<div>
			{#each filter.values as fv}
				<button class="rounded-full bg-gray-100 px-4 py-2 m-4 shadow-sm">
					<input
						type="radio"
						id={fv}
						name={filter.name}
						value={fv}
						on:click={applyFilter}
						checked={appliedFilter === fv}
					/>
					<label for={fv} class="text-gray-600 px-4 py-2">{fv}</label>
				</button>
			{/each}
		</div>
	</div>
</div>
