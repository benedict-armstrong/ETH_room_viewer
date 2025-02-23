import cron from 'node-cron';
import { fetch_bookings } from './get_bookings';

cron.schedule('0 * * * *', async () => {
	console.log('Running scheduled task: fetching API data every hour.');
	fetch_bookings();
});
