<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/ui/navbar.svelte';
	import { onMount } from 'svelte';
	let { children } = $props();

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

	onMount(() => {
		// Check if location is already in cookie
		if (document.cookie.includes('location')) {
			locationAvailable = true;
		} else {
			// Automatically request geolocation on mount
			requestGeolocation();
		}
	});
</script>

<Nav
	{locationAvailable}
	{locationError}
	{isLoadingLocation}
	onLocationRequest={requestGeolocation}
/>

<div class="h-full w-full bg-white">
	<div class="mx-auto max-w-4xl bg-white pt-16">
		{@render children()}
	</div>
</div>
