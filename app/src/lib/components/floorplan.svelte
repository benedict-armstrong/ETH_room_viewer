<script lang="ts">
	import type { RoomWithBookingsAndMapData } from '$lib/models/types';
	import { percent2color } from '$lib/util/percent2color';
	import { format } from 'date-fns';

	export let rooms: RoomWithBookingsAndMapData[];

	let selected_room: RoomWithBookingsAndMapData | null;
	$: selected_room = rooms[0];
</script>

{#if rooms && rooms.length > 0}
	<div class="flex">
		{#if selected_room && rooms.length > 1}
			<div class="bg-white p-2 rounded-lg shadow border-gray-600 border text-sm">
				<div>
					Room: {selected_room.name}
				</div>
				<div>
					{#if selected_room.Bookings.length > 0 && selected_room.Bookings[0].start_time.getDay() === new Date().getDay()}
						Next/Current Booking: {format(selected_room.Bookings[0].start_time, 'HH:mm')} - {format(
							selected_room.Bookings[0].end_time,
							'HH:mm'
						)}
						{selected_room.Bookings[0].name}
					{:else}
						No bookings today
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<div class="m-1 my-2 flex items-center justify-center">
		<h2 class="m-2">{rooms[0].floor}</h2>
		<!-- <FloorplanMap
			{rooms}
			map_url={`/floorplans/${rooms[0].region.charAt(0)}_${rooms[0].area.charAt(0)}_${
				rooms[0].building
			}_${rooms[0].floor}.webp`}
		/> -->
		<div class="relative max-w-full">
			<img
				class=""
				src={`/floorplans/${rooms[0].region.charAt(0)}_${rooms[0].area.charAt(0)}_${
					rooms[0].building
				}_${rooms[0].floor}.webp`}
				alt="None"
			/>
			<svg
				class="absolute top-0 left-0 h-full w-full"
				viewBox="0 0 {rooms[0].MapData?.width} {rooms[0].MapData?.height}"
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
					{#if room.MapData}
						<g>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<polygon
								id={room.name}
								on:click={(e) => {
									const getUrl = window.location;
									const url = getUrl.protocol + '//' + getUrl.host + `/rooms/${room.id}`;
									location.href = url;
								}}
								on:mouseover={(e) => {
									selected_room = room;
								}}
								on:focus={(e) => {
									selected_room = room;
								}}
								fill-opacity="0.5"
								class=" fill-gray-400 hover:stroke-[#273F76] hover:stroke-[5px]"
								points={room.MapData.points}
								style="fill: {room.Bookings.length > 0
									? percent2color(
											room.Bookings[0].start_time < new Date()
												? 0
												: (room.Bookings[0].start_time.getTime() - new Date().getTime()) / 2.16e5
									  )
									: percent2color(100)};"
							>
								<title>{room.name}</title>
							</polygon>
						</g>
					{/if}
				{/each}
			</svg>
		</div>
	</div>
{/if}
