const { Pool, Client } = require('pg');

const pool = new Pool();

export async function getAllRooms(): Promise<any> {
  return pool.query(
    `SELECT * FROM rooms JOIN  (
      SELECT room_id, MIN(time) as next_booking from (
        SELECT * FROM bookings WHERE time > NOW()
      ) v GROUP BY room_id
    ) bookings ON rooms.id = bookings.room_id`
  );
}

// Line 15:  SELECT * FROM bookings WHERE time > NOW()
