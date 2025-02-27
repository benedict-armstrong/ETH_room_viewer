<script lang="ts">
	import { draw } from 'svelte/transition';
	import { onMount } from 'svelte';

	let {
		locationAvailable,
		locationError,
		isLoadingLocation,
		onLocationRequest
	}: {
		locationAvailable: boolean;
		locationError: string | null;
		isLoadingLocation: boolean;
		onLocationRequest: () => void;
	} = $props();

	let ready = $state(false);
	onMount(() => (ready = true));
</script>

<nav class="bg-primary fixed z-20 flex w-full items-center justify-between p-3 shadow-lg">
	<div class="flex items-center">
		<span class="border-r border-white px-3">
			<a href="/">
				<svg
					class="mx-auto -mt-1 inline h-8 w-8 stroke-white"
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
		<span class="px-3 text-white">
			<a class="hover:underline" href="/about">About</a>
		</span>
	</div>

	<div class="flex items-center gap-2">
		<button
			onclick={onLocationRequest}
			disabled={isLoadingLocation && !locationError}
			class="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10"
			title={locationAvailable
				? 'Location enabled - showing buildings near you'
				: isLoadingLocation
					? 'Getting your location...'
					: locationError
						? locationError
						: 'Enable location to find nearby buildings'}
			aria-label="Enable location to find nearby buildings"
		>
			{#if isLoadingLocation}
				<div
					class="absolute inset-0 h-full w-full animate-spin rounded-full border-2 border-transparent border-t-white"
				></div>
			{/if}
			<i
				class="bi bi-geo{locationAvailable ? '-fill' : ''} text-xl {isLoadingLocation
					? 'animate-pulse'
					: ''}"
			></i>
		</button>
	</div>
</nav>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
