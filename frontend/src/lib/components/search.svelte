<script>
	import { search } from '$lib/stores/search';
</script>

<div class="relative text-gray-600 z-30 m-1">
	<input
		class="transition-colors duration-100 ease-in-out text-gray-600 py-2 pr-4 pl-10 block w-full appearance-none leading-normal border border-transparent rounded-lg focus:outline-none text-left focus:bg-white focus:border-[#273F76] bg-gray-200 shadow-sm"
		bind:value={$search}
		type="search"
		name="search"
		placeholder="Search"
	/>
	<div class="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
		<svg
			class="fill-current pointer-events-none text-gray-600 w-4 h-4"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			><path
				d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
			/></svg
		>
	</div>
</div>
