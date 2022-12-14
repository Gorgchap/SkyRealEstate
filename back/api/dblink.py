from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


def db_connect():
    return Mydb.connect

def db_session():
    return Mydb.bdsession

def db_engine():
    return Mydb.engine

class Db:
    def __init__(self):
        self.cstring = 'mysql+pymysql://admin_skygame:321321@185.221.152.242/admin_skygame'
        self.engine = create_engine(self.cstring, pool_recycle=120, pool_pre_ping=True, connect_args={'connect_timeout': 10000})
        self.bdsession = sessionmaker(bind=self.engine, autocommit=True, autoflush=False)()
        self.connect = self.engine.connect()



Mydb = Db()





