import shutil
from time import sleep
import requests
from dao import get_all_rooms
from PIL import Image


rooms = get_all_rooms()

for room in rooms:
    if room['room_data']:
        url = "http://www.rauminfo.ethz.ch/grundrissplan.gif?region={}&areal={}&gebaeude={}&geschoss={}&raumNr={}".format(
            room["region"][0:1], room["area"][0:1], room["building"], room["floor"], room['room_number'])

        r = requests.get(url, stream=True)
        if r.status_code == 200:
            image_path = './floorplans/images/raw/{}_{}_{}_{}_{}.gif'.format(
                room["region"][0:1], room["area"][0:1], room["building"], room["floor"], room['room_number'])
            with open(image_path, 'wb') as f:
                r.raw.decode_content = True
                shutil.copyfileobj(r.raw, f)
        else:
            print("Error: {}".format(r.status_code))
            print(url)
    # to avoid request limit in rauminfo website
    sleep(0.3)
