import cron from 'node-cron';
import { fetchBookings } from './get_bookings';

cron.schedule('0 * * * *', async () => {
	console.log('Running scheduled task: fetching API data every hour.');
	fetchBookings();
});
