
from werkzeug.datastructures import FileStorage
import json
import os
import ast
import numpy as np
from datetime import date
import utils
from utils import DataPathProject
from exception import ArgsException, ExceptionCode
import config
from log import logger

from config.SSLOEnums import AnnotationTypes, AnnotationFomat
from model import PageInfo, SearchResult
from model import License
from model import User, UserRole, Dataset, Rawdata, Project, ProjectType, Task, TaskType , Comment, TaskStatus, TaskComment, ImageDetail
from model import ProjectDetail, ProjectDetailCollect, ProjectDetailProcessing
from model import Annotation, AnnotationCategory, AnnotationCategoryAttribute, AnnotationType
from service import serviceProject, serviceTask
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Order, Distinct
from service.permission import PermissionMgr
from service.cache import CacheMgr


def getImageFilenameForAnnotation(project_id, imagefileBasename, isUseDataDir=True, dataDir=config.ANNOTATION_DATA_DIR) -> str:
        
    if isUseDataDir :
        filename = os.path.join(dataDir, imagefileBasename)
    else:
        filename = DataPathProject.getImagePathForAnnotation(project_id, imagefileBasename)
    
    return filename
    

def paraseAnnotationCategoryAttribute(resultQuery) -> AnnotationCategoryAttribute:
    data = {}        
    
    # annotation_category_attr_id
    annotation_category_attr_id = resultQuery.pop("annotation_category_attr_id")    
    data["annotation_category_attr_id"] = annotation_category_attr_id    
    if annotation_category_attr_id is None:
        return None
    
    # annotation_category_attr_name
    data["annotation_category_attr_name"] = resultQuery.pop("annotation_category_attr_name")
    
    # annotation_category_attr_desc
    data["annotation_category_attr_desc"] = resultQuery.pop("annotation_category_attr_desc")
    
    # annotation_category_attr_type
    data["annotation_category_attr_type"] = resultQuery.pop("annotation_category_attr_type")
    
    # annotation_category_attr_val
    data["annotation_category_attr_val"] = resultQuery.pop("annotation_category_attr_val")
    
    # annotation_category_attr_limit_min
    data["annotation_category_attr_limit_min"] = resultQuery.pop("annotation_category_attr_limit_min")
    
    # annotation_category_attr_limit_max
    data["annotation_category_attr_limit_max"] = resultQuery.pop("annotation_category_attr_limit_max")    
    
    # created
    data["created"] = resultQuery.pop("annotation_category_attribute_created")
    if data["created"] is None:
        data["created"] = resultQuery.pop("created")
    
    
    # updated
    data["updated"] = resultQuery.pop("annotation_category_attribute_updated")
    if data["updated"] is None:
        data["updated"] = resultQuery.pop("updated")
                   
    #
    annotationCategoryAttribute:AnnotationCategoryAttribute = AnnotationCategoryAttribute.createFrom(data)    # type: ignore
    
    return annotationCategoryAttribute

def paraseAnnotationCategory(resultQuery) -> AnnotationCategory:
    data = {}        
    
    # annotation_category_id
    annotation_category_id = resultQuery.get("annotation_category_id")    
    data["annotation_category_id"] = annotation_category_id    
    if annotation_category_id is None:
        return None    
    
    # annotation_category_name
    data["annotation_category_name"] = resultQuery.pop("annotation_category_name")
    
    # annotation_category_parent_id
    data["annotation_category_parent_id"] = resultQuery.pop("annotation_category_parent_id")
    
    # annotation_category_color
    data["annotation_category_color"] = resultQuery.pop("annotation_category_color")
    
    # annotation_category_attributes
    data["annotation_category_attributes"] = resultQuery.pop("annotation_category_attributes", None)
        
    # created
    data["created"] = resultQuery.pop("annotation_category_created", None)
    if data["created"] is None:
        data["created"] = resultQuery.pop("created")
    
    # updated
    data["updated"] = resultQuery.pop("annotation_category_updated", None)
    if data["updated"] is None:
        data["updated"] = resultQuery.pop("updated") 
                   
    #
    annotationCategory:AnnotationCategory = AnnotationCategory.createFrom(data)    # type: ignore
    
    return annotationCategory


