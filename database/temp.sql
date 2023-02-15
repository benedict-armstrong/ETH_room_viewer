-- SELECT * FROM rooms JOIN  (
--    SELECT room_id, next_booking FROM (
--        SELECT id as room_id, next_booking FROM rooms LEFT JOIN (
--            SELECT room_id, MIN(time) as next_booking from (
--            SELECT * FROM bookings WHERE time > date_trunc('hour', now() + interval '1 hour')
--            ) v GROUP BY room_id
--        ) r ON rooms.id = r.room_id WHERE room_data
--    ) x WHERE room_id NOT IN (SELECT room_id FROM bookings WHERE time = date_trunc('hour', now() + interval '1 hour'))
-- ) bookings ON rooms.id = bookings.room_id ORDER BY area DESC, building ASC, next_booking DESC
-- ALTER DATABASE postgres SET timezone TO 'Europe/Berlin';


SELECT
    *
FROM
    rooms
    JOIN (
        SELECT
            id as room_id,
            next_booking
        FROM
            rooms
            LEFT JOIN (
                SELECT
                    room_id,
                    MIN(start_time) AS next_booking
                FROM
                    (
                        SELECT
                            *
                        FROM
                            bookings
                        WHERE
                            "bookings" ."start_time" > now()
                    ) v
                GROUP BY
                    room_id
            ) r ON rooms.id = r.room_id
        WHERE
            room_data
    ) k ON rooms.id = k."room_id"
WHERE
    id NOT IN (
        SELECT
            room_id
        from
            bookings
        where
            NOW() NOT BETWEEN "bookings" ."start_time"
            and "bookings" ."end_time"
    )


-- Next

SELECT
    *
FROM
    rooms
WHERE
    id NOT IN (
        SELECT
            *
        FROM
            bookings
        WHERE
            NOW() > "bookings"."start_time"
        AND
            NOW() < "bookings"."end_time"
    )