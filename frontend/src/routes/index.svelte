<!-- <script context="module" lang="ts">
	import { groupRooms } from '../stores/group';
	import { dev } from '$app/env';

	export async function load({ fetch }) {
		const url = dev ? 'https://eth.benarmstro.ng/api/v1/rooms' : 'http://api:3000/api/v1/rooms';
		const res = await fetch(url);
		const rooms = await res.json();

		if (res.ok) {
			return {
				props: {
					areas: groupRooms(rooms)
				}
			};
		}
	}
</script> -->
<script lang="ts">
	import AreaList from '../components/area-list.svelte';
	import { groupIntoAreas } from '../stores/group';
	import { filtered } from '../stores/rooms';
</script>

<div class="text-center my-8 mx-5">
	<h1 class="text-4xl my-2">ETH Rooms Tool</h1>
	<p>
		This page shows you all currently available rooms at ETH<br />
		Click on a room to go to the
		<a class="underline text-sky-700" href="http://www.rauminfo.ethz.ch/IndexPre.do">Rauminfo</a> page
		for that room
	</p>
	<p class="m-5">
		<a class="underline text-sky-700" href="/lernphase">Rooms during Lernphase</a>
	</p>
</div>

<AreaList areas={groupIntoAreas($filtered)} />
