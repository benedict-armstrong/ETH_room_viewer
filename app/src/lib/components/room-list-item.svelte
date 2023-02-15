<script lang="ts">
	import type { Room, RoomWithNextBooking } from '../models/types';
	import { format, formatDistance } from 'date-fns';

	export let room: RoomWithNextBooking;
	export let showFreeUntil = true;

	export function click() {
		const getUrl = window.location;
		const url = getUrl.protocol + '//' + getUrl.host + `/rooms/${room.id}`;
		location.href = url;
	}
</script>

<div
	on:click={click}
	class="flex justify-between border-b-2 border-gray-200 p-2 last:border-b-0 sm:hover:bg-gray-100"
>
	<p>
		<strong>{room.name}</strong>
		<br class="sm:hidden" />
		<span class="text-sm">{room.room_type} | {room.capacity ? room.capacity : '-'}</span>
	</p>
	{#if showFreeUntil}
		<p>
			{#if room.booking_name && room.booking_start_time}
				<!-- {#if Math.abs(room.booking_start_time.getTime() - new Date().getTime()) > 2.16e7}
					{format(room.next_booking, 'HH:mm eee dd/LL')}
				{:else}
					{formatDistance(room.next_booking, new Date(), { addSuffix: false })}
				{/if} -->
				{format(room.booking_start_time, 'HH:mm eee dd/LL')}
			{:else}
				<span class="text-gray-200 text-sm">no bookings</span>
			{/if}
		</p>
	{/if}
</div>
