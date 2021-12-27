<script lang="ts">
	import RoomListItem from './room-list-item.svelte';
	import type { Building } from '../models/types';

	export let building: Building;
</script>

<div class="p-2 border-2 border-gray-200">
	{#if building}
		<h2 class="text-lg">{building.name}</h2>
		<div class="m-1">
			<div class="text-sm mx-2 text-gray-300 flex justify-between">
				<p><strong>Name</strong> | Type | Capacity</p>
				<p>Free until</p>
			</div>
			{#each building.rooms as room}
				<RoomListItem {room} />
			{/each}
		</div>
	{/if}
</div>
