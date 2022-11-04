from flask import make_response, jsonify, request
from flask_restful import Resource as ResFree
from model import rs_files, rs_buildings, rs_flats, user
import base64
import pandas as pd
from api import db_session
import uuid

DIR_FILES = 'C:\\rs_files\\'
columns = ['address', 'rooms', 'segment', 'floors', 'wall_mat', 'floor', 'square', 'kit_square', 'balkon', 'to_metro',
           'condition']

class Upload(ResFree):
    def post(self):
        jsonData = request.get_json()
        token_see = request.headers['Authorization']
        web_ses = user.User().checkSession(token_see)
        if web_ses == None:
            return make_response(jsonify({"error":"true", "message": "Invalid session"}), 401)

        try:
            sess = db_session()

            for fileData in jsonData:

                file_uid = str(uuid.uuid4())

                date = fileData['date']
                name = fileData['name']
                result = fileData['result']
                size = fileData['size']

                data = base64.decode(result)

                name_uid = file_uid+'_'+name

                with open(DIR_FILES+name_uid, 'wr') as file:
                    file.write(data)
                    rsf = rs_files.Files(name=name, path=DIR_FILES+name_uid, date=date, size=size, type="in",
                                         user_id=web_ses.user_id)

                    sess.add(rsf)
                    sess.flush()

                    df = pd.read_excel(DIR_FILES+name_uid, header=None, names=columns)
                    df = df.dropna(how='any').reset_index(drop=True).iloc [1: , :]

                    for i, row in df.iterrows():
                        build = rs_buildings.Building(address=row['address'], wall_mat=row['wall_mat'],
                                                      segment=row['segment'], floors=row['floors'])
                        sess.add(build)
                        sess.flush()

                        flats = rs_flats.Flat(bld_id=build.id, rooms=row['rooms'], floor=row['floor'],
                                              square=row['square'], kit_square=row['kit_square'], balkon=row['balkon'],
                                              to_metro=row['to_metro'], condition=row['condition'])
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