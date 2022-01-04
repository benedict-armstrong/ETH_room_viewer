<script lang="ts">
	import '../app.css';

	import Nav from '../components/nav.svelte';
	import { clickOutside } from '../util/clickOutside';
	import MobileButtons from '../components/mobile-buttons.svelte';
	import FiltersPanel from '../components/filters-panel.svelte';

	let show: string = '';

	function showOptions(e) {
		console.log(show);
		console.log(e.detail.value);
		if (show === e.detail.value) {
			show = '';
			alert('Test');
		} else {
			show = e.detail.value;
		}
	}
</script>

<div id="apple-touch-status-bar" />

<Nav />

<div class="bg-white w-full h-full min-h-screen">
	<div class="pt-16 max-w-4xl mx-auto bg-white">
		<slot />
		<div class="fixed max-w-4xl w-full bottom-3">
			{#if show === 'filter'}
				<div use:clickOutside on:outclick={() => (show = '')} class="modal">
					<FiltersPanel />
				</div>
				<div class="fixed top-0 left-0 w-full h-full bg-black opacity-50 -z-10" />
			{/if}

			<MobileButtons on:click={showOptions} />
		</div>
	</div>
</div>

<style>
	#apple-touch-status-bar {
		position: fixed;
		transform: translateY(-60px);
		height: 60px;
		background-color: #273f76;
		width: 100%;
		z-index: 1;
	}
</style>
