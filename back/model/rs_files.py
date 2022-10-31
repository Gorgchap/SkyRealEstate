from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON, Float

Base = declarative_base()

#Частичная выгрузка московских районов из кладр
class Files(Base):
    __tablename__ = 'rs_files'
    id = Column(Integer, primary_key=True)
    date = Column(TIMESTAMP)
    name = Column(String)
    path = Column(String)

    def __init__(self, name="", path="", date=""):
        self.date = date
        self.name = name
        self.path = path
