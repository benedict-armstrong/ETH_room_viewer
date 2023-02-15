<script>
	import { percent2color } from '$lib/util/percent2color';
	import { format } from 'date-fns';

	export let floor;

	const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
</script>

<h2 class="m-2">{floor.floor}</h2>
<div class="relative max-w-full">
	<img
		class=""
		src={`/floorplans/${floor.rooms[0].region.charAt(0)}_${floor.rooms[0].area.charAt(0)}_${
			floor.rooms[0].building
		}_${floor.floor}.webp`}
		alt="None"
	/>
	{#if floor.rooms}
		<svg
			class="absolute top-0 left-0 h-full w-full"
			viewBox="0 0 {floor.rooms[0].width} {floor.rooms[0].height}"
			height="100%"
			version="1.2"
			width="100%"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			{#each floor.rooms as room}
				{@const next_booking = room.next_booking
					? Date.parse(room.next_booking.toString()) + userTimezoneOffset
					: null}
				<g>
					<polygon
						id={room.name}
						style="fill: {room.next_booking
							? percent2color((next_booking - new Date().getTime()) / 2.16e5)
							: percent2color(100)};"
						on:click={(e) => {
							const getUrl = window.location;
							const url = getUrl.protocol + '//' + getUrl.host + `/rooms/${room.id}`;
							location.href = url;
						}}
						class=" fill-gray-400 opacity-50 hover:stroke-red-900 hover:stroke-[10px]"
						points={room.points}
					>
						<title
							>{room.name} | {room.next_booking
								? 'Next Booking: ' + format(next_booking, 'HH:mm eee dd/LL')
								: 'No Bookings'}</title
						>
					</polygon>
				</g>
			{/each}
		</svg>
	{/if}
</div>
