/**
 * Utility functions for date and time formatting and calculations
 */

// Timezone offset constant for Europe/Zurich (in milliseconds)
const ZURICH_TIMEZONE_OFFSET = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Format time to show only time in 24h format (Zurich timezone)
 */
export function formatTime(date: Date): string {
	// Add one hour to adjust for timezone difference
	const adjustedDate = new Date(date.getTime() + ZURICH_TIMEZONE_OFFSET);
	return new Intl.DateTimeFormat('de-CH', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'Europe/Zurich'
	}).format(adjustedDate);
}

/**
 * Format time until next booking
 */
export function formatTimeUntil(date: Date): string {
	const now = new Date();
	// Add one hour to adjust for timezone difference
	const adjustedDate = new Date(date.getTime() + ZURICH_TIMEZONE_OFFSET);
	const diffMs = adjustedDate.getTime() - now.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (diffHours > 0) {
		return `${diffHours} h`;
	} else if (diffMinutes > 0) {
		return `${diffMinutes} m`;
	} else {
		return 'all day';
	}
}

/**
 * Format booking time range
 */
export function formatBooking(start: Date, end: Date): string {
	return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
	if (distance < 1000) {
		return `${distance.toFixed(0)} m`;
	} else {
		const km = distance / 1000;
		return `${km.toFixed(1)} km`;
	}
}

/**
 * Get ISO date string (YYYY-MM-DD) from Date object
 */
export function getISODateString(date: Date): string {
	return date.toISOString().split('T')[0];
}
