from flask import make_response, jsonify, request
from flask_restful import Resource as ResFree
import base64

class Upload(ResFree):
    def post(self):
        jsonData = request.get_json()

        try:
            date = jsonData['date']
            name = jsonData['name']
            result = jsonData['result']
            size = jsonData['size']

            files = base64.decode(result)

            for file in files:
                pass

            return make_response(jsonify({"message": "Successful"}), 202)
        except KeyError:
            return make_response(jsonify({"error": "true", "message": "File read error"}), 401)
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