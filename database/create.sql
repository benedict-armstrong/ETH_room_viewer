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
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    time TIMESTAMP NOT NULL,
    room_id INTEGER NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY(room_id) REFERENCES rooms(id),
    PRIMARY KEY(id)
);

ALTER TABLE rooms
ADD latitude VARCHAR(63);

ALTER TABLE rooms
ADD longitude VARCHAR(63);

ALTER TABLE bookings ADD CONSTRAINT bookings_unique_time_room UNIQUE (time, room_id);