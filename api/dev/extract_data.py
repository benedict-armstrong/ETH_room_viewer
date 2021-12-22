from datetime import date
import datetime
from bs4 import BeautifulSoup
import pandas as pd
from dao import insert_bookings_list

def insert_col(col, date: date, room_id):

    col.dropna(inplace=True)

    col.index = col.index.map(lambda t: t.replace(year=date.year, month=date.month, day=date.day))

    if len(col) == 0: 
        return

    data = list(zip(col,col.index, [room_id]*len(col)))

    insert_bookings_list(data)


def set_date(year, s):
    if isinstance(s, str):
        return "{}.{}".format(s[-5:], year)
    else:
        return 'time'

def extractData(html: str, date: date, room_id: int):

    # get table from html string
    #with open("out.html") as fp:
    soup = BeautifulSoup(html, 'html.parser')

    try:
        table = soup.findAll('table')[1]

        # read table into df
        df = pd.read_html(table.prettify())[0].iloc[::4, :].drop(columns=[1])

        # set columns to dates
        df.columns = df.iloc[0]
        df = df[1:]

        # set date (inkluding year) for each day or 'time' (first column) as column header
        df.rename(columns= lambda x: set_date(year=date.year, s=x), inplace=True)

        # format time and set as index
        df['time'] = df['time'].apply(lambda x: "{}:00".format(x.split('-')[0].format()))
        df.set_index('time', inplace=True)
        df.index = pd.to_datetime(df.index)

        #print(df)

        # insert data into db by column
        for day in df.columns:
            # drop all lines with empty strings
            insert_col(df[day].dropna(), datetime.datetime.strptime(day, '%d.%m.%Y'), room_id)
    except:
        print("Error for: {}, {}".format(date, room_id))
        print('\n')

#extractData("", date=date.today(), 0)