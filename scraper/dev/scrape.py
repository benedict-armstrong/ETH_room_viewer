import datetime
import requests
from extract_data import extractData
from datetime import date
from dao import get_all_rooms
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
parser.add_argument('date', type=mkdate)
args = parser.parse_args()

r1 = requests.get('http://www.rauminfo.ethz.ch/IndexPre.do')

rooms = get_all_rooms()

date = args.date

for room in rooms:
    params = {
        "region": room["region"],
        "areal": room["area"],
        "gebaeude": room["building"],
        "geschoss": room["floor"],
        "raumNr": room["room_number"],
        "rektoratInListe": "true",
        "raumInRaumgruppe": "true",
        "tag": date.day,
        "monat": get_month(date),
        "jahr": date.year,
        "checkUsage": "anzeigen"
    }

    r2 = requests.post(
        'http://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
        cookies=r1.cookies,
        data=params,
    )

    extractData(r2.text, date, room["id"])
