<script context="module">
	import { api_url } from '$lib/global/globals';

	export async function load({ params, fetch }) {
		const { building } = params;

		const url = `${api_url}/rooms/map-data/${building}`;
		const res = await fetch(url);
		const rooms = await res.json();

		const floors_list = [...new Set(rooms.map((room) => room.floor))].sort();

		let floors = [];
		for (let floor of floors_list) {
			floors.push({
				floor: floor,
				rooms: rooms.filter((room) => room.floor === floor)
			});
		}

		if (res.ok) {
			return {
				props: {
					rooms,
					floors,
					building: building.toUpperCase()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import type { Room } from '$lib/models/types';
	import { format, parse } from 'date-fns';

	export let floors: {
		floor: string;
		rooms: Room[];
	}[];
	export let building: string;

	let today = new Date();
	today.setHours(24, 0, 0, 0);
	console.log(today);
</script>

<div class="text-center">
	<h1 class="text-2xl m-3">{building.toUpperCase()}</h1>
	<p class="m-2">
		<span class="bg-green-500 text-green-500 p-1">.</span> = free all day
	</p>
</div>

<div class="floorplans max-w-full p-2">
	{#each floors as floor}
		<div class="my-2 flex justify-center items-center">
			<h2 class="m-2">{floor.floor}</h2>
			<div class="relative max-w-full">
				<img
					class=""
					src={`/floorplans/${floor.rooms[0].region.charAt(0)}_${floor.rooms[0].area.charAt(
						0
					)}_${building}_${floor.floor}.webp`}
					alt="None"
				/>
				{#if floor.rooms}
					<svg
						class="absolute top-0 left-0 w-full h-full"
						viewBox="0 0 {floor.rooms[0].width} {floor.rooms[0].height}"
						height="100%"
						version="1.2"
						width="100%"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
					>
						<defs />
						{#each floor.rooms as room}
							<g>
								<polygon
									id={room.name}
									class:fill-green-500={room.next_booking
										? new Date(room.next_booking.toString()) > today
										: true}
									on:click={(e) =>
										alert(
											room.next_booking
												? 'Next Booking: ' +
														format(Date.parse(room.next_booking.toString()), 'HH:mm eee dd/LL')
												: 'No Bookings'
										)}
									class="opacity-70 hover:fill-sky-500 fill-[#273F76]"
									points={room.points}
								>
									<title
										>{room.name} | {room.next_booking
											? 'Next Booking: ' +
											  format(Date.parse(room.next_booking.toString()), 'HH:mm eee dd/LL')
											: 'No Bookings'}</title
									>
								</polygon>
							</g>
						{/each}
					</svg>
				{/if}
			</div>
		</div>
	{/each}
</div>
