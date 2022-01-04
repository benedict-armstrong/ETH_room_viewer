<script lang="ts">
	import { filters } from '../data/filters.json';

	import FilterList from './filter-list.svelte';
</script>

<h1 class="bg-white rounded-lg p-4 m-3 shadow-lg text-lg">Filters:</h1>
<div class="h-2/6 max-h-[60vh] bg-white rounded-lg p-4 mx-3 shadow-lg overflow-scroll">
	{#each filters as filter}
		<FilterList {filter} />
	{/each}
</div>
