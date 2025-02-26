<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Track expanded state for each room using $state
	let expandedRooms = $state(new Set<number>());

	// Toggle room expansion state
	function toggleRoom(roomId: number): void {
		if (expandedRooms.has(roomId)) {
			expandedRooms.delete(roomId);
		} else {
			expandedRooms.add(roomId);
		}
	}

	import {
		formatTime,
		formatTimeUntil,
		formatBooking,
		getISODateString
	} from '$lib/utils/dateUtils';
	import BookingItem from '$lib/components/BookingItem.svelte';

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

<!-- Add a back button to go back to the previous page set building and floor -->
<a
	href={`/?building=${data.rooms[0]?.building}&floor=${data.rooms[0]?.floor}`}
	class="mb-4 ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:underline"
>
	<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		<path
			fill-rule="evenodd"
			d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
			clip-rule="evenodd"
		/>
	</svg>
	<span>Back to buildings</span>
</a>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-3xl font-bold">Rooms in {data.rooms[0]?.building || ''}</h1>

	{#each floors as floor}
		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">
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
					<div
						class="flex cursor-pointer flex-col justify-between rounded-lg border-2 bg-white p-4 shadow-sm transition-all hover:shadow-md {room.currentlyFree
							? 'border-green-500 bg-green-50'
							: expandedRooms.has(room.id)
								? 'border-gray-300'
								: 'border-gray-200'}"
						onclick={() => !room.currentlyFree && toggleRoom(room.id)}
						onkeydown={(e) => e.key === 'Enter' && !room.currentlyFree && toggleRoom(room.id)}
						role="button"
						tabindex="0"
					>
						<div>
							<div class="flex items-center justify-between">
								<h3 class="text-xl font-semibold text-gray-800">{room.name}</h3>
								<div class="flex items-center gap-2">
									{#if room.currentlyFree}
										<span
											class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
										>
											{room.nextBooking ? formatTimeUntil(room.nextBooking.start) : 'all day'}
										</span>
									{:else}
										<span
											class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800"
										>
											{formatTime(room.currentBooking?.end || new Date())}
										</span>
										{#if !expandedRooms.has(room.id)}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5 text-gray-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clip-rule="evenodd"
												/>
											</svg>
										{/if}
									{/if}
									<a
										href={getRoomInfoUrl(room.building, room.floor, room.room)}
										class="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
										target="_blank"
										rel="noopener noreferrer"
										onclick={(e) => e.stopPropagation()}
										onkeydown={(e) => e.stopPropagation()}
										title="View on ETH Room Info"
										aria-label="Link to ETH room Info"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
											/>
											<path
												d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
											/>
										</svg>
									</a>
								</div>
							</div>
							{#if !room.currentlyFree || expandedRooms.has(room.id)}
								{#if room.currentBooking}
									<div class="mt-2 text-sm text-red-700">
										<p class="font-medium">{room.currentBooking.eventName}</p>
										<p>{formatBooking(room.currentBooking.start, room.currentBooking.end)}</p>
									</div>
								{/if}
								{#if room.nextBooking}
									<div
										class="mt-2 text-sm {room.currentlyFree ? 'text-green-700' : 'text-gray-600'}"
									>
										<p class="font-medium">Next: {room.nextBooking.eventName}</p>
										<p>{formatBooking(room.nextBooking.start, room.nextBooking.end)}</p>
									</div>
								{:else if room.currentlyFree}
									<p class="mt-2 text-sm font-medium text-green-700">No upcoming bookings</p>
								{/if}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
