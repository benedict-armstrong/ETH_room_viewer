from db import get_db_cursor
import db
from datetime import datetime, timedelta
import os

if 'PGHOST' in os.environ:
    db.connect(
        server=os.environ['PGHOST'],
        database=os.environ['PGDATABASE'],
        user=os.environ['PGUSER'],
        password=os.environ['PGPASSWORD'],
        port=os.environ['PGPORT']
    )
else:
    db.connect(
        server="localhost",
        database="eth_rooms",
        user="postgres",
        password="postgres",
        port="8001"
    )


def get_room_id_by_name(name):
    with get_db_cursor() as cursor:
        cursor.execute("""select id from rooms where name = %s""", [name])
        return cursor.fetchone()


def insert_map_data(width, height, points, room_id):
    with get_db_cursor() as cursor:
        cursor.execute("""insert into map_data (width, height, points, room_id) values (%s, %s, %s, %s)""",
                       [width, height, points, room_id])


def delete_all_past_bookings():
    with get_db_cursor() as cursor:
        cursor.execute("""delete from bookings where time < now()""")


def update_rooms_where_data_available():
    with get_db_cursor() as cursor:
        cursor.execute(
            """update rooms set room_data = true where id in (select room_id from bookings)""")


def insert_bookings_list(data):
    with get_db_cursor() as cursor:
        records_list_template = ','.join(['%s'] * len(data))
        insert_query = """
        INSERT INTO bookings (name, time, room_id) VALUES {}
        ON CONFLICT ON CONSTRAINT bookings_unique_time_room 
        DO UPDATE 
            SET 
                time = EXCLUDED.time,
                name = EXCLUDED.name
        """.format(
            records_list_template)
        cursor.execute(insert_query, data)


def update_room_lat_lng_values(building_name, latitude, longitude):
    with get_db_cursor() as cursor:
        cursor.execute("""update rooms set latitude = %s, longitude = %s where building = %s""", [
                       latitude, longitude, building_name])


def delete_all_room():
    with get_db_cursor() as cursor:
        cursor.execute("""delete from rooms *""")


def get_all_rooms():
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms""")
        return cursor.fetchall()


def get_all_rooms_in_building(building_name):
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from rooms where building = %s""", [building_name])
        return cursor.fetchall()


def insert_rooms(row):
    with get_db_cursor() as cursor:
        cursor.execute("""insert into rooms 
            (name, building, area, region, floor, room_number, capacity, room_type)
            values 
            (%s, %s, %s, %s, %s, %s, %s, %s)""",
                       [row['name'], row['building'], row['area'], row['region'], row['floor'], row['room_number'],
                           (row['seats'] if row['seats'].isnumeric() else None), row['room_type']]
                       )


def hour_rounder(t):
    return t.replace(second=0, microsecond=0, minute=0, hour=t.hour)


def get_free_rooms_by_datetime(datetime: datetime):
    datetime = hour_rounder(datetime)
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from rooms where id not in (select room_id from bookings where time = %s)""", [datetime])
        return cursor.fetchall()


def get_free_rooms_by_datetime_and_building(datetime: datetime, building: str):
    datetime = hour_rounder(datetime)
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from rooms where id not in (select room_id from bookings where time = %s) and building = %s""", [datetime, building])
        return cursor.fetchall()


def get_rooms_by_datetime_and_free_until(start: datetime, end: datetime):
    start = hour_rounder(start)
    end = hour_rounder(end)
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from rooms where id not in (select room_id from bookings where time between %s and %s)""", [start, end])
        return cursor.fetchall()


def get_rooms_by_datetime_and_free_until_and_building(start: datetime, end: datetime, building: str):
    start = hour_rounder(start)
    end = hour_rounder(end)
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from rooms where id not in (select room_id from bookings where time between %s and %s) and building = %s""", [start, end, building])
        return cursor.fetchall()


def get_next_booking_for_room(datetime: datetime, room_id: int):
    with get_db_cursor() as cursor:
        cursor.execute(
            """select * from bookings where room_id = %s and time > %s order by time asc limit 1""", [room_id, datetime])
        return cursor.fetchone()


def get_rooms_by_datetime_and_free_until_and_building_and_roomtype(start: datetime, end: datetime, building: str, room_type: str):
    start = hour_rounder(start)
    end = hour_rounder(end)
    with get_db_cursor() as cursor:
        cursor.execute("""select * from rooms where id not in (select room_id from bookings where time between %s and %s) and building = %s and room_type = %s""",
                       [start, end, building, room_type])
        return cursor.fetchall()


def get_all_rooms_no_time(building, room_type, area, capacity, floor):
    return get_all_rooms(building, datetime.now(), datetime.now() + timedelta(hours=24), room_type, area, capacity, floor)


def get_all_rooms_filters(building, start, end, room_type, area, capacity, floor):
    start = hour_rounder(start)
    end = hour_rounder(end)
    statement = """select * from rooms where id not in (select room_id from bookings where time between %s and %s)"""
    data = [start, end]
    if building:
        statement += """and building = %s """
        data.append(building)
    if room_type:
        statement += """and room_type = %s """
        data.append(room_type)
    if area:
        statement += """and area = %s """
        data.append(area)
    if capacity:
        statement += """and capacity >= %s """
        data.append(capacity)
    if floor:
        statement += """and floor = %s """
        data.append(floor)
    with get_db_cursor() as cursor:
        cursor.execute(statement, data)
        return cursor.fetchall()
