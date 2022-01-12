FROM postgres

# --build-arg db_name=<value>
# --build-arg db_password=<value>
ARG db_name=eth_rooms
ARG db_password=postgres

ENV POSTGRES_PASSWORD=$db_password
ENV POSTGRES_DB $db_name
COPY create.sql /docker-entrypoint-initdb.d/create.sql