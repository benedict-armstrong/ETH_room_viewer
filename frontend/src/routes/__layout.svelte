<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav.svelte';
</script>

<div id="apple-touch-status-bar" />

<Nav />

<div class="bg-white w-full h-full min-h-screen">
	<div class="pt-16 max-w-4xl mx-auto bg-white">
		<slot />
	</div>
</div>

<style>
	#apple-touch-status-bar {
		position: fixed;
		transform: translateY(-60px);
		height: 60px;
		background-color: #273f76;
		width: 100%;
		z-index: 20;
	}
</style>
