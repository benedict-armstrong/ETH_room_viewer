export function getLocation(): void {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function (position) {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				console.log('point :' + pos.lat + ',' + pos.lng);
			},
			function (error) {
				alert('Location Error, enable location services in preferences');
				console.log(error);
			}
		);
	} else {
		console.log('Not supported');
	}
}

export function calculateDistance(
	a_lat: number,
	a_lng: number,
	b_lat: number,
	b_lng: number
): number {
	const R = 6371; // Radius of the earth in km
	const dLat = (b_lat - a_lat) * (Math.PI / 180); // deg2rad below
	const dLon = deg2rad(b_lng - a_lng);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(a_lat)) * Math.cos(deg2rad(b_lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
}

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}
