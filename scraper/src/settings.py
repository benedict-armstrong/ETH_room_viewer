import os


class SETTINGS:
    RAUMINFO_BASE_URL = "https://www.rauminfo.ethz.ch/IndexPre.do"
    RAUMINFO_R2_URL = "https://www.rauminfo.ethz.ch/RauminfoPre.do"
    RAUMINFO_R3_URL = 'https://www.rauminfo.ethz.ch/Rauminfo/Rauminfo.do'

    PGHOST = os.getenv('PGHOST', 'localhost')
    PGDATABASE = os.getenv('PGDATABASE', 'eth_rooms')
    PGUSER = os.getenv('PGUSER', 'postgres')
    PGPASSWORD = os.getenv('PGPASSWORD', 'postgres')
    PGPORT = os.getenv('PGPORT', '8001')

    CC_BASE_URL = 'https://control-center.armstrongconsulting.com/api/agent/ETH_ROOMS_TOOL/9370db48-5b7b-4cb1-970a-f570c27a08e2'
    CC_FAIL_URL = f'{CC_BASE_URL}/fail'
    CC_OK_URL = f'{CC_BASE_URL}/ok'


settings = SETTINGS()
