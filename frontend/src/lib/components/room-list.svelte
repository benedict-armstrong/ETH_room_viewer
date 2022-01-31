<script lang="ts">
	import RoomListItem from './room-list-item.svelte';
	import type { Building } from '../models/types';

	export let building: Building;
	export let showFreeUntil = true;
</script>

<div class="p-2 border-2 border-gray-200">
	{#if building}
		<div class="flex justify-between">
			<h2 class="text-lg">{building.name}</h2>
			<a href={`/map-view/${building.name}`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-map"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98 4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"
					/>
				</svg></a
			>
		</div>
		<div class="m-1">
			<div class="text-sm mx-2 text-gray-300 flex justify-between">
				<p><strong>Name</strong> | Type | Capacity</p>
				{#if showFreeUntil}
					<p>Free until</p>
				{/if}
			</div>
			{#each building.rooms as room}
				<RoomListItem {room} {showFreeUntil} />
			{/each}
		</div>
	{/if}
</div>
