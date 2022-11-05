from sqlalchemy.ext.declarative import declarative_base
from flask import make_response, jsonify, request, send_file
from flask_restful import Resource as ResFree
#from model import rs_files, rs_buildings, rs_flats, user
from api import db_session
import pandas as pd

Base = declarative_base()

class Benchmarks(ResFree):
    def post(self):
        jsonData = request.get_json()

        sql = "select id from rs_files order by id desc limit 5"
        rs = db_session().execute(sql)

        idfiles = []
        for row in rs:
            idfiles.append(row['id'])

        sql = "select * from rs_benchmarks WHERE files_id in :idfiles"
        rs = db_session().execute(sql, {'idfiles': idfiles})
        df = pd.DataFrame(rs.fetchall())

        qry = ""

        dadress = jsonData['adress']
        dsquare = jsonData['square']
        drooms = jsonData['rooms']
        dsegment = jsonData['segment']
        ddistance = jsonData['distance']
        dmaterial = jsonData['material']

        if dadress != "":
            qry = qry + "adress == " + dadress

        if dsquare != 0:
            if qry != "": qry = qry+" and "
            qry = qry + "square == " + dsquare

        if drooms > -1:
            if qry != "": qry = qry + " and "
            qry = qry + "rooms == " + drooms

        if dsegment != "":
            if qry != "": qry = qry + " and "
            qry = qry + "segments == " + dsegment

        if ddistance != 0:
            if qry != "": qry = qry + " and "
            qry = qry + "to_metro == " + ddistance

        if dmaterial != "":
            if qry != "": qry = qry + " and "
            qry = qry + "wall_mat == " + dmaterial

        if qry != "":
            dfr = df.query(qry)
            return dfr.to_json(orient='records')

        return df.to_json(orient='records')