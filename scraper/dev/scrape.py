import datetime
import requests
from extract_data import extractData
from datetime import date
from dao import get_all_rooms, delete_all_past_bookings
import locale
import argparse
import time


def mkdate(datestr) -> date:
    try:
        return datetime.datetime.strptime(datestr, '%d/%m/%Y')
    except ValueError:
        raise argparse.ArgumentTypeError(
            datestr + ' is not a proper date string (Expected: dd/mm/yyyy)')


def get_month(d: date):
    locale.setlocale(locale.LC_TIME, 'de_DE.UTF-8')
    return d.strftime("%b")


parser = argparse.ArgumentParser()
parser.add_argument('-d', '--date', type=mkdate, default=date.today(),
                    help='Date to scrape format: dd/mm/yyyy)')
args = parser.parse_args()


def extract_data_day(d: date,  r1, rooms):
    for room in rooms:
        params = {
            "region": room["region"],
            "areal": room["area"],
            "gebaeude": room["building"],
            "geschoss": room["floor"],
            "raumNr": room["room_number"],
            "rektoratInListe": "true",
            "raumInRaumgruppe": "true",
            "tag": d.day,
            "monat": get_month(d),
            "jahr": d.year,
            "checkUsage": "anzeigen"
        }

        r2 = requests.post(
            'http://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
            cookies=r1.cookies,
            data=params,
        )

        extractData(r2.text, d, room["id"])


start_time = time.time()

delete_all_past_bookings()

r1 = requests.get('http://www.rauminfo.ethz.ch/IndexPre.do')

rooms = get_all_rooms()

date_to_scrape: date = args.date

try:
    extract_data_day(date_to_scrape, r1, rooms)

    # if date is a friday run program for monday of next week
    if date_to_scrape.weekday() == 4:
        monday = date_to_scrape + datetime.timedelta(days=3)
        extract_data_day(monday, r1, rooms)
except Exception as e:
    print("Error: {} | {}s".format(e, (time.time() - start_time)))
else:
    print("Done {} in {}s".format(datetime.datetime.now().strftime(
        "%d.%m.%Y %H:%M:%S"), (time.time() - start_time)))

delete_all_past_bookings()
