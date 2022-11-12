import datetime
import requests
from extract_data import extractData
from datetime import date
from dao import get_all_rooms, delete_all_past_bookings, update_rooms_where_data_available
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
        r3 = requests.get(
            "https://www.rauminfo.ethz.ch/RauminfoPre.do?region={region}&areal={areal}&gebaeude={building}&geschoss={floor}&raumNr={room_number}".format(
                region= "Z",
                areal="Z",
                building= "CAB",
                floor="G",
                room_number= "11",
            )
        )

        # print("RISESSIONID=", r3.cookies["RISESSIONID"])
        print(r3.cookies)
        r3.cookies.clear()
        r3.cookies.set("RISESSIONID", "62wk5Ig7nzOudw6mIezokANw7kYLbNXIp_-NG0bmD5PUIdis999N!692446820", domain="www.rauminfo.ethz.ch")
        print(r3.cookies)

        params = {
            "region": "Z",
            "areal": "Z",
            "gebaeude": "CAB",
            "geschoss": "G",
            "raumNr": "11",
            "rektoratInListe": "true",
            "raumInRaumgruppe": "true",
            "tag": 29,
            "monat": "Okt",
            "jahr": 2022,
            "checkUsage": "anzeigen"
        }


        r2 = requests.post(
            'https://www.rauminfo.ethz.ch/Rauminfo/Belegungen.jsp',
            cookies=r3.cookies
        )

        if (r2.text.find("Fehler in der Applikation rauminfo aufgetreten.") != -1):
            print("Error in rauminfo")
            return

        extractData(r2.text, d, room["id"])
        break


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
    update_rooms_where_data_available()
except Exception as e:
    cc = requests.get(
        'https://control-center.armstrongconsulting.com/api/agent/ETH_ROOMS_TOOL/9370db48-5b7b-4cb1-970a-f570c27a08e2/fail')
    if (cc.status_code != 200):
        print("Error reporting to Control Center: {}".format(cc.status_code))
    print("Error: {} | {}s".format(e, (time.time() - start_time)))
else:
    cc = requests.get(
        'https://control-center.armstrongconsulting.com/api/agent/ETH_ROOMS_TOOL/9370db48-5b7b-4cb1-970a-f570c27a08e2/ok')
    if (cc.status_code != 200):
        print("Error reporting to Control Center: {}".format(cc.status_code))
    print("Done {} in {}s".format(datetime.datetime.now().strftime(
        "%d.%m.%Y %H:%M:%S"), (time.time() - start_time)))

delete_all_past_bookings()
