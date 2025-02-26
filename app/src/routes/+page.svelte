<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { invalidateAll, replaceState, goto } from '$app/navigation';
	import BuildingFloorSelector from '$lib/components/BuildingFloorSelector.svelte';

	let locationAvailable = $state(false);
	let locationError = $state<string | null>(null);
	let isLoadingLocation = $state(false);

	/**
	 * Request and handle user's geolocation
	 */
	function requestGeolocation(): void {
		if (!('geolocation' in navigator)) {
			locationError = 'Geolocation is not supported by your browser';
			return;
		}

		isLoadingLocation = true;
		locationError = null;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				// Set cookie with location data (expires when browser is closed)
				document.cookie = `location=${JSON.stringify({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy
				})}`;

				// Force re-render using invalidate
				invalidateAll();
				locationAvailable = true;
				isLoadingLocation = false;
			},
			(error) => {
				// Handle geolocation errors
				let errorMessage: string;
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = 'Location permission denied';
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = 'Location information unavailable';
						break;
					case error.TIMEOUT:
						errorMessage = 'Location request timed out';
						break;
					default:
						errorMessage = 'Unknown location error';
				}
				locationError = errorMessage;
				isLoadingLocation = false;
			},
			{
				// Geolocation options
				enableHighAccuracy: false, // Use less battery
				timeout: 10000, // 10 seconds timeout
				maximumAge: 600000 // Accept positions up to 10 minutes old
			}
		);
	}

	function resetLocation(): void {
		document.cookie = 'location=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		locationAvailable = false;
		invalidateAll();
	}

	onMount(() => {
		// Check if location is already in cookie
		if (document.cookie.includes('location')) {
			locationAvailable = true;
		} else {
			// Automatically request geolocation on mount
			requestGeolocation();
		}
	});

	/**
	 * Handle building and floor selection
	 */
	function handleSelection(building: string, floor: string): void {
		// Update URL with selected building and floor
		const url = new URL(window.location.href);
		url.searchParams.set('building', building);
		url.searchParams.set('floor', floor);
		replaceState(url, { building, floor });

		// Navigate to the room view
		goto(`/rooms/${building}/${floor}`);
	}

	let { data }: PageProps = $props();
</script>

<div class="flex flex-col items-center">
	<p class="text-md m-2 text-center text-gray-500">
		Select the building and floor where you want to find a free room
	</p>

	<div class="mb-4 flex items-center justify-center">
		<div class="flex items-center justify-center rounded-full p-1 transition-all duration-300">
			<button
				onclick={requestGeolocation}
				disabled={isLoadingLocation && !locationError}
				class="relative flex items-center justify-center rounded-full p-2 transition-all duration-300 {locationAvailable
					? 'text-green-600 hover:bg-green-100'
					: isLoadingLocation
						? 'text-blue-600'
						: locationError
							? 'text-amber-600 hover:bg-amber-100'
							: 'text-gray-600 hover:bg-gray-100'}"
				title={locationAvailable
					? 'Location enabled - showing buildings near you'
					: isLoadingLocation
						? 'Getting your location...'
						: locationError
							? locationError
							: 'Enable location to find nearby buildings'}
			>
				<!-- Simple Bootstrap-style Location Icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-geo"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"
					/>
				</svg>
			</button>
		</div>

		<div
			class="ml-2 text-sm {locationAvailable
				? 'text-green-600'
				: isLoadingLocation
					? 'text-blue-600'
					: locationError
						? 'text-amber-600'
						: 'text-gray-600'}"
		>
			{#if locationAvailable}
				<span>Buildings sorted by distance to you</span>
				<button onclick={resetLocation} class="ml-2 text-blue-600 underline"> Reset </button>
			{:else if isLoadingLocation}
				<span>Getting your location...</span>
			{:else if locationError}
				<span>{locationError}</span>
				<button
					onclick={requestGeolocation}
					class="ml-2 text-blue-600 underline"
					disabled={isLoadingLocation}
				>
					Try again
				</button>
			{:else}
				<span>Click the icon to enable location</span>
			{/if}
		</div>
	</div>
</div>

{#if data}
	<BuildingFloorSelector {data} selectionCallback={handleSelection} />
{/if}
