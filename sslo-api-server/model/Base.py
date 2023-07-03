from datetime import datetime
import json
import copy
from enum import Enum
import numpy as np

from exception import ArgsException, ExceptionCode
import utils

class ModelBaseJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ModelBase):
             return  obj.toDict()                     
        
        if isinstance(obj, datetime):
             return utils.toMillisecondFromTimestamp(obj.timestamp())
         
        if isinstance(obj, Enum):
            return obj.value
        
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.int32):
            return int(obj)
        if isinstance(obj, np.int64):
            return int(obj)
        if isinstance(obj, np.float32):
            return float(obj)
        if isinstance(obj, np.float64):
            return float(obj)
         
        print( f" ModelBaseJSONEncoder -> obj : {obj}, type : {type(obj)}  ")
                  
        return json.JSONEncoder.default(self, obj)
    
    
from abc import *
class InterfaceHasId(metaclass=ABCMeta):    
    @abstractmethod
    def get_id(self):
        pass
    

class ModelBase:
    
    def __init__(self, created=None, updated=None):
                        
        self.created = created        
        self.updated = updated
    
    @property
    def _created(self):
        return self.created
    @_created.setter
    def _created(self, created):
        self.created = created
        
    @property
    def _updated(self):
        return self.updated
    @_updated.setter
    def _updated(self, updated):
        self.updated = updated                  
    
    def toJsonDump(self):
        return str(self)
    
    def toDict(self):
        at = self.__dict__
        filtered = {k: v for k, v in at.items() if v is not None}
        return filtered
        
    @classmethod
    def fromDict(cls, data:dict):                
        return cls(**data)
    
    @classmethod
    def fromList(cls, data:list):                       
        return cls(data)
    
    def __iter__(self):
        yield from self.toDict().items()

    def __str__(self):
        return json.dumps(dict(self), cls=ModelBaseJSONEncoder, ensure_ascii=False)

    def __repr__(self):
        return self.__str__()
    
    @classmethod
    def createFrom(cls, data, allowNone=False):
        if isinstance(data, ModelBase):
            return copy.deepcopy( data )
        
        if isinstance(data, dict):
            return cls.fromDict(data)
        
        if isinstance(data, list):
            results = []
            for item in data:
                r = cls.createFrom(item)
                results.append(r)
            
            return results
        
        if data is None:
            if allowNone == True:
                return None
            else:
                raise ArgsException(f'data is None')     
        
        raise ArgsException(f'data({data}, class : {cls}  {isinstance(data, ModelBase)}) is not valid! ')