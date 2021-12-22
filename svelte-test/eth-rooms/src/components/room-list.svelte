<script>
	import { rooms } from '../stores/rooms';
	import RoomListItem from './room-list-item.svelte';
</script>

<h3>Rooms:</h3>
<div class="p-2 border-2 border-gray-200">
	{#each $rooms as room}
		<RoomListItem {room} />
	{/each}
</div>
