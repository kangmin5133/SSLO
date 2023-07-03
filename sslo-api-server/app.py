

import json
from urllib import response
from flask import Flask, Blueprint, request
from flask.wrappers import Response
from flask_cors import CORS
from http import HTTPStatus
from werkzeug.exceptions import HTTPException
import traceback
import inject

import config 
from log import logger 
from exception import ArgsException, ExceptionCode

from flask_jwt_extended import JWTManager

app = Flask(__name__)

@app.before_request
def before_request_all():
    
    logger.info(f"--------> < Request info > <--------")
    logger.info(f"    * request.url : {request.url}")
    logger.info(f"    * request.ars : {request.args}")
    logger.info(f"    * request.request.is_json : {request.is_json}")

@app.errorhandler(ArgsException)
def handle_server_error_arg(e:ArgsException):
    
    traceback.print_exc()    
    return Response(str(e), int(e._error_code.value))
    

@app.errorhandler(HTTPException)
def handle_server_error_http(e:HTTPException):
    
    traceback.print_exc()
    
    return Response(str(e), status=e.code)

@app.errorhandler(Exception)
def handle_server_error(e:Exception):
    
    traceback.print_exc()    
    
    return Response(str(e), status=HTTPStatus.INTERNAL_SERVER_ERROR)


# config

app.config.from_object(config.loaded)
print(f" mode : {type(config.loaded)} ")


# jwt extend
jwt = JWTManager(app)

# cors 
CORS(app, resources=app.config.get("CORS_RESOURCES"), supports_credentials=True)

inject.configure_once( 
        lambda binder: 
                binder.bind(Flask, app)  # type: ignore
                .bind(JWTManager, jwt)
                # .bind(CSRFProtect, csrf)   # type: ignore
    )
        

from api.api_auth import bp_auth
from api.api_project import bp_project
from api.api_dataset import bp_dataset
from api.api_rawdata import bp_rawdata
from api.api_task import bp_task
from api.api_statics import bp_statics
from api.api_ai import bp_ai
from api.api_help import bp_help

#
app.register_blueprint(bp_auth, url_prefix='/rest/api/1/auth')
app.register_blueprint(bp_project, url_prefix='/rest/api/1/project')
app.register_blueprint(bp_task, url_prefix='/rest/api/1/task')
app.register_blueprint(bp_dataset, url_prefix='/rest/api/1/dataset')
app.register_blueprint(bp_rawdata, url_prefix='/rest/api/1/dataset/data')    
app.register_blueprint(bp_statics, url_prefix='/rest/api/1/statics')
app.register_blueprint(bp_ai, url_prefix='/rest/api/1/ai')
app.register_blueprint(bp_help, url_prefix='/rest/api/1/help')    
    
# db info
logger.debug(app.config.get("DATABASE_CONNECT_INFO"))

if __name__ == "__main__":

    app.run( host=app.config.get("HOST"), port=app.config.get("PORT"), debug=app.config.get("DEBUG")  )
    
    

