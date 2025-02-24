<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/ui/navbar.svelte';
	let { children } = $props();
</script>

<Nav />

<div class="h-full w-full bg-white">
	<div class="mx-auto max-w-4xl bg-white pt-16">
		{@render children()}
	</div>
</div>
