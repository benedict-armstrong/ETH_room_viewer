from dataclasses import dataclass
import requests


@dataclass
class Room:
    region: str
    areal: str
    gebaeude: str
    geschoss: str
    raumNr: str
    rektoratInListe: str = "true"
    raumInRaumgruppe: str = "true"


r1 = requests.get('https://www.rauminfo.ethz.ch/IndexPre.do')

if r1.status_code != 200:
    print(f"Error in r1: {r1.status_code}")
    exit(1)

print("cookies:", r1.cookies.items())


params = {
    "region": "Z",
    "areal": "H",
    "gebaeude": "HIL",
    "geschoss": "H",
    "raumNr": "40.9",
    "rektoratInListe": "true",
    "raumInRaumgruppe": "true",
    "tag": "31",
    "monat": "Jan",
    "jahr": "2023",
    "checkUsage": "anzeigen",
}

r2 = requests.get(
    f"https://www.rauminfo.ethz.ch/RauminfoPre.do?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}",
    cookies=r1.cookies,
)

if r2.status_code != 200:
    print(f"Error in r2: {r2.status_code}")
    exit(1)


r3 = requests.post(
    'https://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do',
    cookies=r2.cookies,
    data=params,
    headers={
        "referer": f"https://www.rauminfo.ethz.ch/RauminfoPre.do?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}"
    }
)

if r3.status_code != 200:
    print(f"Error in r3: {r3.status_code}")
    exit(1)

print(r3.text, file=open("room_occupancy.html", "w"))

# r2 = requests.get(
#     "https://www.rauminfo.ethz.ch/Rauminfo/Belegungen.jsp",
#     cookies=r1.cookies,
#     headers={
#         "referer": f"https://www.rauminfo.ethz.ch/RauminfoPre.do?region={params['region']}&areal={params['areal']}&gebaeude={params['gebaeude']}&geschoss={params['geschoss']}&raumNr={params['raumNr']}"
#     }
# )

# print(r2.status_code)


# if r2.text.find("Fehler in der Applikation rauminfo aufgetreten."):
#     print("Error in rauminfo")
# else:
#     with open("room_occupancy.html", "w") as f:
#         f.write(r2.text)


# def room_occupancy():
#     """
#     For a room and date fetches and returns the occupancy of a room in the week of the date
#     :param room:
#     :param date:
#     :param cache:
#     :return:
#     """

#     # post_data = {
#     #     "tag": "31",
#     #     "monat": "Jan",
#     #     "jahr": "2023",
#     #     "checkUsage": "anzeigen",
#     #     **asdict(room),
#     # }

#     post_data = {
#         "region": "Z",
#         "areal": "Z",
#         "gebaeude": "ETZ",
#         "geschoss": "D",
#         "raumNr": "61.2",
#         "rektoratInListe": "true",
#         "raumInRaumgruppe": "true",
#         "tag": "22",
#         "monat": "Dez",
#         "jahr": "2021",
#         "checkUsage": "anzeigen",
#     }

#     # fetch room occupancy
#     r = requests.post(
#         "http://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do", data=post_data
#     )
#     site = r.text
#     print(site, file=open("room_occupancy.html", "w"))


# room_occupancy()
