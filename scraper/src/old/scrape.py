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


def extract_data_day(d: date,  r1: requests.Request, rooms):
    for room in rooms:
        # if room["id"] != 1:
        #     continue
        # else:
        #     print("Scraping room {}".format(room["name"]))

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

        r2 = requests.get(
            f"https://www.rauminfo.ethz.ch/RauminfoPre.do?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}",
            cookies=r1.cookies,
        )

        r3 = requests.post(
            'https://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
            cookies=r2.cookies,
            data=params,
            headers={
                "referer": f"https://www.rauminfo.ethz.ch/RauminfoPre.do?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}"
            }
        )

        if r3.status_code != 200:
            print("Error in rauminfo")
            print(r3.text, file=open("error.html", "w"))
            return

        if r3.text.find("Fehler in der Applikation rauminfo aufgetreten.") != -1:
            print("Error in rauminfo")
            print(r3.text, file=open("error.html", "w"))
            return

        # print(r3.text, file=open("test.html", "w"))
        extractData(r3.text, d, room["id"])
        # break


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--date', type=mkdate, default=date.today(),
                        help='Date to scrape format: dd/mm/yyyy)')
    args = parser.parse_args()

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