def getLicense(license_id) -> License:
    """_getLicense_

    Args:
        license_id (_type_): _description_

    Returns:
        License: _description_
    """
    
    if license_id is None:
        raise ArgsException(f"license_id is None", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    table = Table("license")
    query = Query.from_(table).select(
        "*"
        ).where(
            table.license_id==Parameter('%s')
        )
    query_data = [license_id]
    
    result = DatabaseMgr.selectOne(query=query, data=query_data)
    if result is None:
        raise ArgsException(f"License({license_id}) is not exist", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    return License.createFrom(result)  # type: ignore


def getAnnotationCategoriesPredefined() -> dict:
    """_get annotation categories (predefind) _

    Returns:
        dict{ "1" : AnnotationCategory, "2" : AnnotationCategory }: _description_
    """
        
    # category_attribute
    table_annotation_category = Table("annotation_category_predefined") 
    table_annotation_category_attribute = Table("annotation_category_attribute_predefined")
    query = Query.from_(table_annotation_category).select(
        table_annotation_category.annotation_category_id
        , table_annotation_category.annotation_category_name
        , table_annotation_category.annotation_category_parent_id
        , table_annotation_category.annotation_category_color
        , table_annotation_category.created
        , table_annotation_category.updated
        , table_annotation_category_attribute.annotation_category_attr_id
        , table_annotation_category_attribute.annotation_category_attr_name
        , table_annotation_category_attribute.annotation_category_attr_desc
        , table_annotation_category_attribute.annotation_category_attr_type
        , table_annotation_category_attribute.annotation_category_attr_val
        , table_annotation_category_attribute.annotation_category_attr_limit_min
        , table_annotation_category_attribute.annotation_category_attr_limit_max
        , table_annotation_category_attribute.created.as_("annotation_category_attribute_created")
        , table_annotation_category_attribute.updated.as_("annotation_category_attribute_updated")
    ).left_join(table_annotation_category_attribute).on(
        (table_annotation_category.annotation_category_id==table_annotation_category_attribute.annotation_category_id)
    )
       
    # 
    categories = {}
                
    results = DatabaseMgr.select(query)
    for r in results:
        
        # annotation_category
        annotation_category_id = r.get("annotation_category_id")
        annotation_category = categories.get(annotation_category_id)
        if annotation_category is None:
            annotation_category = paraseAnnotationCategory(r)
            annotation_category._annotation_category_attributes = []
            categories[annotation_category.get_id()] = annotation_category

        # annotation_category_attribute
        annotation_category_attribute = paraseAnnotationCategoryAttribute(r)
        if annotation_category_attribute is not None:
            annotation_category._annotation_category_attributes.append(annotation_category_attribute)        
        
    return categories

def getAnnotationCategories(project_id, isClearCache=False) -> dict:
    """_get annotation categories (all in project) _

    Args:
        project_id (_type_): _description_

    Returns:
        dict{ "1" : AnnotationCategory, "2" : AnnotationCategory }: _description_
    """
    
    if isClearCache:
        CacheMgr.updateAnnotationCategories(project_id)
        
    annotationCategoryDict = CacheMgr.getAnnotationCategories(project_id)
    if annotationCategoryDict is not None:
        return annotationCategoryDict
    
    # category_attribute
    table_annotation_category = Table("annotation_category") 
    table_annotation_category_attribute = Table("annotation_category_attribute")
    query = Query.from_(table_annotation_category).select(
        table_annotation_category.annotation_category_id
        , table_annotation_category.annotation_category_name
        , table_annotation_category.annotation_category_parent_id
        , table_annotation_category.annotation_category_color
        , table_annotation_category.created
        , table_annotation_category.updated
        , table_annotation_category_attribute.annotation_category_attr_id
        , table_annotation_category_attribute.annotation_category_attr_name
        , table_annotation_category_attribute.annotation_category_attr_desc
        , table_annotation_category_attribute.annotation_category_attr_type
        , table_annotation_category_attribute.annotation_category_attr_val
        , table_annotation_category_attribute.annotation_category_attr_limit_min
        , table_annotation_category_attribute.annotation_category_attr_limit_max
        , table_annotation_category_attribute.created.as_("annotation_category_attribute_created")
        , table_annotation_category_attribute.updated.as_("annotation_category_attribute_updated")
    ).left_join(table_annotation_category_attribute).on(
        (table_annotation_category.project_id==table_annotation_category_attribute.project_id) & (table_annotation_category.annotation_category_id==table_annotation_category_attribute.annotation_category_id)
    ).where(
        table_annotation_category.project_id==project_id
    )
       
    # 
    categories = {}
                
    results = DatabaseMgr.select(query)
    for r in results:
        
        # annotation_category
        annotation_category_id = r.get("annotation_category_id")
        annotation_category = categories.get(annotation_category_id)
        if annotation_category is None:
            annotation_category = paraseAnnotationCategory(r)
            annotation_category._annotation_category_attributes = []
            categories[annotation_category.get_id()] = annotation_category

        # annotation_category_attribute
        annotation_category_attribute = paraseAnnotationCategoryAttribute(r)
        if annotation_category_attribute is not None:
            annotation_category._annotation_category_attributes.append(annotation_category_attribute)        
        
    return CacheMgr.storeAnnotationCategories(project_id, categories)


def getAnnotationCategory(project_id, annotation_category_id, isClearCache=False):
    """_get annotation type _

    Args:
        project_id (_type_): _description_
        annotation_category_id (_type_): _description_

    Returns:
        AnnotationCategory: _description_
    """
    
    if isClearCache:
        CacheMgr.updateAnnotationCategory(project_id, annotation_category_id)
        
    annotationCategory = CacheMgr.getAnnotationCategory(project_id, annotation_category_id)
    if annotationCategory is not None:
        return annotationCategory
      
    getAnnotationCategories(project_id, isClearCache=True)
    return CacheMgr.getAnnotationCategory(project_id, annotation_category_id)
    


def getAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attr_id, isClearCache=False):
    """_get annotation category attribute _

    Args:
        project_id (_type_): _description_
        annotation_category_id (_type_): _description_

    Returns:
        AnnotationCategory: _description_
    """
    
    if isClearCache:
        CacheMgr.updateAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attr_id)
        
    annotationCategoryAttribute = CacheMgr.getAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attr_id)
    if annotationCategoryAttribute is not None:
        return annotationCategoryAttribute
      
    getAnnotationCategories(project_id, isClearCache=True)
    return CacheMgr.getAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attr_id)
    
    
