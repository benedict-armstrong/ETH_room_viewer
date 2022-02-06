<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav.svelte';
</script>

<Nav />

<div class="h-full min-h-screen w-full bg-white">
	<div class="mx-auto max-w-4xl bg-white pt-16">
		<slot />
	</div>
</div>
