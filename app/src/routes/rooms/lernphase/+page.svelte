<!-- <script context="module" lang="ts">
	import { api_url } from '$lib/global/globals';

	export async function load({ fetch }) {
		const url = `${api_url}/rooms/lernphase`;
		const res = await fetch(url);

		const rooms = await res.json();

		if (res.ok) {
			return {
				props: {
					rooms,
					filtered: rooms
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import { groupIntoAreas } from '$lib/util/group';
	import AreaList from '$lib/components/area-list.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { search } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import Search from '$lib/components/search.svelte';

	export let rooms;
	export let filtered;

	const unsubscribe = search.subscribe((s) => {
		if (s.length > 0) {
			filtered = rooms.filter(
				(r) =>
					r.name.toLowerCase().includes(s.toLowerCase()) ||
					r.area.toLowerCase().includes(s.toLowerCase()) ||
					r.room_type.toLowerCase().includes(s.toLowerCase())
			);
		} else {
			filtered = rooms;
		}
	});

	onDestroy(() => unsubscribe);
</script>

<div class="sticky top-[60px]">
	<Search />
</div>

<h1 class="m-4 text-center text-lg">Available during Lernphase for studying (8-21h):</h1>
<p>
	These rooms are reserved for studying during Lernphase, and are usually open from 8-21 but
	sometimes even until 22h (especially at Hönggerberg). The rooms shown here are open at the moment.
</p>

{#if !filtered}
	<Loading />
{:else}
	<AreaList areas={groupIntoAreas(filtered)} showFreeUntil={false} />
{/if} -->