def getAnnotationType(project_id, annotation_type_id, isClearCache=False) -> AnnotationType:
    """_get annotation type _

    Args:
        project_id (_type_): _description_
        annotation_type_id (_type_): _description_

    Returns:
        AnnotationType: _description_
    """
    
    if isClearCache:
        CacheMgr.updateAnnotationType(project_id, annotation_type_id)
        
    annotationType = CacheMgr.getAnnotationType(project_id, annotation_type_id)
    if annotationType is not None:
        return annotationType
    
    table = Table("annotation_type")
    query = Query.from_(table).select("*").where(
        table.annotation_type_id == annotation_type_id
    )
    
    result = DatabaseMgr.selectOne(query)
    annotationType = AnnotationType.createFrom(result, allowNone=True)  # type: ignore
    return CacheMgr.storeAnnotationType(project_id, annotationType)
    
    

def parseAnnotation(project_id, resultQuery) -> Annotation:        
    # update items
    data = {}
    
    # id or None
    data["annotation_id"] = resultQuery.get("annotation_id")
    
    # task_id
    data["task_id"] = resultQuery.get("task_id")
    
    # annotation_type    
    annotation_type = resultQuery.get("annotation_type")
    if annotation_type is None:
        annotation_type = {"annotation_type_id": resultQuery.pop("annotation_type_id", None)}
                
    if annotation_type is not None:
        annotation_type_id = utils.getOrDefault(annotation_type.get("annotation_type_id"))
        if annotation_type_id is None:
            raise ArgsException(f"annotation_type_id is missing")
        annotation_type = getAnnotationType(project_id, annotation_type_id)
        if annotation_type is None:
            raise ArgsException(f"annotation_type_id({annotation_type_id}) is not exist")
        
    if annotation_type is None:
        annotation_type = AnnotationType.createDefault()
        
    data["annotation_type"] = annotation_type

    # annotation_category
    annotation_category = resultQuery.get("annotation_category")
    if annotation_category is None:
        annotation_category = {"annotation_category_id": resultQuery.pop("annotation_category_id", None)}
    if annotation_category is None:
        raise ArgsException(f"annotation_category is missing.")
    if isinstance(annotation_category, AnnotationCategory):
        annotation_category_id = annotation_category._annotation_category_id
    else:
        annotation_category_id = utils.getOrDefault(annotation_category.get("annotation_category_id"))
        
    if annotation_category_id is None:
        raise ArgsException(f"annotation_category_id is missing.")    
    annotation_category = getAnnotationCategory(project_id, annotation_category_id)
    if annotation_category is None:
        raise ArgsException(f"annotation_category_id({annotation_category_id}) is not exist")
                
    data["annotation_category"] = annotation_category
    
    
    # annotation_category_attributes

    annotation_category_attribute = resultQuery.get("annotation_category_attributes") 
    if annotation_category_attribute is None:
        annotation_category_attr_id = resultQuery.pop("annotation_category_attr_id", None)        
        annotation_category_attribute = {"annotation_category_attr_id": annotation_category_attr_id}                
        
    if isinstance(annotation_category_attribute, AnnotationCategoryAttribute):
        annotation_category_attr_id = annotation_category_attribute._annotation_category_attr_id
    else:
        annotation_category_attr_id = utils.getOrDefault(annotation_category_attribute.get("annotation_category_attr_id"))
            
    if annotation_category_attr_id is not None:            
        annotation_category_attribute = getAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attr_id)
        if annotation_category_attribute is None:
            raise ArgsException(f"annotation_category_attribute({annotation_category_attr_id}) is not exist")
                    
        data["annotation_category_attribute"] = annotation_category_attribute
        
        # annotation_category_attr_val_select    
        annotation_category_attr_val_select = resultQuery.get("annotation_category_attr_val_select")
        if annotation_category_attribute.isTypeSelect(): # select 
            if annotation_category_attr_val_select is None:
                raise ArgsException(f"annotation_category_attr_val_select is missing.")

            if isinstance(annotation_category_attr_val_select, list) == False:
                annotation_category_attr_val_select = [annotation_category_attr_val_select]
                            
            diff = 1
            if annotation_category_attribute.isNeedMinMax():       
                diff = annotation_category_attribute._annotation_category_attr_limit_max - annotation_category_attribute._annotation_category_attr_limit_min
              
            if diff < len(annotation_category_attr_val_select):
                raise ArgsException(f"annotation_category_attr_val_select, Too many values selected.")
            
            for sel in annotation_category_attr_val_select:
                if sel not in annotation_category_attribute._annotation_category_attr_val:
                    raise ArgsException(f"annotation_category_attr_val_select, The selected value is a non-existent value.")
                    
            data["annotation_category_attr_val_select"] = annotation_category_attr_val_select
            
        # annotation_category_attr_val_input    
        annotation_category_attr_val_input = resultQuery.get("annotation_category_attr_val_input")
        if annotation_category_attribute.isTypeInput(): # input
            if annotation_category_attr_val_input is None:
                raise ArgsException(f"annotation_category_attr_val_input is missing.")
            if annotation_category_attribute._annotation_category_attr_limit_min > len(annotation_category_attr_val_input):
                raise ArgsException(f"annotation_category_attr_val_input is less than 'min({annotation_category_attribute._annotation_category_attr_limit_min})'.")
            if annotation_category_attribute._annotation_category_attr_limit_max < len(annotation_category_attr_val_input):
                raise ArgsException(f"annotation_category_attr_val_input is greater than 'max({annotation_category_attribute._annotation_category_attr_limit_max})'.")
            data["annotation_category_attr_val_input"] = annotation_category_attr_val_input
    
    # annotation_data
    annotation_data = resultQuery.get("annotation_data")
    if annotation_data is None:
        raise ArgsException(f"annotation_data is missing.")
                
    data["annotation_data"] = annotation_data
    
    # created
    created = resultQuery.get("created")
    if created is not None:
        data["created"] = utils.toMillisecondFrom( created )
    
    # updated
    updated = resultQuery.get("updated")
    if updated is not None:
        data["updated"] = utils.toMillisecondFrom( updated )            
    
    return Annotation.createFrom(data)  # type: ignore
    

