<script lang="ts">
	import type { Room } from '../models/types';
	import { format } from 'date-fns';

	export let room: Room;
</script>

<div class="p-2 hover:bg-gray-100 border-b-2 border-gray-200 flex last:border-b-0 justify-between">
	<p>
		<strong>{room.name}</strong>
		<span class="text-sm">{room.room_type} | {room.capacity ? room.capacity : '-'}</span>
	</p>
	<p>
		{format(room.next_booking, 'HH:mm')} on {format(room.next_booking, 'eee dd/LL')}
	</p>
</div>
