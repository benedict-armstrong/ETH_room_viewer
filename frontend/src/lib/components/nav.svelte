<script>
	import { draw } from 'svelte/transition';
	import { onMount } from 'svelte';

	let ready = false;
	onMount(() => (ready = true));
</script>

<nav class="flex justify-center w-full p-3 shadow-lg fixed bg-[#273F76] z-20">
	<span class="px-3 border-r border-white">
		<a href="/">
			<svg
				class="w-8 h-8 -mt-1 inline mx-auto stroke-white"
				width="100%"
				height="100%"
				viewBox="0 0 1000 1000"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xml:space="preserve"
				style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
			>
				{#if ready}
					<path
						in:draw={{ delay: 200, duration: 500 }}
						d="M932,943.943L68,943.943L68,321.185L500,56.23L932,321.185"
						style="fill:none;stroke-width:44px;"
					/>
				{/if}
				<g transform="matrix(0.938396,0,0,0.833557,62.6719,123.771)">
					<rect
						x="107.447"
						y="328.009"
						width="717.181"
						height="564.758"
						style="fill:none;stroke-width:49.58px;"
					/>
				</g>
			</svg>
		</a>
	</span>
	<span class="px-3  text-white">
		<a href="/about">About</a>
	</span>
</nav>