def getAnnotation(project_id, task_id, annotation_id, isClearCache=False) -> Annotation:
                
    if isClearCache:        
        CacheMgr.updateAnnotation(project_id, task_id, annotation_id)
        
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
    
    result = DatabaseMgr.selectOne(query)
    if result is None:
        return None  # type: ignore
    
    return parseAnnotation(project_id, result)
    
    

def createAnnotation(project_id, task_id, jsonData) -> Annotation:
    """_summary_

    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
        jsonData (Annotation): _description_

    Raises:
        ArgsException: _description_        

    Returns:
        Annotation: _description_
    """
        
    
    logger.info(f"----> create_annotation : {jsonData}")        
                
    # insert items
    jsonData["task_id"] = task_id
    annotation = parseAnnotation(project_id, jsonData)                             
       
    with DatabaseMgr.openConnect() as connect:        
        if annotation._annotation_category_attribute is None:
            Annotation.createWithInsert(connect, project_id, task_id, 
                                        annotation._annotation_type._annotation_type_id, 
                                        annotation._annotation_category._annotation_category_id,
                                        None,
                                        None,
                                        None, 
                                        annotation._annotation_data )
        else:
            Annotation.createWithInsert(connect, project_id, task_id, 
                                        annotation._annotation_type._annotation_type_id, 
                                        annotation._annotation_category._annotation_category_id,
                                        annotation._annotation_category_attribute._annotation_category_attr_id,
                                        annotation._annotation_category_attr_val_select,
                                        annotation._annotation_category_attr_val_input, 
                                        annotation._annotation_data )
        
        result = Annotation.getResultWithLastCreated(connect, project_id, task_id)
        
        annotation = parseAnnotation(project_id, result)
        connect.commit()
    
    CacheMgr.updateAnnotation(project_id, task_id, annotation.get_id())
    
    return annotation
   

