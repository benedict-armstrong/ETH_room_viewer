<!-- <script context="module" lang="ts">
	import { groupIntoBuildings } from '../stores/group';

	export async function load({ fetch, page }) {
		const url_api = 'https://eth.benarmstro.ng/api/v1/rooms';
		const res = await fetch(url_api);
		const rooms = await res.json();

		// sort buildings by distance to my position
		const buildings = groupIntoBuildings(rooms);

		if (res.ok) {
			return {
				props: {
					buildings: buildings
				}
			};
		}
	}
</script> -->
<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import { groupIntoBuildings } from '../stores/group';
	import { filtered } from '../stores/rooms';
	import { calculateDistance } from '../util/location';

	import RoomList from '../components/room-list.svelte';
	import type { Building } from '../models/types';
	import { getUrlParam } from '../util/urlParams';

	let buildings: Building[] = groupIntoBuildings($filtered);

	const latitude = Number(getUrlParam('lat'));
	const longitude = Number(getUrlParam('lng'));

	buildings.sort((a, b) => {
		if (!a.location) {
			return 1;
		}
		if (!b.location) {
			return -1;
		}
		const aDist = calculateDistance(latitude, longitude, a.location.latitude, a.location.longitude);
		const bDist = calculateDistance(latitude, longitude, b.location.latitude, b.location.longitude);
		return bDist - aDist;
	});
</script>

<div class="text-center my-8 mx-5">
	<h1 class="text-4xl my-2">Near me</h1>
</div>
<div class="text-center" />
<div class="m-1 my-3 p-1 ">
	{#if buildings.length > 0}
		<!-- <h1 class="text-2xl text-slate-900">{area.name}</h1> -->
		{#each buildings as building}
			<div class="my-4">
				<RoomList {building} />
			</div>
		{/each}
	{/if}
</div>
