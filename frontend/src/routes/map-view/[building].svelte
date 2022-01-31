<script context="module">
	import { api_url } from '$lib/global/globals';

	export async function load({ params, fetch }) {
		const { building } = params;

		const url = `${api_url}/rooms`;
		const res = await fetch(url);
		const rooms = (await res.json()).filter((room) => room.building === building.toUpperCase());

		const floors_list = [
			...new Set(
				rooms.filter((room) => room.building === building.toUpperCase()).map((room) => room.floor)
			)
		].sort();

		let floors = [];
		for (let floor of floors_list) {
			floors.push({
				floor: floor,
				rooms: rooms
					.filter((room) => room.floor.toUpperCase() === floor.toUpperCase())
					.map((room) => (room.mask = {}))
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
	import { format } from 'date-fns';

	export let floors: {
		floor: string;
		rooms: Room[];
	}[];
	export let building: string;

	let today = new Date();
	today.setDate(today.getDate() + 1);
</script>

<h1 class="text-center text-2xl m-3">{building.toUpperCase()}</h1>

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
				{#each floor.rooms as room}
					<!-- <img
						class="absolute overlay top-0 left-0 w-full h-full"
						src={`/room_masks/${room.region.charAt(0)}_${room.area.charAt(0)}_${building}_${
							floor.floor
						}_${room.room_number}_mask.svg`}
						alt={room.room_number}
					/> -->
					{#if room.mask}
						<svg
							baseProfile="tiny"
							height={room.mask.height}
							version="1.2"
							width={room.mask.width}
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
						>
							<defs />
							<g id="polygon">
								<polygon fill="green" points={room.mask.points} />
							</g>
						</svg>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	/* .overlay {
		filter: opacity(0.5) invert(58%) sepia(55%) saturate(5665%) hue-rotate(162deg) brightness(95%)
			contrast(106%);
	} */
</style>
