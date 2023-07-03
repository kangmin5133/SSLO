import json


from exception import ArgsException
from .Base import ModelBase, InterfaceHasId
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
import utils
import config



class AnnotationCategoryAttribute(ModelBase, InterfaceHasId):
    """
    ### AnnotationCategoryAttribute

 - 작업의 annotation category 속성

| name | type | length | desc |
| --- | --- | --- | --- |
| annotation_category_attr_id | integer |  |  |
| annotation_category_attr_name | string |  | 이름 |
| annotation_category_attr_desc | string |  | 설명 |
| annotation_category_attr_type | string |  | 유형(단일 선택형, 다중 선택형, 입력형(숫자), 입력형(문자)) |
| annotation_category_attr_val | <string>[] |  | 속성 값 |
| annotation_category_attr_limit_min | integer |  | 입력형 일 때 길이 최소값,  다중 선택 형일 때 선택 최소값 |
| annotation_category_attr_limit_max | integer |  | 입력형 일 때 길이 최대값, 다중 선택 형일 때 선택 최대값 |
    """
    
    def __init__(self, annotation_category_attr_name, annotation_category_attr_type:int, annotation_category_attr_desc=None
                 , annotation_category_attr_val=None, annotation_category_attr_limit_min:int=None, annotation_category_attr_limit_max:int=None, annotation_category_attr_id:int=None
                 , created=None, updated=None):         
        self.annotation_category_attr_name = annotation_category_attr_name
        self.annotation_category_attr_desc = annotation_category_attr_desc
        self.annotation_category_attr_type = annotation_category_attr_type
        
        #
        if self.isValidType() == False:
            raise ArgsException(f"Attribute Type(id:{annotation_category_attr_type}) is wrong")
                
        #
        self.annotation_category_attr_val = None
        if self.isNeedVal():
            annotation_category_attr_val = utils.getOrDefault(annotation_category_attr_val)
            if annotation_category_attr_val is None or len(annotation_category_attr_val) == 0:
                raise ArgsException(f"Select Attribute Type(id:{annotation_category_attr_type}),  Requires an attribute selection value.")
            if isinstance(annotation_category_attr_val, list) == False:
                annotation_category_attr_val = json.loads(annotation_category_attr_val)
            if isinstance(annotation_category_attr_val, list) == False:
                annotation_category_attr_val = [annotation_category_attr_val]
                
            self.annotation_category_attr_val = annotation_category_attr_val
        
        #
        self.annotation_category_attr_limit_min = None
        self.annotation_category_attr_limit_max = None
        if self.isNeedMinMax():
            if annotation_category_attr_limit_min is None or annotation_category_attr_limit_max is None:
                raise ArgsException(f"Input Attribute Type(id:{annotation_category_attr_type}), Requires a range values(min, max)")
        
            self.annotation_category_attr_limit_min = annotation_category_attr_limit_min
            self.annotation_category_attr_limit_max = annotation_category_attr_limit_max
            diff = annotation_category_attr_limit_max - annotation_category_attr_limit_min
            
            if diff < 0:
                raise ArgsException(f"Attrubute, 'min' value cannot be greater than 'max'")
            
            if diff == 0:
                raise ArgsException(f"Attrubute, Range must be at least greater than 1.")
            
        #
        self.annotation_category_attr_id = annotation_category_attr_id
        
        
        super().__init__(created, updated)
          
          
    def get_id(self):
        return self.annotation_category_attr_id
            
    @property
    def _annotation_category_attr_id(self):
        return self.annotation_category_attr_id
    
    @property
    def _annotation_category_attr_name(self):
        return self.annotation_category_attr_name
    @_annotation_category_attr_name.setter
    def _annotation_category_attr_name(self, annotation_category_attr_name) -> None:
        self.annotation_category_attr_name = annotation_category_attr_name
    
    @property
    def _annotation_category_attr_desc(self):
        return self.annotation_category_attr_desc
    @_annotation_category_attr_desc.setter
    def _annotation_category_attr_desc(self, annotation_category_attr_desc) -> None:
        self.annotation_category_attr_desc = annotation_category_attr_desc   
    
    @property
    def _annotation_category_attr_type(self):
        return self.annotation_category_attr_type
    @_annotation_category_attr_type.setter
    def _annotation_category_attr_type(self, annotation_category_attr_type) -> None:
        self.annotation_category_attr_type = annotation_category_attr_type    
        
    @property
    def _annotation_category_attr_val(self):
        return self.annotation_category_attr_val
    @_annotation_category_attr_val.setter
    def _annotation_category_attr_val(self, annotation_category_attr_val) -> None:
        self.annotation_category_attr_val = annotation_category_attr_val 
    
    @property
    def _annotation_category_attr_limit_min(self):
        return self.annotation_category_attr_limit_min
    @_annotation_category_attr_limit_min.setter
    def _annotation_category_attr_limit_min(self, annotation_category_attr_limit_min:int) -> None:
        self.annotation_category_attr_limit_min = annotation_category_attr_limit_min
                                        
    @property
    def _annotation_category_attr_limit_max(self):
        return self.annotation_category_attr_limit_max
    @_annotation_category_attr_limit_max.setter
    def _annotation_category_attr_limit_max(self, annotation_category_attr_limit_max:int) -> None:
        self.annotation_category_attr_limit_max = annotation_category_attr_limit_max
        
    
    def isTypeSelect(self):
        if self.annotation_category_attr_type == 1 or self.annotation_category_attr_type == 2:
            return True
        
        return False
    
    def isTypeInput(self):
        if self.annotation_category_attr_type == 3 or self.annotation_category_attr_type == 4:
            return True
        
        return False
    
    def isNeedVal(self):
        if self.annotation_category_attr_type == 1 or self.annotation_category_attr_type == 2:
            return True
        
        return False
    
    def isNeedMinMax(self):
        if self.annotation_category_attr_type == 2 or self.annotation_category_attr_type == 3 or self.annotation_category_attr_type == 4:
            return True
        
        return False        
    
    
    def isValidType(self):
        
        if self.annotation_category_attr_type == 1 or self.annotation_category_attr_type == 2 or \
            self.annotation_category_attr_type == 3 or self.annotation_category_attr_type == 4:
                return True
            
        return False
        
    def insertWith(self, cursor, project_id, annotation_category_id) -> list:
        resultList = []
        
        table_sub = Table("annotation_category_attribute")
        query_sub = Query.from_(table_sub).select(fn.IfNull( fn.Max(table_sub.annotation_category_attr_id + 1  ), 1 ))

    
        table = Table("annotation_category_attribute")
        query = Query.into(table).columns(
            "annotation_category_attr_id", "annotation_category_id", "project_id",
            "annotation_category_attr_name", "annotation_category_attr_desc", "annotation_category_attr_type", "annotation_category_attr_val", 
            "annotation_category_attr_limit_min", "annotation_category_attr_limit_max"
            ).select(
            query_sub, annotation_category_id, project_id,
            Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
            , Parameter('%s'), Parameter('%s')           
            )
        
        if self.annotation_category_attr_val is not None and isinstance(self.annotation_category_attr_val, list) == False:
            raise ArgsException(f"annotation_category_attr_val type is wrong - type : {type(self.annotation_category_attr_val)} ")
        
        attr_val = json.dumps(self.annotation_category_attr_val, ensure_ascii=False)        
        
        query_data = [self.annotation_category_attr_name, self.annotation_category_attr_desc, self.annotation_category_attr_type, attr_val, 
                      self.annotation_category_attr_limit_min, self.annotation_category_attr_limit_max]
    
        result = DatabaseMgr.updateWithCursor(cursor=cursor, query=query, data=query_data)
        resultList.append(result)                       
        
        return resultList
    
    def updateWith(self, cursor, project_id, annotation_category_id) -> list:

        resultList = []
        
        annotation_category_attr_id = self.get_id()
        if annotation_category_attr_id is None:
            raise ArgsException(f"For update, 'id' must already be defined. ")                    
        
        if self.annotation_category_attr_val is not None and isinstance(self.annotation_category_attr_val, list) == False:
            raise ArgsException(f"annotation_category_attr_val type is wrong - type : {type(self.annotation_category_attr_val)} ")
        
        attr_val = json.dumps(self.annotation_category_attr_val, ensure_ascii=False)        
                
        table = Table("annotation_category_attribute")
        query = Query.update(table).set(
            table.annotation_category_attr_name, Parameter('%s')
        ).set(
            table.annotation_category_attr_desc, Parameter('%s')
        ).set(
            table.annotation_category_attr_type, Parameter('%s')
        ).set(
            table.annotation_category_attr_val, Parameter('%s')
        ).set(
            table.annotation_category_attr_limit_min, Parameter('%s')
        ).set(
            table.annotation_category_attr_limit_max, Parameter('%s')
        ).set(
            table.updated, fn.Now()
        ).where(
            (table.annotation_category_attr_id==annotation_category_attr_id & table.annotation_category_id==annotation_category_id & table.project_id==project_id)
        )
                                          
        query_data = [self.annotation_category_attr_name, self.annotation_category_attr_desc, self.annotation_category_attr_type, attr_val, 
                      self.annotation_category_attr_limit_min, self.annotation_category_attr_limit_max]
    
        result = DatabaseMgr.updateWithCursor(cursor=cursor, query=query, data=query_data)
        resultList.append(result)
        
        return resultList