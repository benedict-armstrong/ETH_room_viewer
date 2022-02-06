<script context="module">
	import { api_url } from '$lib/global/globals';

	export async function load({ params, fetch }) {
		const { id } = params;

		const url = `${api_url}/rooms/${id}`;
		const res = await fetch(url);
		const data = await res.json();

		if (res.ok) {
			const room = data;

			room.url = generateUrl(room);
			room.next_booking = formatDate(room.next_booking);

			return {
				props: {
					room
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
	import { formatDate } from '$lib/util/formatDate';
	import { generateUrl } from '$lib/util/generateUrl';
	import { format, formatDistance } from 'date-fns';

	export let room: Room;
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="mx-5 mt-5">
	<div class="mb-3 flex items-center justify-between border-b-2 border-b-gray-200 pb-2">
		<h1 class="text-3xl">{room.name}</h1>

		{#if room.url}
			<a class="text-sky-700 underline" href={room.url}>Rauminfo page</a>
		{/if}
	</div>

	{#if room.next_booking}
		<p>
			<strong>Next Booking:</strong>
			{formatDistance(room.next_booking, new Date(), { addSuffix: true })}
			<br class="sm:hidden" />({format(room.next_booking, 'HH:mm eeee dd/LL')})
			{#if room.booking_name}
				<br />
				<strong>Next Course:</strong>
				{room.booking_name}
			{/if}
		</p>
	{:else}
		<p>No bookings</p>
	{/if}

	{#if room.points}
		<div class="m-1 my-2 flex items-center justify-center">
			<Floorplan
				floor={{
					floor: room.floor,
					rooms: [room]
				}}
			/>
		</div>
	{/if}
</div>
