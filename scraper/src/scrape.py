import argparse
from datetime import date, datetime, timedelta
import logging
import time
from typing import Iterable, List
import locale

import requests

from models import Room
from extract_data import extractData
from models import Booking
from dao import update_rooms_where_data_available, delete_all_past_bookings, get_all_rooms, insert_bookings_list
from settings import settings

__LOGGER__ = logging.getLogger(__name__)


def mkdate(datestr) -> date:
    try:
        return datetime.strptime(datestr, '%d/%m/%Y')
    except ValueError:
        raise argparse.ArgumentTypeError(
            datestr + ' is not a proper date string (Expected: dd/mm/yyyy)')


def get_month(d: date):
    locale.setlocale(locale.LC_TIME, 'de_DE.UTF-8')
    return d.strftime("%b")


def scrape_rauminfo(date: date, rooms: Iterable[Room], cookies: dict = None):
    """
    Scrape rauminfo for a given date and room.

    :param date: Date in week to scrape 
    :param rooms: Rooms to scrape
    :param cookies: Cookies to use for scraping
    """

    # Set cookies if not provided
    if cookies is None:
        cookies = {}
        r1 = requests.get(settings.RAUMINFO_BASE_URL)
        cookies.update(r1.cookies)

    for room in rooms:
        # if room.id != 1:
        #     continue
        # else:
        #     print("Scraping room {}".format(room.name))

        # Post request params for rauminfo
        params = {
            "region": room.region[0],
            "areal": room.area[0],
            "gebaeude": room.building,
            "geschoss": room.floor,
            "raumNr": room.room_number,
            "rektoratInListe": "true",
            "raumInRaumgruppe": "true",
            "tag": str(date.day),
            "monat": get_month(date),
            "jahr": str(date.year),
            "checkUsage": "anzeigen"
        }

        # This order of requests is important (found out by trial and error)
        r2 = requests.get(
            f"{settings.RAUMINFO_R2_URL}?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}",
            cookies=r1.cookies,
        )

        r3 = requests.post(
            settings.RAUMINFO_R3_URL,
            cookies=r2.cookies,
            data=params,
            headers={
                "referer": f"{settings.RAUMINFO_R2_URL}?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}"
            }
        )

        print(r3.text, file=open("test.html", "w"))
        if r3.status_code != 200:
            __LOGGER__.error(
                f"r3 failed: {r3.status_code} {r3.text} (room: {room}))")
            continue

        if r3.text.find("Fehler in der Applikation rauminfo aufgetreten.") != -1:
            __LOGGER__.warning(
                f"r3 failed: Hit Rauminfo error page (room: {room})")
            continue

        if r3.text.find("Übersichtsliste") != -1:
            __LOGGER__.warning(
                f"r3 failed (room: {room})")
            print(r3.text, file=open("test.html", "w"))
            continue

        insert_bookings_list(extractData(r3.text, date, room.id))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--date', type=mkdate, default=date.today(),
                        help='Date to scrape format: dd/mm/yyyy)')
    args = parser.parse_args()

    start_time = time.time()

    delete_all_past_bookings()

    rooms = get_all_rooms()

    date_to_scrape: date = args.date

    try:
        scrape_rauminfo(date_to_scrape, rooms)

        # if date is a friday run program for monday of next week too
        if date_to_scrape.weekday() == 4:
            monday = date_to_scrape + timedelta(days=3)
            scrape_rauminfo(monday, rooms)

        update_rooms_where_data_available()
    except Exception as e:
        cc = requests.get(settings.CC_FAIL_URL)
        if (cc.status_code != 200):
            __LOGGER__.error(
                "Error reporting to Control Center: {}".format(cc.status_code))
        __LOGGER__.error("Error: {} | exec time: {}s".format(
            e, (time.time() - start_time)))
    else:
        cc = requests.get(settings.CC_OK_URL)
        if (cc.status_code != 200):
            __LOGGER__.error(
                "Error reporting to Control Center: {}".format(cc.status_code))
        __LOGGER__.info("Done {} in {}s".format(datetime.now().strftime(
            "%d.%m.%Y %H:%M:%S"), (time.time() - start_time)))

    delete_all_past_bookings()
