import { parseJSON } from 'date-fns';

export function formatDate(date: Date | string | undefined): Date | undefined {
	if (typeof date === 'string' && date != 'null') {
		// String to date
		date = parseJSON(date);
		// Subtract one hour from next_booking to adjust for timezone
		date.setHours(date.getHours() - 1);

		return date;
	}
	if (date == 'null') {
		return undefined;
	}
	return date;
}
