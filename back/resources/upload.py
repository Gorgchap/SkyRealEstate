from flask import  make_response, jsonify, request
from flask_restful import Resource as ResFree

class Upload(ResFree):
    def post(self):
        file = request.file['file']
        if file and self.verifyExt(file.filename):
            try:

                return make_response(jsonify({"message": "Successful"}), 202)
            except FileNotFoundError as e:
                return make_response(jsonify({"error": "true", "message": "File read error"}), 401)
        else:
            return make_response(jsonify({"error": "true", "message": "File not found or wrong extension"}), 401)

    def verifyExt(self, filename):
        ext = filename.rsplit('.', 1)[1]
        if ext == "xls" or ext == "XLS" or ext == "xlsx" or ext == "XLSX":
            return True

        return False