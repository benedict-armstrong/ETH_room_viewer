<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		// Proxy redirects requests to / to /rooms
		await goto('/rooms', { replaceState: true });
	});
</script>

<Nav />

<div class="h-full min-h-screen w-full bg-white">
	<div class="mx-auto max-w-4xl bg-white pt-16">
		<slot />
	</div>
</div>
