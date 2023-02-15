export function percent2color(perc: number): string {
	let r, g;

	if (perc > 100) {
		perc = 100;
	}
	if (perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	} else {
		g = 255;
		r = Math.round(510 - 5.1 * perc);
	}
	const h = r * 0x10000 + g * 0x100;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}
