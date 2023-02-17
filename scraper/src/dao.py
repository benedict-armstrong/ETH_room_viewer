from typing import List
from db import get_db_cursor
import db
from datetime import datetime, timedelta
from models import Room, Booking, MapData

from settings import settings


db.connect(
    server=settings.PGHOST,
    database=settings.PGDATABASE,
    user=settings.PGUSER,
    password=settings.PGPASSWORD,
    port=settings.PGPORT
)


def get_room_id_by_name(name):
    with get_db_cursor() as cursor:
        cursor.execute("""select id from room where name = %s""", [name])
        return cursor.fetchone()


def insert_map_data(width, height, points, room_id):
    with get_db_cursor() as cursor:
        cursor.execute("""insert into "MapData" (width, height, points, room_id) values (%s, %s, %s, %s)""",
                       [width, height, points, room_id])


def get_all_map_data() -> List[MapData]:
    with get_db_cursor() as cursor:
        cursor.execute("""select * from "MapData";""")
        raw = cursor.fetchall()
        return [MapData(**r) for r in raw]


def update_map_data_points(points: str, room_id: int):
    with get_db_cursor() as cursor:
        cursor.execute("""update "MapData" set points = %s where room_id = %s""", [
                       points, room_id])
        return


def delete_all_past_bookings():
    with get_db_cursor() as cursor:
        cursor.execute("""delete from Booking where end_time < now()""")


def update_rooms_where_data_available():
    with get_db_cursor() as cursor:
        cursor.execute(
            """update room set room_data = true where id in (select room_id from booking)""")


def insert_bookings_list(bookings: List[Booking]):
    with get_db_cursor() as cursor:
        cursor.executemany(
            """
        INSERT INTO booking (name, start_time, end_time, room_id) VALUES (%s, %s, %s, %s)
        ON CONFLICT ON CONSTRAINT bookings_unique_time_room DO UPDATE
            SET
                start_time = EXCLUDED.start_time,
                end_time = EXCLUDED.end_time,
                name = EXCLUDED.name
        """, [(b.name, b.start_time, b.end_time, b.room_id) for b in bookings])


def update_room_lat_lng_values(building_name, latitude, longitude):
    with get_db_cursor() as cursor:
        cursor.execute("""update room set latitude = %s, longitude = %s where building = %s""", [
                       latitude, longitude, building_name])


def delete_all_room():
    with get_db_cursor() as cursor:
        cursor.execute("""delete from room *""")


def get_all_rooms() -> List[Room]:
    with get_db_cursor() as cursor:
        cursor.execute("""select * from room""")
        raw = cursor.fetchall()
        return [Room(**r) for r in raw]


def get_all_rooms_in_building(building_name):
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from room where building = %s""", [building_name])
        return cursor.fetchall()


def insert_rooms(row):
    with get_db_cursor() as cursor:
        cursor.execute("""insert into room
            (name, building, area, region, floor, room_number, capacity, room_type)
            values 
            (%s, %s, %s, %s, %s, %s, %s, %s)""",
                       [row['name'], row['building'], row['area'], row['region'], row['floor'], row['room_number'],
                           (row['seats'] if row['seats'].isnumeric() else None), row['room_type']]
                       )
