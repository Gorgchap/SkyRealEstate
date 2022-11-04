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
    size = Column(Integer)
    type = Column(String)
    user_id = Column(Integer)

    def __init__(self, name="", path="", date="", size=0, type="", user_id=0):
        self.date = date
        self.name = name
        self.path = path
        self.size = size
        self.type = type
        self.user_id = user_id

files = Files()