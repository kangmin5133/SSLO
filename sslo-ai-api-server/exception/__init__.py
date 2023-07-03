
from enum import Enum
from http import HTTPStatus


class ExceptionCode(Enum):
    """
    exception code    
    """
    BAD_REQUEST=HTTPStatus.BAD_REQUEST
    REQUEST_ENTITY_TOO_LARGE=HTTPStatus.REQUEST_ENTITY_TOO_LARGE
    INTERNAL_SERVER_ERROR=HTTPStatus.INTERNAL_SERVER_ERROR
    FORBIDDEN=HTTPStatus.FORBIDDEN
        
class ArgsException(Exception):
    """
    arguments error 
    """    
    def __init__(self, msg:str, _error_code:ExceptionCode=ExceptionCode.BAD_REQUEST) -> None:
        self.error_code = _error_code
        super().__init__(msg)
        
        
    @property
    def _error_code(self) -> ExceptionCode:
        return self.error_code
        
        
