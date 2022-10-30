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

