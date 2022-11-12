from contextlib import contextmanager
from psycopg2.pool import ThreadedConnectionPool, PoolError
import psycopg2.extras
import time
import logging

_pool = None
psycopg2.extras.register_uuid()


class NoDatabaseConnectionAvailable(Exception):
    pass


def connect(server, database, user, password, port):
    global _pool
    _pool = ThreadedConnectionPool(
        1, 50, host=server, database=database, user=user, password=password, port=port)


@contextmanager
def get_db_connection():
    connection = None
    tries = 0
    if len(_pool._used) > 10:
        logging.warn("connection pool: %d" % len(_pool._used))
    while (not connection) and (tries < 100):
        try:
            connection = _pool.getconn()
            yield connection
        except PoolError:
            logging.warn(
                "Connection pool is exhausted, suspending calling thread for 1ms before trying to get a connection again (tries=%d)" % tries)
            tries += 1
            time.sleep(0.001)
        finally:
            if connection:
                _pool.putconn(connection)
    if (not connection):
        raise NoDatabaseConnectionAvailable(
            "Timed out waiting for a database connection to become available")


@contextmanager
def get_db_cursor(commit=True):
    with get_db_connection() as connection:
        cursor = connection.cursor(
            cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            yield cursor
            if commit:
                connection.commit()
        finally:
            cursor.close()
