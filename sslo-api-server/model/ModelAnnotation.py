

from .Base import ModelBase, InterfaceHasId
from .ModelAnnotationType import AnnotationType
from .ModelAnnotationCategory import AnnotationCategory
from .ModelAnnotationCategoryAttribute import AnnotationCategoryAttribute

from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, Order
from log import logger
import utils
from exception import ArgsException, ExceptionCode
import config

class Annotation(ModelBase, InterfaceHasId):
    """
    ### Annotation

 - Task 연결된 annotation 정보  

 - coco format ([https://cocodataset.org/#format-data](https://cocodataset.org/#format-data)) 중 object detection 참조

| name | type |  | desc | createable(* require) | updateable(* require) |
| --- | --- | --- | --- | --- | --- |
| annotation_id | integer |  |  | n | n* |
| task_id | <Task>.task_id |  |  | n | n* |
| annotation_type | <AnnotationType> |  | annotation type : 1: bbox, 2: polygon, 3: segment
default : bbox | y | y |
| annotation_category | <AnnotationCategory> |  |  | *y | y |
| annotation_category_attribute | <AnnotationCategoryAttribute> |  |  | y | y |
| annotation_category_attr_val_select | string[] |  | * 단일 선택형, 다중 선택형 일때 선택 값annotation_category_attr_val | y | y |
| annotation_category_attr_val_input | integer |  | * 입력형 일 때 입력 값 | y | y | -> string[] (20230111-fix)
| annotation_data | float[] |  | type에 따른 data 
 - bbox : 좌표(x,y), 폭(width), 높이(height)
 - polygon : 좌표(x,y) 리스트
 - segment : 좌표(x,y) 리스트 | y | y |
| created | <Time> |  | 생성시간 | n | n |
| updated | <Time> |  | 변경시간 | n | n |
    """
    
    def __init__(self, annotation_id=None, task_id=None, annotation_type=None, annotation_category=None, annotation_category_attribute=None, annotation_category_attr_val_select=None, annotation_category_attr_val_input=None, annotation_data=None, created=None, updated=None,score=None):        
        self.annotation_id = annotation_id
        self.task_id = task_id
        self.score = score
        self.annotation_type:AnnotationType = AnnotationType.createFrom(annotation_type, allowNone=True)  # type: ignore
        self.annotation_category:AnnotationCategory = AnnotationCategory.createFrom(annotation_category, allowNone=True)  # type: ignore
        self.annotation_category_attribute:AnnotationCategoryAttribute = AnnotationCategoryAttribute.createFrom(annotation_category_attribute, allowNone=True)  # type: ignore
        
        if isinstance(annotation_category_attr_val_select, str):
            annotation_category_attr_val_select = list(map(str,map(str.strip, annotation_category_attr_val_select.split(config.SEPARATOR_ANNOTATION_ATTRIBUTE))))
        self.annotation_category_attr_val_select = annotation_category_attr_val_select
        
        self.annotation_category_attr_val_input = annotation_category_attr_val_input
        
        if isinstance(annotation_data, str):
            annotation_data = list(map(float,map(str.strip, annotation_data.split(","))))            
        self.annotation_data = annotation_data
        
        super().__init__(created, updated)
    
    def get_id(self):
        return self.annotation_id
    
    @property
    def _annotation_id(self):
        return self.annotation_id
    
    @property
    def _task_id(self):
        return self.task_id
    @_task_id.setter
    def _task_id(self, task_id) -> None:
        self.task_id = task_id
    
    @property
    def _annotation_type(self) -> AnnotationType:
        return self.annotation_type
    @_annotation_type.setter
    def _annotation_type(self, annotation_type) -> None:
        self.annotation_type = annotation_type
    
    @property
    def _annotation_category(self) -> AnnotationCategory:
        return self.annotation_category
    @_annotation_category.setter
    def _annotation_category(self, annotation_category) -> None:
        self.annotation_category = annotation_category         
        
    @property
    def _annotation_category_attribute(self) -> AnnotationCategoryAttribute:
        return self.annotation_category_attribute
    @_annotation_category_attribute.setter
    def _annotation_category_attribute(self, annotation_category_attribute) -> None:
        self.annotation_category_attribute = annotation_category_attribute  
        
    @property
    def _annotation_category_attr_val_select(self) -> list:
        return self.annotation_category_attr_val_select
    @_annotation_category_attr_val_select.setter
    def _annotation_category_attr_val_select(self, annotation_category_attr_val_select) -> None:
        self.annotation_category_attr_val_select = annotation_category_attr_val_select 
        
    @property
    def _annotation_category_attr_val_input(self) -> int:
        return self.annotation_category_attr_val_input
    @_annotation_category_attr_val_input.setter
    def _annotation_category_attr_val_input(self, annotation_category_attr_val_input) -> None:
        self.annotation_category_attr_val_input = annotation_category_attr_val_input  
    
    @property
    def _annotation_data(self):
        return self.annotation_data
    @_annotation_data.setter
    def _annotation_data(self, annotation_data) -> None:
        self.annotation_data = annotation_data
    
    
    
    @classmethod 
    def getResultWithLastCreated(cls, connect, project_id, task_id):
        """_get annotation last created_

        Args:
            connect (_type_): _description_
            project_id (_type_): _description_
            task_id (_type_): _description_

        Returns:
            _type_: _description_
        """
        table_annotation = Table("annotation")
        query = Query.from_(table_annotation).select(
            table_annotation.project_id, table_annotation.task_id,
            table_annotation.annotation_id, table_annotation.annotation_type_id, 
            table_annotation.annotation_category_attr_id, table_annotation.annotation_category_attr_val_select, table_annotation.annotation_category_attr_val_input,
            table_annotation.annotation_category_id, table_annotation.annotation_data, 
            table_annotation.created, table_annotation.updated
        ).where(
            table_annotation.project_id==project_id
        ).where(
            table_annotation.task_id==task_id
        ).orderby(
            table_annotation.created, order=Order.desc
        ).limit(1)
           
        result = DatabaseMgr.selectOneWithConnect(connect, query)             
        return result
                                        
    @classmethod    
    def createWithInsert(cls, connect, project_id, task_id,  annotation_type_id, annotation_category_id, annotation_category_attr_id, annotation_category_attr_val_select, annotation_category_attr_val_input, annotation_data) -> int:
        """_ insert and query last created_

        Args:
            connect (_type_): _description_
            project_id (_type_): _description_
            task_id (_type_): _description_
            annotation_type_id (_type_): _description_
            annotation_category_id (_type_): _description_
            annotation_data (_type_): _description_

        Returns:
            int: _description_
        """
        table_sub = Table("annotation")
        query_sub = Query.from_(table_sub).select(fn.IfNull( fn.Max(table_sub.annotation_id + 1), 1 )).where(table_sub.project_id==project_id)
        
        table = Table("annotation")
        query = Query.into(table).columns(
            "annotation_id", "project_id", "task_id"            
            , "annotation_type_id"
            , "annotation_category_id"
            , "annotation_category_attr_id"
            , "annotation_category_attr_val_select"
            , "annotation_category_attr_val_input"
            , "annotation_data"
        ).select(
            query_sub, project_id, task_id
            , Parameter("%s")
            , Parameter("%s")
            , Parameter("%s")
            , Parameter("%s")
            , Parameter("%s")
            , Parameter("%s")
        )
        
        if isinstance(annotation_data, list):
            annotation_data = ",".join(list(map(str, annotation_data)))
            
        if isinstance(annotation_category_attr_val_select, list):
            annotation_category_attr_val_select = config.SEPARATOR_ANNOTATION_ATTRIBUTE.join(list(map(str, annotation_category_attr_val_select)))
        
        query_data = [annotation_type_id, annotation_category_id, annotation_category_attr_id, annotation_category_attr_val_select, annotation_category_attr_val_input, annotation_data ]
        
        DatabaseMgr.updateWithConnect(connect, query, query_data)
        
        
           