<script lang="ts">
	import type { Filter } from 'src/models/types';
	import { getUrlParam, removeUrlParam, updateURLParameter } from '../util/urlParams';

	import { rooms, filtered } from '../stores/rooms';

	export let filter: Filter;
	let appliedFilter = getUrlParam(filter.name);

	function applyFilter(e) {
		appliedFilter = getUrlParam(filter.name);

		if (appliedFilter == e.target.value) {
			filtered.set($rooms);
			console.log('no filter applied');
			removeUrlParam(filter.name);
			return;
		}
		updateURLParameter(filter.name, e.target.value);

		filtered.set(filter.filterFunction($rooms, e.target.value));
	}
</script>

<div class="">
	<div>
		<p>{filter.name}:</p>
		<div>
			{#each filter.values as fv}
				<button class="rounded-full bg-gray-100 px-3 py-2 m-2 shadow-sm">
					<input
						type="radio"
						id={fv}
						name={filter.name}
						value={fv}
						on:click={applyFilter}
						checked={appliedFilter === fv}
					/>
					<label for={fv} class="text-gray-600 px-3 py-2">{fv}</label>
				</button>
			{/each}
		</div>
	</div>
</div>
