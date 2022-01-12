<script lang="ts">
	import { groupIntoAreas } from '$lib/util/group';
	import { roomsStudyPhase, roomsStudyPhaseFiltered } from '$lib/stores/rooms';
	import AreaList from '$lib/components/area-list.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { search } from '$lib/stores/search';
	import { onDestroy, onMount } from 'svelte';

	const unsubscribe = search.subscribe((s) => {
		if (s.length > 0 && $roomsStudyPhase) {
			roomsStudyPhaseFiltered.set(
				$roomsStudyPhase.filter(
					(r) =>
						r.name.toLowerCase().includes(s.toLowerCase()) ||
						r.area.toLowerCase().includes(s.toLowerCase()) ||
						r.room_type.toLowerCase().includes(s.toLowerCase())
				)
			);
		} else {
			roomsStudyPhaseFiltered.set($roomsStudyPhase);
		}
	});

	onDestroy(() => unsubscribe);
</script>

<h1 class="text-lg text-center m-4">Available during Lernphase for studing (8-21h):</h1>

{#if !$roomsStudyPhaseFiltered}
	<Loading />
{:else}
	<AreaList areas={groupIntoAreas($roomsStudyPhaseFiltered)} showFreeUntil={false} />
{/if}
