from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON, Float

Base = declarative_base()

#Частичная выгрузка московских районов из кладр
class Flat(Base):
    __tablename__ = 'rs_flats'
    id = Column(Integer, primary_key=True)
    bld_id = Column(Integer)
    rooms = Column(Integer)
    floor = Column(Integer)
    square = Column(Float)
    kit_square = Column(Float)
    balkon = Column(Integer)
    to_metro = Column(Integer)
    condition = Column(String)


