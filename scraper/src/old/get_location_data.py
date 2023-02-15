import requests
import bs4
from dao import get_all_rooms

rooms = get_all_rooms()
buildings = []

count = 0

for room in rooms:
    if room["building"] not in buildings and count == 0:
        buildings.append(room["building"])
        print(room["building"])

print(len(buildings))
