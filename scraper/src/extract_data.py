from datetime import date
import datetime
import sys
import requests
from bs4 import BeautifulSoup
import pandas as pd
from dao import insert_bookings_list


def insert_col(col, date: date, room_id):

    col.dropna(inplace=True)

    col.index = col.index.map(lambda t: t.replace(
        year=date.year, month=date.month, day=date.day))

    if len(col) == 0:
        return

    data = list(zip(col, col.index, [room_id]*len(col)))

    insert_bookings_list(data)


def set_date(year, s):
    if isinstance(s, str):
        return "{}.{}".format(s[-5:], year)
    else:
        return 'time'


def extractData(html: str, date: date, room_id: int):

    # get table from html string
    # with open("out.html") as fp:
    soup = BeautifulSoup(html, 'html.parser')

    # x = soup.findAll(
    #     text="Es steht keine Belegungsinformation zur Verfügung, denn der Raum wird nicht vom Rektorat verwaltet.")

    # print(x)

    # if len(x) > 0:

    try:
        table = soup.findAll('table')[1]

        # read table into df
        df = pd.read_html(table.prettify())[0].iloc[::4, :].drop(columns=[1])

        print(df)

        # set columns to dates
        df.columns = df.iloc[0]
        df = df[1:]

        # set date (including year) for each day or 'time' (first column) as column header
        df.rename(columns=lambda x: set_date(
            year=date.year, s=x), inplace=True)

        # format time and set as index
        df['time'] = df['time'].apply(
            lambda x: "{}:00".format(x.split('-')[0].format()))
        df.set_index('time', inplace=True)
        df.index = pd.to_datetime(df.index)

        # print(df)

        # insert data into db by column
        for day in df.columns:
            # drop all lines with empty strings
            insert_col(df[day].dropna(), datetime.datetime.strptime(
                day, '%d.%m.%Y'), room_id)
    except Exception as e:
        cc = requests.get(
            'https://control-center.armstrongconsulting.com/api/agent/ETH_ROOMS_TOOL/9370db48-5b7b-4cb1-970a-f570c27a08e2/fail')
        if (cc.status_code != 200):
            print("Error reporting to Control Center: {}".format(cc.status_code))
        print("Error {} for: {}, {}".format(e, date, room_id))
        print('\n')

#extractData("", date=date.today(), room_id=25)