def deleteAnnotation(project_id, task_id, annotation_id) -> Annotation:
    """_delete_annotation_

    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
        annotation_id (_type_): _description_

    Raises:
        ArgsException: _description_

    Returns:
        Annotation: _description_
    """
   
    annotation = getAnnotation(project_id, task_id, annotation_id)
    if annotation is None:
        raise ArgsException(f'Task({task_id}), Annotation({annotation_id}) is not exist')


    query = "DELETE FROM annotation where project_id = %s and task_id = %s and annotation_id = %s "
    DatabaseMgr.update(query, [project_id, task_id, annotation_id])
    
    #
    CacheMgr.updateAnnotation(project_id, task_id, annotation_id)
    
    return annotation

def updateAnnotation(project_id, task_id, jsonData) -> Annotation:
                                   
    annotationUpdate:Annotation = parseAnnotation(project_id, jsonData)  # type: ignore
    
    annotation_id = annotationUpdate._annotation_id
    if annotation_id is None:
        raise ArgsException(f"annotation_id is missing")
    
    annotation = getAnnotation(project_id, task_id, annotation_id)
    if annotation is None:
        raise ArgsException(f'Task({task_id}), Annotation({annotation_id}) is not exist')
    
    table = Table("annotation")
    query = Query.update(table).where(
        table.project_id==project_id
    ).where(
        table.task_id==task_id
    ).where(
        table.annotation_id==annotation_id
    )
          
    # update items
    updateCount = 0 
    
    # annotation_type
    
    annotation_type = annotationUpdate._annotation_type
    if annotation_type is not None:
        annotation_type_id = annotationUpdate._annotation_type._annotation_type_id
        if annotation_type_id is None:
            raise ArgsException(f"annotation_type_id is wrong")
        annotation_type = getAnnotationType(project_id, annotation_type_id)
        if annotation_type is None:
            raise ArgsException(f"annotation_type_id is wrong")
        
        query = query.set(table.annotation_type_id, annotation_type_id)
        updateCount += 1
        
    # annotation_category
    annotation_category = annotationUpdate._annotation_category
    if annotation_category is not None:
        annotation_category_id = annotation_category._annotation_category_id
        if annotation_category._annotation_category_id is None:
            raise ArgsException(f"annotation_category_id is wrong")
        annotation_category = getAnnotationCategory(project_id, annotation_category_id)
        if annotation_category is None:
            raise ArgsException(f"annotation_category_id is wrong")
        
        query = query.set(table.annotation_category_id, annotation_category_id)
        updateCount += 1
        
    # annotation_data
    annotation_data = annotationUpdate._annotation_data
    if annotation_data is not None:
        annotation_data = ",".join(map(str, annotation_data))
        query = query.set(table.annotation_data, annotation_data)
        updateCount += 1
        
    
    if updateCount <= 0:
        raise ArgsException(f"At least 1 item is required for the update.")
        
    query = query.set(table.updated, fn.Now())
    
    DatabaseMgr.update(query)                
    
    return getAnnotation(project_id, task_id, annotation_id, isClearCache=True)


def findAnnotationBy(project_id=None, task_ids=None, 
                       annotation_category_ids=None, annotation_category_names=None, annotation_type_id=None,
                       annotation_category_attr_select_or_input_values=None,
                       startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER
                       ) -> SearchResult:  
           
    logger.info(" ---> find_annotation_by ")
    
    table_annotation_category = Table("annotation_category")
    
    table_annotation = Table("annotation")
    query = Query.from_(table_annotation).left_join(table_annotation_category).on(
        (table_annotation_category.project_id == table_annotation.project_id) & (table_annotation_category.annotation_category_id == table_annotation.annotation_category_id)
    )
                     
    # where
    if project_id is not None:
        query = query.where(table_annotation.project_id == project_id )
    if task_ids is not None:
        if isinstance(task_ids, list):
            query = query.where(table_annotation.task_id.isin(task_ids) )
        else:
            query = query.where(table_annotation.task_id==task_ids )
    if annotation_category_ids is not None:
        query = query.where(table_annotation.annotation_category_id.isin(annotation_category_ids) )
    if annotation_type_id is not None:
        query = query.where(table_annotation.annotation_type_id == annotation_type_id )
        
    if annotation_category_names is not None:
        if isinstance(annotation_category_names, list):
            for a in annotation_category_names:
                query = query.where(table_annotation_category.annotation_category_name.like(f"%{a}%")) 
        else:
            query = query.where(table_annotation_category.annotation_category_name.like(f"%{annotation_category_names}%"))                
            
    if annotation_category_attr_select_or_input_values is not None:
        if isinstance(annotation_category_attr_select_or_input_values, list):
            for v in annotation_category_attr_select_or_input_values:
                query = query.where(
                    (table_annotation.annotation_category_attr_val_select.like(f"%{v}%") | table_annotation.annotation_category_attr_val_input.like(f"%{v}%"))
                    ) 
        else:
            query = query.where(
                (table_annotation.annotation_category_attr_val_select.like(f"%{annotation_category_attr_select_or_input_values}%") | table_annotation.annotation_category_attr_val_input.like(f"%{annotation_category_attr_select_or_input_values}%"))
            )
             
    
    # count
    queryCount = query.select( fn.Count(Distinct(table_annotation.annotation_id)).as_("totalResults") )
    countResult = DatabaseMgr.selectOne(queryCount)
    if countResult is None:
        totalResults = 0
    else :
        totalResults = DatabaseMgr.selectOne(queryCount).get("totalResults")
    
    # select
    querySelect = query.select(
       table_annotation.project_id, table_annotation.task_id,
       table_annotation.annotation_id, table_annotation.annotation_type_id, 
       table_annotation.annotation_category_attr_id, table_annotation.annotation_category_attr_val_select, table_annotation.annotation_category_attr_val_input,
       table_annotation.annotation_category_id, table_annotation.annotation_data, 
       table_annotation.created, table_annotation.updated
    )           
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order)       
    
                      
    results = DatabaseMgr.select(querySelect)    
    itemList = []
    for r in results:        
        
        annotation = parseAnnotation(project_id, r)     
        itemList.append(annotation)
    
    return SearchResult.create(itemList, startAt=startAt, totalResults=totalResults, maxResults=maxResults)


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.int64):
            return int(obj)
        if isinstance(obj, np.float32):
            return float(obj)
        return json.JSONEncoder.default(self, obj)

