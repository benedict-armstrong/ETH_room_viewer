<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		// Proxy redirects requests to / to /rooms
		await goto('/rooms', { replaceState: true });
	});
</script>
