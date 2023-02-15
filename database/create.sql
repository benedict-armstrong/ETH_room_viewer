SET TIME ZONE 'Europe/Zurich';

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(127) NOT NULL,
    area VARCHAR(127) NOT NULL,
    region VARCHAR(127) NOT NULL,
    floor VARCHAR(63) NOT NULL,
    room_number VARCHAR(63) NOT NULL,
    capacity INTEGER,
    room_type VARCHAR(63) NOT NULL,
    latitude VARCHAR(63),
    longitude VARCHAR(63),
    room_data BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS map_data (
    id SERIAL,
    points VARCHAR(10000),
    height VARCHAR(10),
    width VARCHAR(10),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    -- UNIQUE (start_time, end_time, room_id),
    PRIMARY KEY(id)
);