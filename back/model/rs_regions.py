from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON

Base = declarative_base()

#Частичная выгрузка московских районов из кладр
class Region(Base):
    __tablename__ = 'rs_regions'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    code = Column(String)
    c4 = Column(String)
    c5 = Column(String)
    c6 = Column(String)
    c7 = Column(String)
    c8 = Column(String)

