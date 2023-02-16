<script lang="ts">
	import type { RoomWithBookingsAndMapData } from '$lib/models/types';
	import FloorplanMap from './floorplan-map.svelte';

	export let rooms: RoomWithBookingsAndMapData[];
</script>

{#if rooms && rooms.length > 0}
	<h2 class="m-2">{rooms[0].floor}</h2>
	<FloorplanMap
		{rooms}
		map_url={`/floorplans/${rooms[0].region.charAt(0)}_${rooms[0].area.charAt(0)}_${
			rooms[0].building
		}_${rooms[0].floor}.webp`}
	/>
{/if}
