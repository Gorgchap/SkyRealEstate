from flask import make_response, jsonify, request
from flask_restful import Resource as ResFree
from model import rs_files
import base64

DIR_FILES = 'C:\\rs_files\\'

class Upload(ResFree):
    def post(self):
        jsonData = request.get_json()

        try:
            for fileData in jsonData:
                date = fileData['date']
                name = fileData['name']
                result = fileData['result']
                size = fileData['size']

                data = base64.decode(result)

                with open(name, 'wr') as file:
                    file.write(data)
                    rs_files.Files(name=DIR_FILES+name, path="", date=date)



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