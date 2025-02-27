<script lang="ts">
	let isExpanded = $state(false);

	function toggleMenu() {
		isExpanded = !isExpanded;
	}
</script>

<div class="w-full transition-all">
	<button
		class="flex w-full items-center justify-end p-3 hover:bg-gray-100"
		aria-label="Toggle info menu"
		onclick={toggleMenu}
	>
		<i class="bi bi-info-circle text-xl"></i>
	</button>

	{#if isExpanded}
		<div class="border-t border-gray-200 p-4">
			<p class="text-md text-center text-gray-500">
				Choose whether you want to find a printer or an available room, then select a building and
				floor.
				<br />
				<br />
				Enable location in the top bar to sort buildings by distance.
			</p>
		</div>
	{/if}
</div>
