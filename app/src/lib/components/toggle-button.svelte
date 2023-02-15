<script lang="ts">
	export let label: string = 'Label';
</script>

<div class="-z-1">
	<label for="toggleB" class="flex cursor-pointer items-center">
		<!-- label -->
		<div class="mr-3 ml-3 font-medium text-gray-700">{label}</div>
		<!-- toggle -->
		<div class="z-1 relative">
			<!-- input -->
			<input type="checkbox" id="toggleB" class="sr-only" />
			<!-- line -->
			<div class="block h-6 w-10 rounded-full bg-gray-200" />
			<!-- dot -->
			<div class="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition" />
		</div>
	</label>

	<style>
		input:checked ~ .dot {
			transform: translateX(100%);
			background-color: #273f76;
		}

		/* Toggle B */
		input:checked ~ .dot {
			transform: translateX(100%);
			background-color: #273f76;
		}
	</style>
</div>
