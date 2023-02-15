
from typing import List
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, date

from models import Booking


def set_date(date: datetime, s):
    """
    Return date in format 'dd.mm.yyyy' or 'time' if s is not a string
    s is a string in format '... dd.mm'
    """

    if isinstance(s, str):
        if (date.month == 12 and s[-2:] == '01'):
            return "{}.{}".format(s[-5:], date.year + 1)

        return "{}.{}".format(s[-5:], date.year)
    else:
        return 'time'


def extractData(html: str, date: date, room_id: int) -> List[Booking]:
    """
    Extract data from html string and return a list of Bookings

    html: html string
    date: date of monday of the week to extract
    room_id: id of the room to extract
    """

    # monday = date - timedelta(days=date.weekday())

    soup = BeautifulSoup(html, 'html.parser')
    table = soup.findAll('table')[1]

    df = pd.read_html(table.prettify())[0]

    df.iloc[:, 0] = df.iloc[:, 0].str.split('-').str[0]
    df[df.columns[0]] = pd.to_datetime(df.iloc[:, 0], format='%H')

    # add 0, 15, 30, 45 minutes to the hour (repeat every 4 rows)
    df.iloc[2::4, 0] = df.iloc[2::4, 0] + pd.Timedelta(minutes=15)
    df.iloc[3::4, 0] = df.iloc[3::4, 0] + pd.Timedelta(minutes=30)
    df.iloc[4::4, 0] = df.iloc[4::4, 0] + pd.Timedelta(minutes=45)

    # drop column 1
    df = df.drop(df.columns[1], axis=1)

    # set columns to dates
    df.columns = df.iloc[0]
    df = df[1:]
    df.rename(columns=lambda col: set_date(date=date, s=col), inplace=True)

    # set index to time
    df.index = df["time"]
    df = df.drop(df.columns[0], axis=1)

    df.columns = pd.to_datetime(df.columns, format='%d.%m.%Y')

    booking_list: List[Booking] = []

    for day in df.columns:
        # drop all lines with empty strings
        lectures_on_day = df[day].dropna()
        lectures_on_day.index = lectures_on_day.index.map(
            lambda t: datetime.combine(day, t.time()))
        # print(lectures_on_day)

        if len(lectures_on_day) > 0:
            # iterate over lectures and combine them if they have the same name keeping track of duration and start time
            prev_name = ''
            start_time = datetime.now()
            duration = timedelta()

            for time, name in lectures_on_day.items():
                # print(time, name)
                if name == prev_name:
                    duration += timedelta(minutes=15)
                else:
                    if prev_name != '':
                        # print(prev_name, duration, start_time)
                        booking_list.append(
                            Booking(
                                room_id=room_id,
                                start_time=start_time,
                                end_time=start_time + duration,
                                name=prev_name
                            )
                        )
                    prev_name = name
                    start_time = time
                    duration = timedelta(minutes=15)

            # add last lecture
            # print(prev_name, duration, start_time)
            booking_list.append(
                Booking(
                    room_id=room_id,
                    start_time=start_time,
                    end_time=start_time + duration,
                    name=prev_name
                )
            )

    return booking_list
