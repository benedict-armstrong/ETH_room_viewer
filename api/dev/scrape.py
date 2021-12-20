import requests
from extract_data import extractData
from datetime import date
from dao import get_all_rooms
import locale

def get_month(d: date):
    locale.setlocale(locale.LC_TIME, 'de_DE.UTF-8')
    return d.strftime("%b")

r1 = requests.get('http://www.rauminfo.ethz.ch/IndexPre.do')

rooms = get_all_rooms()

today = date.today()

for room in rooms:
    params = {
        "region": room["region"],
        "areal": room["area"],
        "gebaeude": room["building"],
        "geschoss": room["floor"],
        "raumNr": room["room_number"],
        "rektoratInListe": "true",
        "raumInRaumgruppe": "true",
        "tag": today.day,
        "monat": get_month(today),
        "jahr": today.year,
        "checkUsage": "anzeigen",
    }

    r3 = requests.post(
        'http://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
        cookies = r1.cookies, 
        data = params,
    )

    extractData(r3.text, date.today(), room["id"])