<script lang="ts">
	import Floorplan from '$lib/components/floorplan.svelte';

	import { generateUrl } from '$lib/util/generateUrl';
	import { format } from 'date-fns';
	import type { PageData } from './$types';
	import { splitBookings } from '$lib/util/splitBookings';

	export let data: PageData;
	$: room = data.room;
	$: url = '';
	$: {
		if (room) {
			url = generateUrl(room);
		}
	}

	function isDateToday(date: Date) {
		const todayDate = new Date();

		if (
			date.getDate() === todayDate.getDate() &&
			date.getMonth() === todayDate.getMonth() &&
			date.getFullYear() === todayDate.getFullYear()
		) {
			return true;
		} else {
			return false;
		}
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="mx-5 mt-5">
	{#if room}
		<div class="mb-3 flex items-center justify-between border-b-2 border-b-gray-200 pb-2">
			<h1 class="text-3xl">{room.name}</h1>

			{#if url}
				<a class="text-sky-700 underline" href={url} target="_blank" rel="noreferrer"
					>Rauminfo page</a
				>
			{/if}
		</div>

		{#if room.Bookings.length > 0}
			{@const bookingsByDate = splitBookings(room.Bookings)}
			<div>
				<h3 class="text-lg font-semibold">Next Bookings:</h3>
				{#each Object.entries(bookingsByDate) as [date_string, bookings]}
					{@const date = new Date(date_string)}
					<div
						class="mt-2
						{isDateToday(date) ? '' : 'opacity-30'}
					"
					>
						<h4 class="text-md font-semibold">
							{#if isDateToday(date)}
								Today - {format(date, 'dd.LL')}
							{:else}
								{format(date, 'eeee - dd.LL')}
							{/if}
						</h4>
						{#each bookings as booking}
							<div class="ml-5">
								{format(booking.start_time, 'HH:mm')} - {format(booking.end_time, 'HH:mm')}
								{booking.name}
							</div>
						{/each}
					</div>
				{/each}
				<!-- {formatDistance(room.next_booking, new Date(), { addSuffix: true })} -->
			</div>
		{:else}
			<p>No more bookings this week</p>
		{/if}

		{#if room.MapData}
			<div class="m-1 my-2 flex items-center justify-center">
				<Floorplan rooms={[room]} />
			</div>
		{/if}
	{/if}
</div>
