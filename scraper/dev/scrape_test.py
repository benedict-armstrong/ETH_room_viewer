import requests
from datetime import date

r1 = requests.get('http://www.rauminfo.ethz.ch/IndexPre.do')

params = {
    "region": "Z",
    "areal": "Z",
    "gebaeude": "ETZ",
    "geschoss": "D",
    "raumNr": "61.2",
    "rektoratInListe": "true",
    "raumInRaumgruppe": "true",
    "tag": "22",
    "monat": "Dez",
    "jahr": "2021",
    "checkUsage": "anzeigen",
}

r3 = requests.post(
    'http://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
    cookies=r1.cookies,
    data=params,
)

print(r3.text)
