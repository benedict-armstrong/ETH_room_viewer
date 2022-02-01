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

	let times: number[] = [];
	times.push(new Date().getTime());

	for (let i = 0; i < 8; i++) {
		times.push(times[i] + 60 * 60 * 1000);
	}

	let next_midnight = new Date();
	next_midnight.setHours(24, 0, 0, 0);

	function perc2color(perc: number) {
		var r,
			g,
			b = 0;

		if (perc > 100) {
			perc = 100;
		}
		if (perc < 50) {
			r = 255;
			g = Math.round(5.1 * perc);
		} else {
			g = 255;
			r = Math.round(510 - 5.1 * perc);
		}
		var h = r * 0x10000 + g * 0x100 + b * 0x1;
		return '#' + ('000000' + h.toString(16)).slice(-6);
	}
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=1"
	/>
</svelte:head>

<div class="text-center bg-white shadow p-2 sticky top-[60px] rounded-lg z-50">
	<h1 class="text-2xl m-3">{building.toUpperCase()}</h1>
	<div class="m-1">
		<p class="m-1">Free until:</p>
		<img class="object-cover h-5 w-full" src="/color-scale.png" alt="color scale" />
		<div class="flex justify-between">
			{#each times as time}
				<div>
					{format(time, 'HH:mm')}
				</div>
			{/each}
		</div>
	</div>
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
						<defs>
							<filter x="0" y="0" width="1" height="1" id="solid">
								<feFlood flood-color="white" result="bg" />
								<feMerge>
									<feMergeNode in="bg" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
						</defs>
						{#each floor.rooms as room}
							{@const coodinates = room.points.split(' ')}
							<g>
								<polygon
									id={room.name}
									style="fill: {room.next_booking
										? perc2color(
												(Date.parse(room.next_booking.toString()) - new Date().getTime()) / 2.88e5
										  )
										: perc2color(100)};"
									on:click={(e) => {
										alert(
											room.next_booking
												? 'Next Booking: ' +
														format(Date.parse(room.next_booking.toString()), 'HH:mm eee dd/LL')
												: 'No Bookings'
										);
									}}
									on:mouseenter={(e) => {}}
									on:mouseleave={(e) => {}}
									class="opacity-50 hover:fill-sky-500 fill-green-900"
									points={room.points}
								>
									<title
										>{room.name} | {room.next_booking
											? 'Next Booking: ' +
											  format(Date.parse(room.next_booking.toString()), 'HH:mm eee dd/LL')
											: 'No Bookings'}</title
									>
								</polygon>
								<!-- <text
									filter="url(#solid)"
									x={Math.min(...coodinates.map((x) => parseInt(x.split(',')[0])))}
									y={Math.max(...coodinates.map((x) => parseInt(x.split(',')[1])))}
									class=" fill-[#273F76] font-black underline text-3xl">{room.name}</text
								> -->
							</g>
						{/each}
					</svg>
				{/if}
			</div>
		</div>
	{/each}
</div>

<!-- class:fill-green-500={room.next_booking
	? new Date(room.next_booking.toString()) > next_midnight
	: true} -->
