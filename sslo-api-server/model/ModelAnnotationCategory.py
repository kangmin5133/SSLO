
from .ModelAnnotationCategoryAttribute import AnnotationCategoryAttribute
from .Base import ModelBase, InterfaceHasId
from exception import ArgsException
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, Order
import config

class AnnotationCategory(ModelBase, InterfaceHasId):
    """
    ### AnnotationCategory

 - 작업의 annotation category

| name | type | length | desc |
| --- | --- | --- | --- |
| annotation_category_id | integer |  |  |
| annotation_category_name | string | 128 |  |
| annotation_category_parent_id | integer |  | 부모 - 상위 카테고리, default: -1 |
| annotation_category_color | integer |  | 색상,   입력하지 않으면 임의의 값으로 지정된다 |
| annotation_category_attributes | Array<AnnotationCategoryAttribute>[] |  | 클래스 속성 리스트 |
    """
    
    def __init__(self, annotation_category_id=None, annotation_category_name="", annotation_category_color=None, annotation_category_attributes=[], annotation_category_parent_id=None, created=None, updated=None):        
        self.annotation_category_id = annotation_category_id
        self.annotation_category_name = annotation_category_name        
        self.annotation_category_color = annotation_category_color
        
        if annotation_category_attributes is None :
            annotation_category_attributes = []
            
            
        self.annotation_category_attributes = list(map(AnnotationCategoryAttribute.createFrom, annotation_category_attributes ))        
        
        self.annotation_category_parent_id = annotation_category_parent_id
        
        super().__init__(created, updated)    
    
    def get_id(self):
        return self.annotation_category_id
    
    @property
    def _annotation_category_id(self):
        return self.annotation_category_id
    
    @property
    def _annotation_category_name(self):
        return self.annotation_category_name
    @_annotation_category_name.setter
    def _annotation_category_name(self, annotation_category_name) -> None:
        self.annotation_category_name = annotation_category_name
    
    @property
    def _annotation_category_parent_id(self):
        return self.annotation_category_parent_id
    @_annotation_category_parent_id.setter
    def _annotation_category_parent_id(self, annotation_category_parent_id) -> None:
        self.annotation_category_parent_id = annotation_category_parent_id    
    
    @property
    def _annotation_category_color(self):
        return self.annotation_category_color
    @_annotation_category_color.setter
    def _annotation_category_color(self, annotation_category_color) -> None:
        self.annotation_category_color = annotation_category_color
        
    @property
    def _annotation_category_attributes(self):
        return self.annotation_category_attributes
    @_annotation_category_attributes.setter
    def _annotation_category_attributes(self, annotation_category_attributes) -> None:
        if annotation_category_attributes is None :
            annotation_category_attributes = []
        self.annotation_category_attributes = annotation_category_attributes
                                        
    
    def insertWith(self, connect, project_id) -> list:

        resultList = []
        
        table_sub = Table("annotation_category")
        table_annotation_category_predefined = Table("annotation_category_predefined")
        query_sub = Query.from_(table_sub).select(
            fn.IfNull( fn.Max(table_sub.annotation_category_id + 1  ), config.ANNOTATION_CATEGORY_MIN_ID_ADD )
        ).left_join(table_annotation_category_predefined).on(
            table_sub.annotation_category_id==table_annotation_category_predefined.annotation_category_id
        ).where((table_sub.project_id==project_id) & (table_annotation_category_predefined.annotation_category_id.isnull()))
        
    
        table = Table("annotation_category")
        if self.get_id() is None:
            query = Query.into(table).columns(
                "annotation_category_id", "project_id",
                "annotation_category_name", "annotation_category_parent_id", "annotation_category_color"
                ).select(
                query_sub, project_id,
                Parameter('%s'), Parameter('%s'), Parameter('%s')
                )
        else:
            query = Query.into(table).columns(
                "annotation_category_id", "project_id",
                "annotation_category_name", "annotation_category_parent_id", "annotation_category_color"
                ).select(
                self.get_id(), project_id,
                Parameter('%s'), Parameter('%s'), Parameter('%s')
                )
            
        query_data = [self.annotation_category_name, self.annotation_category_parent_id, self.annotation_category_color]
    
        with DatabaseMgr.openCursor(connect) as cursor:
            result = DatabaseMgr.updateWithCursor(cursor=cursor, query=query, data=query_data)
            resultList.append(result)

            query = Query.from_(table).select(table.annotation_category_id).where(table.project_id==project_id).orderby('annotation_category_id', order=Order.desc).limit(1)
            result = DatabaseMgr.selectOneWithCursor(cursor=cursor, query=query)
            annotation_category_id = result.get('annotation_category_id')
                     
            print(f"=====> project_id : {project_id}")
            print(f"=====> annotation_category_id : {annotation_category_id}")            
         
            for a in self.annotation_category_attributes:
                resultList_a = a.insertWith(cursor=cursor, project_id=project_id, annotation_category_id=annotation_category_id)  # type: ignore
                resultList.extend(resultList_a)
        
        return resultList        