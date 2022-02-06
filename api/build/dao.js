"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomById = exports.getMapDataByBuilding = exports.getAllRoomsStudyTime = exports.getAllRooms = void 0;
const { Pool } = require('pg');
const pool = new Pool();
function getAllRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool.query(`SELECT * FROM rooms JOIN  (	
      SELECT room_id, next_booking FROM (
        SELECT id as room_id, next_booking FROM rooms LEFT JOIN (
          SELECT room_id, MIN(time) as next_booking from (
            SELECT * FROM bookings WHERE time > date_trunc('hour', now() + interval '1 hour')
          ) v GROUP BY room_id
        ) r ON rooms.id = r.room_id WHERE room_data
      ) x WHERE room_id NOT IN (SELECT room_id FROM bookings WHERE time = date_trunc('hour', now() + interval '1 hour'))
    ) bookings ON rooms.id = bookings.room_id ORDER BY area DESC, building ASC, next_booking DESC`);
    });
}
exports.getAllRooms = getAllRooms;
function getAllRoomsStudyTime() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool.query(`SELECT * FROM rooms JOIN  (	    
      SELECT room_id, MIN(time) as next_booking from (
        SELECT * FROM bookings WHERE time = date_trunc('hour', now() + interval '1 hour') AND name LIKE '%Arbeitsplätze für Studierende%'
      ) v GROUP BY room_id
    ) bookings ON rooms.id = bookings.room_id ORDER BY area DESC, building ASC, next_booking DESC`);
    });
}
exports.getAllRoomsStudyTime = getAllRoomsStudyTime;
function getMapDataByBuilding(building) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            // give the query a unique name
            name: 'fetch-map-data',
            text: `select * from map_data as map_data JOIN (
      SELECT * FROM rooms JOIN  (	
          SELECT room_id, next_booking FROM (
            SELECT id as room_id, next_booking FROM rooms LEFT JOIN (
              SELECT room_id, MIN(time) as next_booking from (
                SELECT * FROM bookings WHERE time > date_trunc('hour', now() + interval '1 hour')
              ) v GROUP BY room_id
            ) r ON rooms.id = r.room_id WHERE room_data
          ) x WHERE room_id NOT IN (SELECT room_id FROM bookings WHERE time = date_trunc('hour', now() + interval '1 hour'))
        ) bookings ON rooms.id = bookings.room_id 
    )rooms on map_data.room_id = rooms.id where building = $1`,
            values: [building],
        };
        return pool.query(query);
    });
}
exports.getMapDataByBuilding = getMapDataByBuilding;
function getRoomById(room_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            // give the query a unique name
            name: 'fetch-room-by-id',
            text: `select * from map_data as map_data JOIN (
      SELECT * FROM rooms JOIN (	
        SELECT id as room_id, next_booking FROM rooms LEFT JOIN (
          SELECT room_id, MIN(time) as next_booking from (
          SELECT * FROM bookings WHERE time > date_trunc('hour', now() + interval '1 hour')
          ) AS v GROUP BY room_id
        ) AS r ON rooms.id = r.room_id WHERE room_data
      ) AS next_bookings ON rooms.id = next_bookings.room_id JOIN (
        SELECT name as booking_name, room_id, time from bookings
      ) bookings ON rooms.id = bookings.room_id AND bookings.time = next_bookings.next_booking
    ) rooms on map_data.room_id = rooms.id where rooms.id = $1`,
            values: [room_id],
        };
        return pool.query(query);
    });
}
exports.getRoomById = getRoomById;