def isBBoxTypeForCoco(annotationType:AnnotationTypes):
    # bbox : [x,y,width,height],
    bboxTypes = [AnnotationTypes.BBox]
    if annotationType in bboxTypes:
        return True
    
    return False

def isSegmentationTypeForCoco(annotationType:AnnotationTypes):        
    # segmentation : [polygon]
    segmentationTypes = [AnnotationTypes.Polygon, AnnotationTypes.Polygon.Segmentation]
    if annotationType in segmentationTypes:
        return True
    
    return False

# add keypoint
def isKeypointTypeForCoco(annotationType:AnnotationTypes):
      # keypoint : [x1,y1,v1,x2,y2,v2,....]
    keyPointTypes = [AnnotationTypes.KeyPoint]
    if annotationType in keyPointTypes:
        return True

def isHumanTypeForCoco(annotationType:AnnotationTypes):
      # keypoint : [x1,y1,v1,x2,y2,v2,....]
    HumanTypes = [AnnotationTypes.Human]
    if annotationType in HumanTypes:
        return True

def getInfoForCoco(project_id) -> dict:
    today = date.today()
    info = {
    "description": "SSLO Custom Dataset",
    "url": "http://sslo.ai",
    "version": "1.0",
    "year": today.year,
    "date_created": str(today.year)+"/"+str(today.month)+"/"+str(today.day)
    }
    
    return info

def getImagesForCoco(project_id, tasks:list[Task], isUseDataDir, dataDir) -> list:
    """_coco format images _

    Args:
        project_id (_type_): _description_

    Returns:
        list: _description_
    """
    
    # convert to coco image format
    cocoImages = []
    for task in tasks:
        
        item = {}
        if isinstance(task._task_detail, ImageDetail): 
            imageDetail:ImageDetail = task._task_detail
            # id
            item["id"] = task._task_id
            # license
            if imageDetail._image_license_id is not None:
                item["license"] = imageDetail._image_license_id
            # file_name
            item["file_name"] = getImageFilenameForAnnotation(project_id, imageDetail._image_file, isUseDataDir, dataDir)                
            # height
            item["height"] = imageDetail._image_height
            # width
            item["width"] = imageDetail._image_width
            
            # size
            item["size"] = imageDetail._image_size            
            # created
            item["created"] = imageDetail._created            
            # updated
            item["updated"] = imageDetail._updated
            #md5
            item["md5"] = imageDetail._image_md5
            
            # 
            cocoImages.append(item)
    
    return cocoImages
    
