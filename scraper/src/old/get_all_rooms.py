from bs4 import BeautifulSoup
import pandas as pd
import requests
import re
from dao import insert_rooms, update_room_type_where_name


r1 = requests.get('http://www.rauminfo.ethz.ch/IndexPre.do')

soup = BeautifulSoup(r1.text, 'html.parser')

table = soup.find_all("h3", string=re.compile(
    r'Übersichtsliste.*'))[0].find_next('table')

df = pd.read_html(table.prettify())[0]

df.columns = df.iloc[0]
df = df[1:]
df = df.dropna(axis='columns')

cols = df.columns.values.tolist()
cols[-1] = 'Sitzplätze'
cols[-2] = 'Raumtyp'
df.columns = cols

df.rename({
    "ID": "name",
    "Region": "region",
    "Areal": "area",
    "Geb.": "building",
    "Ges.": "floor",
    "Raum": "room_number",
    "Raumtyp": "room_type",
    "Sitzplätze": "seats"},
    inplace=True, axis='columns')
df["name"].replace("»  ", "", regex=True, inplace=True)

print(df)

for index, row in df.iterrows():
    # insert_rooms(row)
    update_room_type_where_name(row)
