<script context="module">
	import { api_url } from '$lib/global/globals';

	export async function load({ params, fetch }) {
		const { building } = params;

		const url = `${api_url}/rooms/map-data/${building}`;
		const res = await fetch(url);
		const data = await res.json();

		if (res.ok) {
			const rooms = data;
			const floors_list = [...new Set(rooms.map((room) => room.floor))].sort();

			let floors = [];
			for (let floor of floors_list) {
				floors.push({
					floor: floor,
					rooms: rooms.filter((room) => room.floor === floor)
				});
			}

			return {
				props: {
					floors,
					building: building.toUpperCase()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`${data.error}`)
		};
	}
</script>

<script lang="ts">
	import Floorplan from '$lib/components/floorplan.svelte';

	import type { Room } from '$lib/models/types';
	import { format } from 'date-fns';

	export let floors: {
		floor: string;
		rooms: Room[];
	}[];
	export let building: string;

	let times: number[] = [];
	times.push(new Date().getTime());

	for (let i = 0; i < 6; i++) {
		times.push(times[i] + 60 * 60 * 1000);
	}

	let next_midnight = new Date();
	next_midnight.setHours(24, 0, 0, 0);
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="sticky top-[60px] z-50 m-2 rounded-lg bg-white p-2 text-center shadow">
	<h1 class="m-3 text-2xl">{building.toUpperCase()}</h1>
	<div class="m-1">
		<p class="m-1">
			Free until: <br />
			<span class="text-xs">(fully green means the room is free for 6 or more hours)</span>
		</p>
		<img class="h-3 w-full object-cover" src="/color-scale.png" alt="color scale" />
		<div class="flex justify-between">
			{#each times as time}
				<div class="text-sm">
					{format(time, 'HH:mm')}
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="max-w-full p-2">
	{#each floors as floor}
		<div class="m-1 my-2 flex items-center justify-center">
			<Floorplan {floor} />
		</div>
	{/each}
</div>