def convertSSLOAnnotation(project_id, task_id, annotationType:AnnotationTypes, cocoAnnotation) -> Annotation:
    """_convert SSLO Annotation from cocoData_
    
    Args:
        cocoAnnotation (dict): 
        {
            'id' : ... ,
            'image_id' : ... ,
            'category_id' : ... ,
            'bbox' : [ ... ],
            'area' : ... ,
            'segmentation' : [ ... ] ,
            'iscrowd' : 0,
            'keypoints' : [ ... ] , --> 20230130 add
            'num_keypoints' : ... --> 20230130 add
        }
             
    Raises:
        ArgsException: _description_

    Returns:
        dict: _description_
    """
    

    category_id = cocoAnnotation.get("category_id")
    score = cocoAnnotation.get("score")
    
    annotationData = []
    if isBBoxTypeForCoco(annotationType):
        annotationData = cocoAnnotation.get("bbox")
    elif isSegmentationTypeForCoco(annotationType):
        annotationData = cocoAnnotation.get("segmentation")
    elif isKeypointTypeForCoco(annotationType):
        annotationData = cocoAnnotation.get("keypoints")
    elif isHumanTypeForCoco(annotationType):
        annotationData.append({"bbox":cocoAnnotation.get("bbox")})
        annotationData.append({"segmentation":cocoAnnotation.get("segmentation")})
        annotationData.append({"keypoints":cocoAnnotation.get("keypoints")})
        annotationData.append({"num_keypoints":cocoAnnotation.get("num_keypoints")})
    else:
        raise ArgsException(f"Not Supported sslo_annotation_type({annotationType})")            
    
    data = {}
    # get task id from incase it's list type(batch inference)
    if type(task_id) == list:
        tasks = serviceTask.getTasks(project_id,task_id)
        image_id = cocoAnnotation.get("image_id")
        for task in tasks:
            if image_id == task.task_name +"_0":
                # task_id per annotation data for batch inference  
                data["task_id"] = task.task_id
                break
               
    # annotation_type_id
    data["annotation_type_id"] = annotationType.value
    # annotation_category_id
    data["annotation_category_id"] = category_id
    # annotation_data
    data["annotation_data"] = annotationData
    # annotation_score
    data["annotation_score"] = score
        
    return parseAnnotation(project_id, data)

def get_bbox(segmentation):
    x = segmentation[0::2]
    y = segmentation[1::2]
    xmin = min(x)
    ymin = min(y)
    xmax = max(x)
    ymax = max(y)
    return [round(xmin,2), round(ymin,2), round(xmax - xmin,2), round(ymax - ymin,2)] # x,y,w,h  
            
def convertCocoAnnotation(project_id, annotation:Annotation) -> dict:
    
    # annotationType
    annotationType = AnnotationTypes(annotation._annotation_type.annotation_type_id)
    
    cocoAnnotation = {}
    
    # id : int
    cocoAnnotation["id"] = annotation._annotation_id
    
    # image_id : int 
    cocoAnnotation["image_id"] = annotation._task_id
    
    # category_id : int 
    cocoAnnotation["category_id"] = annotation._annotation_category._annotation_category_id
    
    # type id ( sslo )
    # cocoAnnotation["type_id"] = annotation._annotation_type.annotation_type_id
    
    
    # bbox : [x,y,width,height],    
    if isBBoxTypeForCoco(annotationType):
        cocoAnnotation["bbox"] = annotation._annotation_data
        cocoAnnotation["segmentation"] = []
    
    # segmentation : [polygon]
    if isSegmentationTypeForCoco(annotationType):
        cocoAnnotation["segmentation"] = [annotation._annotation_data]
        cocoAnnotation["bbox"] = get_bbox(annotation._annotation_data)
    
    # iscrowd : 0
    cocoAnnotation["iscrowd"] = 0
    
    # todo - 추가할 예정
    # area : float

    # keypoints : [x1,y1,v1,...]        
    # num_keypoints : int
    if isKeypointTypeForCoco(annotationType):
        cocoAnnotation["keypoints"] = annotation._annotation_data
        cocoAnnotation["num_keypoints"] = len([v for v in annotation._annotation_data[2::3] if v !=0])
        
    # scores : [int] 
    """
    annotation json file for export task doesn't need score attribute   
    """
    # cocoAnnotation["score"] = annotation.score 
    
    return cocoAnnotation

def findCategoryPredefined(startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER):
    annotation_category_predefined =  Table("annotation_category_predefined")
    query = Query.from_(annotation_category_predefined).where(annotation_category_predefined.annotation_category_name == "person" ) 
    querySelect = query.select("annotation_category_keypoint","annotation_category_skeleton")
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order)
    results = DatabaseMgr.select(querySelect)
    return results


