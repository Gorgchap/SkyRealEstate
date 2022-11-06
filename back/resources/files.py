from sqlalchemy.ext.declarative import declarative_base
from flask import make_response, jsonify, request, send_file
from flask_restful import Resource as ResFree
from model import rs_files, rs_buildings, rs_flats, user
import base64
import pandas as pd
from api import db_session
import uuid
from decimal import Decimal
from yandex_geocoder import Client

ya_api_key = 'fcebe29e-908a-4101-9808-b634f1c025ad'

DIR_FILES = 'C:\\rs_files\\'
columns = ['address', 'rooms', 'segment', 'floors', 'wall_mat', 'floor', 'square', 'kit_square', 'balkon', 'to_metro',
           'condition']

Base = declarative_base()

class Upload(ResFree):
    def post(self):
        re = request.headers.environ['HTTP_AUTHORIZATION']
        rw = re.split(' ')
        if rw[0] != 'Bearer':
            return make_response(jsonify(message='No authorization'), 401)

        us = user.user.checkSession(rw[1])
        if us == None:
            return make_response(jsonify(message='No session'), 401)

        jsonData = request.get_json()

        try:
            sess = db_session()

            for fileData in jsonData:

                file_uid = str(uuid.uuid4())

                date = fileData['date']
                name = fileData['name']
                result = fileData['result']
                size = fileData['size']

                datafile = base64.decode(result)

                name_uid = file_uid+'_'+name

                with open(DIR_FILES+name_uid, 'wr') as file:
                    file.write(datafile)
                    rsf = rs_files.Files(name=name, path=DIR_FILES+name_uid, date=date, size=size, type="in",
                                         user_id=us.user_id)

                    sess.add(rsf)
                    sess.flush()

                    df = pd.read_excel(DIR_FILES+name_uid, header=None, names=columns)
                    df = df.dropna(how='any').reset_index(drop=True).iloc [1: , :]

                    df['segment'] = df.segment.str.lower()

                    segmap = {'новостройка':'new', 'современное жилье':'modern', 'старый жилой фонд':'old'}
                    df['segment'] = df['segment'].map(segmap)

                    colseg = df['segment'].nunique ()
                    if colseg > 3:
                        return make_response(jsonify({"error": "true", "message": "Invalid format xlsx"}), 401)

                    df['wall_mat'] = df.wall_mat.str.lower()

                    walmatmap = {'кирпич':'brick', 'панель':'panel', 'монолит':'monolith'}
                    df['wall_mat'] = df['wall_mat'].map(walmatmap)

                    colwal = df['wall_mat'].nunique()
                    if colwal > 3:
                        return make_response(jsonify({"error": "true", "message": "Invalid format xlsx"}), 401)

                    lat = 0
                    lon = 0
                    try:
                        client = Client(ya_api_key)
                        lon, lat = client.coordinates("Россия " + row['address'])
                        lon = Decimal(lon)
                        lat = Decimal(lat)

                    except:
                        pass

                    for i, row in df.iterrows():
                        build = rs_buildings.Building(address=row['address'], wall_mat=row['wall_mat'],
                                                      segment=row['segment'], floors=row['floors'], files_id=rsf.id,
                                                      lat=lat, lon=lon)
                        sess.add(build)
                        sess.flush()

                        flats = rs_flats.Flat(bld_id=build.id, rooms=row['rooms'], floor=row['floor'],
                                              square=row['square'], kit_square=row['kit_square'], balkon=row['balkon'],
                                              to_metro=row['to_metro'], condition=row['condition'], files_id=rsf.id)
                        sess.add(flats)
                        sess.flush()

            return make_response(jsonify({"message": "Successful"}), 202)
        except KeyError:
            return make_response(jsonify({"error": "true", "message": "Invalid format json"}), 401)
        except FileNotFoundError:
            return make_response(jsonify({"error": "true", "message": "File not found or wrong extension"}), 401)
    '''    
        else:
            return make_response(jsonify({"error": "true", "message": "File not found or wrong extension"}), 401)
    '''
    '''def verifyExt(self, filename):
        ext = filename.rsplit('.', 1)[1]
        if ext == "xls" or ext == "XLS" or ext == "xlsx" or ext == "XLSX":
            return True
    
        return False
    '''

class List(ResFree):
    def get(self):
        re = request.headers.environ['HTTP_AUTHORIZATION']
        rw = re.split(' ')
        if rw[0] != 'Bearer':
            return make_response(jsonify(message='No authorization'), 401)

        us = user.user.checkSession(rw[1])
        if us == None:
            return make_response(jsonify(message='No session'), 401)

        rargs = request.args
        last = rargs['last']

        sess = db_session()

        if last:
            sql = "select id, name, date, size from rs_files where user_id = :us_id order by id desc limit 5"
            rs = db_session().execute(sql, {'us_id': us.id})
            df = pd.DataFrame(rs.fetchall())
            return jsonify(df.to_json(orient='records'))

        else:
            sql = "select id, name, date, size from rs_files where user_id = :us_id order by id desc"
            rs = db_session().execute(sql, {'us_id': us.id})
            df = pd.DataFrame(rs.fetchall())
            return jsonify(df.to_json(orient='records'))

class Download(ResFree):
    def post(self):
        jsonData = request.get_json()
        file_id = jsonData['id']

        sql = "select name, path from rs_files where id = :file_id"
        rs = db_session().execute(sql, {'file_id': file_id})

        for row in rs:
            try:
                return send_file(row['path'], attachment_filename=row['name'])
            except Exception:
                return make_response(jsonify({"error": "true", "message": "File not found"}), 401)

