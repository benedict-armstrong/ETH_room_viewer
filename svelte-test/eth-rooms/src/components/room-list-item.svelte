<script lang="ts">
	import type { Room } from '../models/room';

	export let room: Room;
</script>

<div class="p-4 hover:bg-gray-200 border-b-2 border-gray-200">
	<p>{room.name}</p>
</div>
