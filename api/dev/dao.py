from typing import Tuple
from db import get_db_cursor
import db
from datetime import datetime
import os

db.connect(
    server=os.environ['DB_SERVER'], 
    database=os.environ['DB_NAME'], 
    user=os.environ['DB_USER'], 
    password=os.environ['DB_PASSWORD']
)

def insert_bookings_list(data):
    with get_db_cursor() as cursor:
        records_list_template = ','.join(['%s'] * len(data))
        insert_query = 'insert into bookings (name, time, room_id) values {}'.format(records_list_template)
        cursor.execute(insert_query, data)

def delete_all_room():
    with get_db_cursor() as cursor:
        cursor.execute("""delete from rooms *""")

def get_all_rooms():
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms""")
        return cursor.fetchall()

def insert_rooms(row):
    with get_db_cursor() as cursor:
        cursor.execute("""insert into rooms 
            (name, building, area, region, floor, room_number, capacity, room_type)
            values 
            (%s, %s, %s, %s, %s, %s, %s, %s)""", 
            [row['name'], row['building'], row['area'], row['region'], row['floor'], row['room_number'], (row['seats'] if row['seats'].isnumeric() else None), row['room_type']]
        )

def hour_rounder(t):
    return t.replace(second=0, microsecond=0, minute=0, hour=t.hour)


def get_free_rooms_by_datetime(datetime: datetime):
    datetime = hour_rounder(datetime)
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms where id not in (select room_id from bookings where time = %s)""", [datetime])
        return cursor.fetchall()

def get_free_rooms_by_datetime_and_building(datetime: datetime, building: str):
    datetime = hour_rounder(datetime)
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms where id not in (select room_id from bookings where time = %s) and building = %s""", [datetime, building])
        return cursor.fetchall()

def get_rooms_by_datetime_and_free_until(start: datetime, end: datetime):
    start = hour_rounder(start)
    end = hour_rounder(end)
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms where id not in (select room_id from bookings where time between %s and %s)""", [start, end])
        return cursor.fetchall()

def get_rooms_by_datetime_and_free_until_and_building(start: datetime, end: datetime, building: str):
    start = hour_rounder(start)
    end = hour_rounder(end)
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms where id not in (select room_id from bookings where time between %s and %s) and building = %s""", [start, end, building])
        return cursor.fetchall()

def get_next_booking_for_room(datetime: datetime, room_id: int):
    with get_db_cursor() as cursor:
        cursor.execute("""select * from bookings where room_id = %s and time > %s order by time asc limit 1""", [room_id, datetime])
        return cursor.fetchone()

def get_rooms_by_datetime_and_free_until_and_building_and_roomtype(start: datetime, end: datetime, building: str, room_type: str):
    start = hour_rounder(start)
    end = hour_rounder(end)
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms where id not in (select room_id from bookings where time between %s and %s) and building = %s and room_type = %s""", [start, end, building, room_type])
        return cursor.fetchall()