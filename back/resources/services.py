from sqlalchemy.ext.declarative import declarative_base
from flask import make_response, jsonify, request, send_file
from flask_restful import Resource as ResFree
from model import rs_files, rs_buildings, rs_flats, user
from api import db_session

Base = declarative_base()

class Benchmarks(ResFree):
    def post(self):
        jsonData = request.get_json()