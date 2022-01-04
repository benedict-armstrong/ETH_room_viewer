<script lang="ts">
	import { groupIntoAreas } from '../stores/group';
	import { roomsStudyPhase } from '../stores/rooms';
	import AreaList from './area-list.svelte';
</script>

<h1 class="text-lg text-center">Available during Lernphase for studing:</h1>

<AreaList areas={groupIntoAreas($roomsStudyPhase)} showFreeUntil={false} />
