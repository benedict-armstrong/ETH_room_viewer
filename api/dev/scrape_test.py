import requests
from extract_data import extractData
from datetime import date

r1 = requests.get('http://www.rauminfo.ethz.ch/IndexPre.do')

params = {
    "region": "Z",
	"areal": "Z",
	"gebaeude": "CHN",
	"geschoss": "E",
	"raumNr": "46",
	"rektoratInListe": "true",
	"raumInRaumgruppe": "true",
    "tag": "20",
    "monat": "Dez",
    "jahr": "2021",
    "checkUsage": "anzeigen",
}

r3 = requests.post(
    'http://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
    cookies = r1.cookies, 
    data = params,
)

extractData(r3.text, date.today(), 43)