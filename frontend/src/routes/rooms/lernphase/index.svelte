<script lang="ts">
	import { groupIntoAreas } from '$lib/util/group';
	import { roomsStudyPhase } from '$lib/stores/rooms';
	import AreaList from '$lib/components/area-list.svelte';
	import Loading from '$lib/components/loading.svelte';
</script>

<h1 class="text-lg text-center m-4">Available during Lernphase for studing (8-21h):</h1>

{#if !$roomsStudyPhase}
	<Loading />
{:else}
	<AreaList areas={groupIntoAreas($roomsStudyPhase)} showFreeUntil={false} />
{/if}
