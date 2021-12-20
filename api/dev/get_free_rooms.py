from dao import get_rooms_by_datetime_and_free_until_and_building_and_roomtype, get_next_booking_for_room
from datetime import datetime, timedelta

rooms_HG_free_until = get_rooms_by_datetime_and_free_until_and_building_and_roomtype(datetime.now(), datetime.now() + timedelta(hours=1), 'HG', 'Seminare / Kurse')

for room in rooms_HG_free_until:
    next = get_next_booking_for_room(datetime.now(), room["id"])
    print(room["name"] + '; ' + ("free until: {}".format(datetime.strftime(next['time'], "%H:%M") if next and next["time"].day == datetime.now().day else "(no more bookings today)")))
    #print('\n')