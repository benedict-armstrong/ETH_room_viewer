SET TIME ZONE 'Europe/Zurich';

CREATE TABLE IF NOT EXISTS Room (
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

CREATE TABLE IF NOT EXISTS MapData (
    id SERIAL,
    points VARCHAR(10000),
    height VARCHAR(10),
    width VARCHAR(10),
    room_id INTEGER NOT NULL UNIQUE REFERENCES Room(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Booking (
    id SERIAL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    event_id INTEGER NOT NULL REFERENCES Event(id),
    room_id INTEGER NOT NULL REFERENCES Room(id),

    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS EVENT (
    id SERIAL,
    name VARCHAR(255) NOT NULL,

    organizer VARCHAR(255),
    type VARCHAR(255),
    description VARCHAR(255),
)