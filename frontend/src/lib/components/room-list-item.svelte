<script lang="ts">
	import type { Room } from '../models/types';
	import { format } from 'date-fns';

	export let room: Room;
	export let showFreeUntil = true;

	export function click() {
		location.href = room.url ? room.url : '/';
	}
</script>

<div
	on:click={click}
	class="p-2 sm:hover:bg-gray-100 border-b-2 border-gray-200 last:border-b-0 flex justify-between"
>
	<p>
		<strong>{room.name}</strong>
		<br class="sm:hidden" />
		<span class="text-sm">{room.room_type} | {room.capacity ? room.capacity : '-'}</span>
	</p>
	{#if showFreeUntil}
		<p>
			{#if room.next_booking}
				{format(room.next_booking, 'HH:mm')}
				{format(room.next_booking, 'eee dd/LL')}
			{:else}
				<span class="text-gray-200 text-sm">no bookings today</span>
			{/if}
		</p>
	{/if}
</div>
