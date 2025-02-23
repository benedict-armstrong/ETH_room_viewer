<script>
	import { onMount } from 'svelte';

	let location_available = false;
	let choice = {
		type: '',
		building: '',
		floor: ''
	};

	onMount(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.log(position.coords.latitude, position.coords.longitude);
				location_available = true;
			});
		}
	});
</script>
