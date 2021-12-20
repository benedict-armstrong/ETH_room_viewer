FROM python

COPY requirements.txt /requirements.txt

RUN ["pip", "install", "-r", "requirements.txt"]
RUN apt-get update
RUN apt-get install -y locales locales-all

COPY dev/*.py /

CMD python server.py

EXPOSE 5000