def getCategoriesForCoco(project_id,tasks,filter_category_ids=None):
    
    project = serviceProject.getProject(project_id)
    
    if project is None:
        raise ArgsException(f"getCategoriesForCoco(project_id : {project_id}) is None, check system", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    cocoCategories = []
    
    detail:ProjectDetailProcessing = project._project_detail
    for c in detail._project_categories:        
        cocoCategory = {}
        # "id": int, 
        cocoCategory["id"] = c._annotation_category_id
        if filter_category_ids is not None and c._annotation_category_id not in filter_category_ids:
            continue                
        
        # "name": str, 
        cocoCategory["name"] = c._annotation_category_name
        
        # "supercategory": str,
        supercategory = ""
        if c._annotation_category_parent_id is not None and c._annotation_category_parent_id >= 0:
            parent = getAnnotationCategory(project_id, c._annotation_category_parent_id)
            if parent is not None:
                supercategory = parent._annotation_category_name                
        cocoCategory["supercategory"] = supercategory
                
        cocoCategories.append(cocoCategory)
        
    print("cocoCategories :",cocoCategories)
    # print("c._annotation_category_name :",c._annotation_category_name)

    for task in tasks :
        if "person" in [category["name"] for category in cocoCategories] :
            results = findCategoryPredefined()[0]
            for i in range(len(cocoCategories)) :
                if cocoCategories[i]["name"] == "person":
                    cocoCategories[i]["keypoints"] = results["annotation_category_keypoint"].split(",")
                    cocoCategories[i]["skeleton"] = ast.literal_eval("[" + results["annotation_category_skeleton"] + "]")
        
    return cocoCategories
        
    
def getAnnotationsForCoco(project_id, tasks:list[Task], filter_category_ids, filter_category_attribute_select_or_input_values):
    
    startAt = 0
    maxResults = 1000
    orderBy = "created"
    order = config.toSortOrder("ASC")
    
    licenses = []
    annotations = []
    
    task_ids = [ task.get_id() for task in tasks ]
    
    # for task in tasks:
        
    # search        
    hasNext = True
    while hasNext:
        searchResult = findAnnotationBy(
            project_id=project_id, task_ids=task_ids,
            annotation_category_ids=filter_category_ids, annotation_category_attr_select_or_input_values=filter_category_attribute_select_or_input_values,                 
            startAt=startAt, maxResults=maxResults, orderBy=orderBy, order=order
        )
        
        for data in searchResult._datas:
            cocoAnnotation = convertCocoAnnotation(project_id, data)
            annotations.append(cocoAnnotation)
                
        startAt += maxResults
        hasNext = searchResult._pageinfo._hasNext
            
    return annotations
    
     
def getLicensesForCoco(project_id):
    licenses:list[License] = serviceProject.getLicenses(project_id)
    
    cocoLicenses = []
        
    for item in licenses:
        cocoLicense = {}
        # "id": int, 
        cocoLicense["id"] = item._license_id
        
        # "name": str, 
        cocoLicense["name"] = item._license_name
        
        # "url": str,
        cocoLicense["url"] = item._license_url
        
        cocoLicenses.append(cocoLicense)
        
    return cocoLicenses
                

def getJsonAnnotationsTo(project_id, task_ids:list=None, format:AnnotationFomat=AnnotationFomat.default(), filter_category_ids=None, filter_category_attribute_select_or_input_values=None, isUseDataDir=True, dataDir=None) -> dict:        
        
    project = serviceProject.getProject(project_id)
    if project._project_type.hasAnnotation() == False:
        raise ArgsException(f" Project(id: {project_id}), type(name:{project._project_type._project_type_name}) is not supported annotation ")
                
        
    tasks = serviceTask.getTasks(project_id=project_id, task_ids=task_ids)
    
    if format == AnnotationFomat.COCO:
        cocoDatas = convertCocoFormat(project_id, tasks, filter_category_ids, filter_category_attribute_select_or_input_values, isUseDataDir, dataDir)
        return cocoDatas
        
    else:
        raise ArgsException(f"Format({format.name()}) not supported")
    

def convertCocoFormat(project_id, tasks:list[Task], filter_category_ids, filter_category_attribute_select_or_input_values, isUseDataDir, dataDir) -> dict:
    """_cocodataset format(https://cocodataset.org/#format-data) _

    Args:
        project_id (_type_): _description_

    Returns:
        dict: _description_
        {
        "info": info, "images": [image], "annotations": [annotation], "licenses": [license],
        }
    """
    coco = {
        "info": {}, "images": [], "annotations": [], "licenses": []
    }        
    
    # info
    coco["info"] = getInfoForCoco(project_id)
    
    # images
    coco["images"] = getImagesForCoco(project_id, tasks, isUseDataDir, dataDir)
    
    # categories
    # coco["categories"] = getCategoriesForCoco(project_id,tasks,filter_category_ids)
    # annotation file has to be contain all the categories for training
    coco["categories"] = getCategoriesForCoco(project_id,tasks)
        
    # annotations
    coco["annotations"] = getAnnotationsForCoco(project_id, tasks, filter_category_ids, filter_category_attribute_select_or_input_values)
    
    # licenses
    coco["licenses"] = getLicensesForCoco(project_id)       
    
    return coco