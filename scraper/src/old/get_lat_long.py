# Read line from file one by one and query google maps api to get latitude and longitude, save back to file seprated by ';
import requests
import json
import csv

from dao import update_room_lat_lng_values

with open('locations.csv', newline='\n', encoding='utf-8') as csvfile:
    csv_reader = csv.reader(csvfile, delimiter=';')
    for row in csv_reader:
        # address = row[1]
        # r = requests.get(
        #     'https://maps.googleapis.com/maps/api/geocode/json?address={}&key='.format(address))
        # data = json.loads(r.text)
        # if data['status'] == 'OK':
        #     latitude = data['results'][0]['geometry']['location']['lat']
        #     longitude = data['results'][0]['geometry']['location']['lng']
        # save lat and long to rooms_table
        #print('{};{};{};{}'.format(row[0], row[1], latitude, longitude))
        update_room_lat_lng_values(row[0], row[2], row[3])
