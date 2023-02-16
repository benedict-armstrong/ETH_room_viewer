import type { Booking } from '@prisma/client';

/**
 * Splits a list of bookings into a map of bookings by date.
 * @param bookings The list of bookings to split.
 * @returns A map of bookings by date.
 * @example
 * const bookingsByDate = splitBookings(bookings);
 * const bookingsOnDate = bookingsByDate['2021-01-01'];
 * console.log(bookingsOnDate);
 * // [{...}, {...}, ...]
 **/
export function splitBookings(bookings: Booking[]): {
	[key: string]: Booking[];
} {
	const bookingsByDate: { [key: string]: Booking[] } = {};

	bookings.forEach((booking) => {
		const date = booking.start_time.toISOString().split('T')[0];
		if (bookingsByDate[date]) {
			bookingsByDate[date].push(booking);
		} else {
			bookingsByDate[date] = [booking];
		}
	});

	return bookingsByDate;
}
