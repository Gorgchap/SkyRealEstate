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

        if len(idfiles) == 0:
            return jsonify("")

        sql = "select * from rs_benchmarks WHERE files_id in :idfiles"
        rs = db_session().execute(sql, {'idfiles': idfiles})
        df = pd.DataFrame(rs.fetchall())

        qry = ""

        daddress = jsonData['address']
        dsquare = jsonData['square']
        drooms = jsonData['rooms']
        dsegment = jsonData['segment']
        ddistance = jsonData['distance']
        dmaterial = jsonData['material']

        if daddress != "":
            qry = qry + "address == " + daddress

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
            df_as_json = dfr.to_dict(orient='index')
            return jsonify(df_as_json)

        df_as_json = df.to_dict(orient='index')
        return jsonify(df_as_json)

class Analogues(ResFree):
    def post(self):
        jsonData = request.get_json()

        idbuild = []
        for row in jsonData:
            idbuild.append(row)

        sql = "select * from rs_benchmarks WHERE bid in :idbuild"
        rs = db_session().execute(sql, {'idbuild': idbuild})
        df = pd.DataFrame(rs.fetchall())

        arr_rooms = []
        arr_square = []
        arr_segment = []
        arr_distance = []
        arr_material = []

        for i, row in df.iterrows():
            arr_rooms.append(row['square'])
            arr_square.append(row['rooms'])
            arr_segment.append(row['segment'])
            arr_distance.append(row['to_metro'])
            arr_material.append(row['wall_mat'])


        df_as_json = df.to_dict(orient='index')
        return jsonify(df_as_json)
