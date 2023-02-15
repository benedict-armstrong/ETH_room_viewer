<script>
	import { search } from '$lib/stores/search';
</script>

<div class="relative z-30 m-1 text-gray-600">
	<input
		class="block w-full appearance-none rounded-lg border border-transparent bg-gray-200 py-2 pr-4 pl-10 text-left leading-normal text-gray-600 shadow-sm transition-colors duration-100 ease-in-out focus:border-[#273F76] focus:bg-white focus:outline-none"
		bind:value={$search}
		type="search"
		name="search"
		placeholder="Search"
	/>
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
		<svg
			class="pointer-events-none h-4 w-4 fill-current text-gray-600"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			><path
				d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
			/></svg
		>
	</div>
</div>
