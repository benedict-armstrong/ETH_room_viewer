FROM python

COPY requirements.txt /requirements.txt

RUN ["pip", "install", "-r", "requirements.txt"]
RUN apt-get update
RUN apt-get install -y locales locales-all

COPY src/*.py /
COPY src/locations.csv locations.csv 