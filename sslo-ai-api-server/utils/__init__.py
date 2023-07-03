from datetime import datetime, timedelta, date
import time
from werkzeug.datastructures import FileStorage
import shutil

from exception import ArgsException, ExceptionCode
import config


def getOrDefault(obj, default=None):
    """_객체를 받아 None이거나 ''인 경우 default를 변환한다_
    return : default (None)
    """
    
    if obj is None:
        return default

    if isinstance(obj, str):
        return emptyStrTo(obj, default)        
     
    return obj


def emptyStrTo(arg:str, default=None) -> str:
    """_string을 받아 빈스트링인 경우 default로 변환한다_
    strip()을 통해 좌우 공백이 제거 된다.
    return : default (None)
    """
    
    if arg is None:
        return default  # type: ignore
    
    arg = arg.strip()
    if len(arg) == 0:
        return default  # type: ignore
    
    return arg

def now():
    """
    현재 시간을 Milliseconds로 변환
    js 등에서 사용하기 쉽게 하기 위함
    """
    return int(time.mktime(datetime.utcnow().timetuple())* 1000) 

def toFormattedDateStr(_time) -> str:
    
    if isinstance(_time, datetime):
        return _time.strftime("%Y-%m-%d")
    
    if isinstance(_time, date):
        return _time.strftime("%Y-%m-%d")
        
    if isinstance(_time, float):
        return toFormattedDateStr(toDateTimeFrom(_time))

    if isinstance(_time, str):
        return _time
        
    raise ArgsException(f"toFormattedDateStr is wrong arg : {_time}")

def toDateTimeFrom(atMilliseconds:int) -> datetime:
    """
    Milliseconds을 datetime으로 변환
    """  
    
    if atMilliseconds is None:
        return None  # type: ignore
    
    return datetime.fromtimestamp(atMilliseconds/1000.0)  # type: ignore

def toDateFrom(atMilliseconds:int) -> date:
    """
    Milliseconds을 date으로 변환
    """  
    
    if atMilliseconds is None:
        return None  # type: ignore
    
    return datetime.fromtimestamp(atMilliseconds/1000.0).date()  # type: ignore


def toMillisecondFrom(_time):
    """
    datetime을 Milliseconds로 변환
    """  
    
    if _time is None:
        return None
            
    if isinstance(_time, datetime):
        return toMillisecondFromTimestamp(_time.timestamp())
    
    if isinstance(_time, date):
        return toMillisecondFromTimestamp(datetime( *(_time.timetuple()[:6]) ).timestamp())
        
    if isinstance(_time, float):
        return toMillisecondFromTimestamp(_time)
            
    return toMillisecondFromTimestamp(float(_time))


def toMillisecondFromTimestamp(atTimestamp:float):
    """
    timestamp(falot) 값을 Milliseconds로 변환
    """  
    
    if atTimestamp is None:
        return None
    
    return int(time.mktime(datetime.fromtimestamp(atTimestamp).timetuple()) * 1000 )  


def toDeltaDay(atMilliseconds:int, day:int):
    """
    minus day
    """  
    
    if atMilliseconds is None:
        return None
    
    atDate = toDateTimeFrom(atMilliseconds)
    
    return toMillisecondFromTimestamp( (atDate - timedelta(days=day)).timestamp() )

    
    

def getDiskUsage() -> dict:
    """_summary_

    Returns:
        _total_: _description_
        _used_: _description_
        _free_: _description_
    """
    return shutil.disk_usage(config.loaded.BASE_DIR)


def isFreeSpace(byteCount:int) -> bool:
    """_남아 있는 여유공간을 체크_

    Args:
        byteCount (int): _byte 수_

    Returns:
        _bool_: _description_
    """
    
    total, used, free = getDiskUsage()
    if free > byteCount:
        return True
    
    return False


def checkFileSize(file:FileStorage) -> int:
    """_ check file length _

    Args:
        file (FileStorage): _description_

    Returns:
        int: _total file length_
    """
    # check - image size   
    readLen = 1024 * 10
    step = int(config.MAX_IMAGE_LENGTH / readLen) + 1
    total_len = 0
    for i in range(1, step):
        blob = file.read(readLen)
        blob_len = len(blob)
        total_len += blob_len
        
        if total_len >= config.MAX_IMAGE_LENGTH:
            raise ArgsException(f"image size exceeds, max size({config.MAX_IMAGE_LENGTH/1024} kbyte) : ({file.filename}) ", ExceptionCode.REQUEST_ENTITY_TOO_LARGE)
        
        if blob_len < readLen:
            break;                                                   
    
    file.stream.seek(0)
    
    return total_len