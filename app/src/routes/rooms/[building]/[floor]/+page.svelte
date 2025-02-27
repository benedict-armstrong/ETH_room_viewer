<script lang="ts">
	import type { PageData } from './$types';
	import RoomCard from '$lib/components/RoomCard.svelte';
	import {
		formatTime,
		formatTimeUntil,
		formatBooking,
		getISODateString
	} from '$lib/utils/dateUtils';

	let { data }: { data: PageData } = $props();

	// Track expanded state for each room using $state
	let expandedRooms = $state(new Set<number>());
	let hideOccupied = $state(false);

	// Toggle room expansion state
	function toggleRoom(roomId: number): void {
		if (expandedRooms.has(roomId)) {
			expandedRooms.delete(roomId);
		} else {
			expandedRooms.add(roomId);
		}
	}

	// Generate ETH room info URL
	function getRoomInfoUrl(building: string, floor: string, room: string): string {
		// Get current date and date in 6 days for the URL
		const today = new Date();
		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 6);

		const fromDate = getISODateString(today);
		const toDate = getISODateString(nextWeek);

		// Format room identifier (e.g., "CAB G 61")
		const roomId = `${building} ${floor} ${room}`;

		return `https://ethz.ch/staffnet/de/service/raeume-gebaeude/rauminfo/raumdetails/allocation.html?room=${encodeURIComponent(roomId)}&from=${fromDate}&to=${toDate}`;
	}

	// Get floor direction relative to selected floor
	function getFloorDirection(
		floor: string,
		selectedFloor: string
	): { direction: 'up' | 'down' | null; distance: number } {
		if (floor === selectedFloor) return { direction: null, distance: 0 };
		const direction = floor > selectedFloor ? 'up' : 'down';
		const distance = roomsByFloor[floor][0].floorDistance;
		return { direction, distance };
	}

	// Group rooms by floor
	let roomsByFloor = $derived(
		data.rooms.reduce(
			(acc, room) => {
				// Skip occupied rooms if hideOccupied is true
				if (hideOccupied && !room.currentlyFree) return acc;

				if (!acc[room.floor]) {
					acc[room.floor] = [];
				}
				acc[room.floor].push(room);
				return acc;
			},
			{} as Record<string, typeof data.rooms>
		)
	);

	// Get floor numbers (order is preserved from server-side sorting)
	let floors = $derived(Object.keys(roomsByFloor));

	// Selected floor from the first room
	let selectedFloor = $derived(data.rooms[0]?.floor || '');
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center justify-between">
		<a
			href={`/?building=${data.rooms[0]?.building}&floor=${data.rooms[0]?.floor}`}
			class="hover:text-accent ml-2 flex items-center gap-1 text-gray-600 hover:underline"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>Back to buildings</span>
		</a>

		<button
			class="hover:bg-highlight/10 text-highlight-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
			onclick={() => (hideOccupied = !hideOccupied)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
				class:opacity-50={!hideOccupied}
			>
				<path
					fill-rule="evenodd"
					d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
					clip-rule="evenodd"
				/>
				<path
					d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
				/>
			</svg>
			{hideOccupied ? 'Show All Rooms' : 'Hide Occupied'}
		</button>
	</div>

	<h1 class="text-primary mb-6 text-3xl font-bold">{data.rooms[0]?.building || ''}</h1>

	{#each floors as floor}
		<div class="mb-8">
			<h2 class="text-primary mb-4 text-2xl font-semibold">
				Floor {floor}
				{#if floor !== selectedFloor}
					{@const floorInfo = getFloorDirection(floor, selectedFloor)}
					<span class="ml-2 text-base font-normal text-gray-500">
						{#if floorInfo.direction === 'up'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline-block h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline-block h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
						{floorInfo.distance}
						{floorInfo.distance === 1 ? 'floor' : 'floors'}
						{floorInfo.direction}
					</span>
				{/if}
			</h2>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each roomsByFloor[floor] as room}
					<RoomCard
						{room}
						expanded={expandedRooms.has(room.id)}
						onToggle={toggleRoom}
						{getRoomInfoUrl}
					/>
				{/each}
			</div>
		</div>
	{/each}
</div>
