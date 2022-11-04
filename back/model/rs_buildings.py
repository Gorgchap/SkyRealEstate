from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON

Base = declarative_base()

#Частичная выгрузка московских районов из кладр
class Building(Base):
    __tablename__ = 'rs_buildings'
    id = Column(Integer, primary_key=True)
    kladr_code = Column(String)
    reg_id = Column(Integer)
    address = Column(String)
    wall_mat = Column(String)
    segment = Column(String)
    floors = Column(Integer)
    files_id = Column(Integer)

    def __init__(self, kladr_code="", reg_id="", address="", wall_mat="", segment="", floors="", files_id=""):
        self.kladr_code = kladr_code
        self.reg_id = reg_id
        self.address = address
        self.wall_mat = wall_mat
        self.segment = segment
        self.floors = floors
        self.files_id = files_id


