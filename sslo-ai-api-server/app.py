from flask import Flask, Blueprint, Response, request
import traceback
from http import HTTPStatus
from werkzeug.exceptions import HTTPException

import config
from exception import ArgsException, ExceptionCode

app = Flask(__name__)

# config
app.config.from_object( config.loaded )


#
@app.errorhandler(ArgsException)
def _handle_server_error(argException:ArgsException):
       
    traceback.print_exc()
        
    if argException._error_code == ExceptionCode.BAD_REQUEST:    
        return Response(str(argException), status=HTTPStatus.BAD_REQUEST)
    
    if argException._error_code == ExceptionCode.INTERNAL_SERVER_ERROR:    
        return Response(str(argException), status=HTTPStatus.INTERNAL_SERVER_ERROR)
    
    if argException._error_code == ExceptionCode.REQUEST_ENTITY_TOO_LARGE:    
        return Response(str(argException), status=HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
    
    return Response(str(argException), status=HTTPStatus.INTERNAL_SERVER_ERROR)


@app.errorhandler(HTTPException)
def _handle_server_error(e:HTTPException):
        
    traceback.print_exc()
    
    return Response(str(e), status=e.code)

@app.errorhandler(Exception)
def _handle_server_error(e:Exception):        
    
    traceback.print_exc()
    return Response(str(e), status=HTTPStatus.INTERNAL_SERVER_ERROR)

#    
from api.api_ai import bp_ai
app.register_blueprint(bp_ai, url_prefix='/rest/api/1/ai')      


if __name__ == "__main__":                      
    # run    
    app.run( host=app.config.get("HOST"), port=app.config.get("PORT"), debug=app.config.get("DEBUG")  )