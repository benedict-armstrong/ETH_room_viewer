<script lang="ts">
	import { formatTime, formatTimeUntil, formatBooking } from '$lib/utils/dateUtils';
	import type { RoomWithBookings } from '../../routes/rooms/[building]/[floor]/proxy+page.server';

	let {
		room,
		expanded = false,
		onToggle,
		getRoomInfoUrl
	}: {
		room: RoomWithBookings;
		expanded: boolean;
		onToggle: (id: number) => void;
		getRoomInfoUrl: (building: string, floor: string, room: string) => string;
	} = $props();
</script>

<div
	class="flex cursor-pointer flex-col justify-between rounded-lg border-2 bg-white p-4 shadow-sm transition-all hover:shadow-md {room.currentlyFree
		? 'border-highlight bg-highlight/5'
		: expanded
			? 'border-gray-300'
			: 'border-gray-200'}"
	onclick={() => !room.currentlyFree && onToggle(room.id)}
	onkeydown={(e) => e.key === 'Enter' && !room.currentlyFree && onToggle(room.id)}
	role="button"
	tabindex="0"
>
	<div>
		<div class="flex items-center justify-between">
			<h3 class="text-xl font-semibold text-gray-800">{room.name}</h3>
			<div class="flex items-center gap-2">
				{#if room.currentlyFree}
					<span
						class="bg-highlight/10 text-highlight-dark rounded-full px-3 py-1 text-sm font-medium"
					>
						{room.nextBooking ? formatTimeUntil(room.nextBooking.start) : 'all day'}
					</span>
				{:else}
					<span
						class="bg-secondary/10 text-secondary-dark rounded-full px-3 py-1 text-sm font-medium"
					>
						{formatTime(room.currentBooking?.end || new Date())}
					</span>
					{#if !expanded}
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
					class="hover:text-accent rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
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
		{#if !room.currentlyFree || expanded}
			{#if room.currentBooking}
				<div class="text-secondary-dark mt-2 text-sm">
					<p class="font-medium">{room.currentBooking.eventName}</p>
					<p>{formatBooking(room.currentBooking.start, room.currentBooking.end)}</p>
				</div>
			{/if}
			{#if room.nextBooking}
				<div class="mt-2 text-sm {room.currentlyFree ? 'text-highlight-dark' : 'text-gray-600'}">
					<p class="font-medium">Next: {room.nextBooking.eventName}</p>
					<p>{formatBooking(room.nextBooking.start, room.nextBooking.end)}</p>
				</div>
			{:else if room.currentlyFree}
				<p class="text-highlight-dark mt-2 text-sm font-medium">No upcoming bookings</p>
			{/if}
		{/if}
	</div>
</div>
