from .Base import ModelBase

class Permission(ModelBase):
    """
    ### Permission

 - 권한

| name | type | length | desc |
| --- | --- | --- | --- |
| view | boolean |  |  |
| edit | boolean |  |  |
| delete | boolean |  |  |
| create | boolean |  |  |
| export | boolean |  |  |
| import | boolean |  |  |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, is_viewable:bool=False, is_editable:bool=False, is_deleteable:bool=False, is_createable:bool=False, is_exportable:bool=False, is_importable:bool=False):
       
        self.is_viewable = is_viewable        
        self.is_editable = is_editable
        self.is_deleteable = is_deleteable
        self.is_createable = is_createable               
        self.is_exportable = is_exportable
        self.is_importable = is_importable
    
        
    @property
    def _is_viewable(self):
        return self.is_viewable
    @_is_viewable.setter
    def _is_viewable(self, is_viewable) -> None:
        self.is_viewable = is_viewable
        
    @property
    def _is_editable(self):
        return self.is_editable
    @_is_editable.setter
    def _is_editable(self, is_editable) -> None:
        self.is_editable = is_editable  
        
    @property
    def _is_createable(self):
        return self.is_createable
    @_is_createable.setter
    def _is_createable(self, is_createable) -> None:
        self.is_createable = is_createable   
    
    @property
    def _is_deleteable(self):
        return self.is_deleteable
    @_is_deleteable.setter
    def _is_deleteable(self, is_deleteable) -> None:
        self.is_deleteable = is_deleteable
                            
    @property
    def _is_exportable(self):
        return self.is_exportable
    @_is_exportable.setter
    def _is_exportable(self, is_exportable) -> None:
        self.is_exportable = is_exportable
        
    @property
    def _is_importable(self):
        return self.is_importable
    @_is_importable.setter
    def _is_importable(self, is_importable) -> None:
        self.is_importable = is_importable
      
      
    def toDict(self):
        mydict = super().toDict().copy()
        mydict.pop('created', None)
        mydict.pop('updated', None)
        
        return mydict
        
    @classmethod
    def createEmpty(cls):
        
        return Permission(is_viewable=False, is_editable=False, is_deleteable=False, is_createable=False, is_exportable=False, is_importable=False)    