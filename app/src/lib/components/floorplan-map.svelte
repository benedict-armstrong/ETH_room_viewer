<script lang="ts">
	import type { RoomWithBookingsAndMapData } from '$lib/models/types';

	export let map_url: string;
	export let rooms: RoomWithBookingsAndMapData[];
</script>

<div class="relative max-w-full">
	<img class="" src={map_url} alt="None" />
	<svg
		class="absolute top-0 left-0 h-full w-full"
		viewBox="0 0 {rooms[0].MapData[0].width} {rooms[0].MapData[0].height}"
		height="100%"
		version="1.2"
		width="100%"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		{#each rooms as room}
			<!-- {@const next_booking = room.
            ? Date.parse(room.next_booking.toString()) + userTimezoneOffset
            : null} -->
			{#if room.MapData.length > 0}
				<g>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<polygon
						id={room.name}
						on:click={(e) => {
							const getUrl = window.location;
							const url = getUrl.protocol + '//' + getUrl.host + `/rooms/${room.id}`;
							location.href = url;
						}}
						class=" fill-gray-400 opacity-50 hover:stroke-red-900 hover:stroke-[10px]"
						points={room.MapData[0].points}
					>
						<title>{room.name} | {room.MapData.length}</title>
					</polygon>
				</g>
			{/if}
		{/each}
	</svg>
</div>
