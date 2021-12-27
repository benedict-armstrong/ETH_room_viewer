<script>
	import { filtered } from '../stores/rooms';
	import Filters from './filters.svelte';
	import RoomList from './room-list.svelte';
</script>

<Filters />

{#each $filtered as area}
	<div class="m-3 p-2">
		{#if area.buildings.length > 0}
			<h1 class="text-2xl text-slate-900">{area.name}</h1>
			{#each area.buildings as building}
				<div class="m-3">
					<RoomList {building} />
				</div>
			{/each}
		{/if}
	</div>
{/each}
