const { Pool, Client } = require('pg');

const pool = new Pool();

export async function getAllRooms(): Promise<any> {
  return pool.query(
    `SELECT * FROM rooms JOIN  (	
      SELECT room_id, next_booking FROM (
        SELECT room_id, MIN(time) as next_booking from (
            SELECT * FROM bookings WHERE time > NOW()
            ) v GROUP BY room_id
        ) x WHERE room_id NOT IN (SELECT room_id FROM bookings WHERE time = date_trunc('hour', now() + interval '1 hour'))
      ) bookings ON rooms.id = bookings.room_id ORDER BY area DESC, building ASC, next_booking DESC`
  );
}

export async function getAllRoomsStudyTime(): Promise<any> {
  return pool.query(
    `SELECT * FROM rooms JOIN  (	
      SELECT room_id, next_booking FROM (
        SELECT room_id, MIN(time) as next_booking from (
            SELECT * FROM bookings WHERE time > NOW() AND name LIKE '%Arbeitsplätze für Studierende%'
            ) v GROUP BY room_id
        ) x WHERE room_id IN (SELECT room_id FROM bookings WHERE time = date_trunc('hour', now() + interval '1 hour'))
      ) bookings ON rooms.id = bookings.room_id ORDER BY area DESC, building ASC, next_booking DESC`
  );
}

// `SELECT * FROM rooms JOIN  (
//   SELECT room_id, MIN(time) as next_booking from (
//     SELECT * FROM bookings WHERE time > NOW()
//   ) v GROUP BY room_id
// ) bookings ON rooms.id = bookings.room_id ORDER BY area DESC, building ASC, next_booking DESC`
