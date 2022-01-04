<script lang="ts">
	import { goto } from '$app/navigation';
	import { getLocation } from '../util/location';
	import { createEventDispatcher } from 'svelte';

	//Declare the dispatch
	const dispatch = createEventDispatcher();

	function click(e) {
		if (e.target.value === 'location') {
			getLocation();
			goto('/near-me');
		}
		dispatch('click', { value: e.target.value });
	}
</script>

<div class="flex justify-between">
	<button on:click={click} class="btn btn-blue shadow-lg" value="filter">
		<svg
			class="w-7 h-7 -mt-1 inline mx-auto"
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
			<path
				d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
			/>
		</svg>
	</button>
	<button on:click={click} class="btn btn-blue shadow-lg" value="location">
		<svg
			class="w-7 h-7 -mt-1 inline mx-auto"
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"
				style="stroke:none;"
			/>
		</svg>
	</button>
</div>

<style>
	.btn {
		@apply font-bold py-4 px-4 rounded m-3 w-6/12;
	}
	.btn-blue {
		@apply bg-[#3657a3] text-white;
	}
</style>
