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
    files_id = Column(Integer)
    price = Column(Float)

    def __init__(self, bld_id="", rooms="", floor="", square="", kit_square="", balkon="", to_metro="", condition="",
                 files_id="", price=""):
        self.bld_id = bld_id
        self.rooms = rooms
        self.floor = floor
        self.square = square
        self.kit_square = kit_square
        self.balkon = balkon
        self.to_metro = to_metro
        self.condition = condition
        self.files_id = files_id
        self.price = price