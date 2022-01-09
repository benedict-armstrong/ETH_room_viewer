<script lang="ts">
	import RoomList from './room-list.svelte';

	export let areas;
	export let showFreeUntil = true;
</script>

{#if areas.length == 0}
	<div class="text-center m-8">
		<p>No Rooms found</p>
	</div>
{:else}
	{#each areas as area}
		<div class="m-1 my-3 p-1 ">
			{#if area.buildings.length > 0}
				<h1 class="text-2xl text-slate-900">{area.name}</h1>
				{#each area.buildings as building}
					<div class="my-4">
						<RoomList {building} {showFreeUntil} />
					</div>
				{/each}
			{/if}
		</div>
	{/each}
{/if}
