<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav.svelte';
</script>

<Nav />

<div class="bg-white w-full h-full min-h-screen">
	<div class="pt-16 max-w-4xl mx-auto bg-white">
		<slot />
	</div>
</div>
