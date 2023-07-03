
from werkzeug.datastructures import FileStorage
import zipfile
import io
import os
import json
import numpy as np
import copy
import requests
import cv2
import io
import time

import utils
from utils import DataPathProject, DataPathDataset
from exception import ArgsException, ExceptionCode
import config
from log import logger

from config.SSLOEnums import TaskStep, TaskProgress, AnnotationFomat
from model import PageInfo, SearchResult
from model import User, UserRole, Dataset, Rawdata, Project, ProjectType, Task, TaskType , Comment, TaskStatus, TaskComment, ImageDetail
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct, Order
from service.permission import PermissionMgr
from service import serviceAnnotation, serviceUser, serviceProject, serviceRawdata, serviceDataset
from service.cache import CacheMgr

def getTaskType(task_type_id) -> TaskType:
    """_get_task_type_

    Args:
        task_type_id (_type_): _description_

    Raises:
        ArgsException: _description_

    Returns:
        TaskType: _description_
    """
    table = Table("task_type")
    query = Query.from_(table).select(
        "*"
        ).where(
            table.task_type_id==Parameter('%s')
        )
    query_data = [task_type_id]
    
    result = DatabaseMgr.selectOne(query=query, data=query_data)
    if result is None:
        raise ArgsException(f"task_type({task_type_id}) is not exist", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    return TaskType.createFrom(result)  # type: ignore

def createTaskDetailWithQueryResult(project_id, task_id, task_type_id, queryResult, isRecreateThumbnail=False) -> ImageDetail:
    
    image_name = queryResult.get("image_name")
    if image_name is None:
        raise ArgsException(f"Project({project_id}), Task({task_id}) - task_detail, image_name is missing ", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    image_format = queryResult.get("image_format")
    if image_format is None:
        raise ArgsException(f"Project({project_id}), Task({task_id}) - task_detail, image_format is missing ", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    image_file = queryResult.get("image_file")
    if image_file is None:
        raise ArgsException(f"Project({project_id}), Task({task_id}) - task_detail, imagefile is missing ", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    image_md5 = queryResult.get("image_md5")
    
    image_license_id = queryResult.get("image_license_id")    
        
    return ImageDetail.createFromImage( DataPathProject, project_id, image_name, image_format, image_file, image_license_id, image_md5, isRecreateThumbnail )  

def createTaskWithQueryResult(project_id, queryResult, permission=None, isNeedDetail=True) -> Task:        
    """_ get task from query result _

    Args:
        project_id (_type_): _description_
        queryResult (_type_): _description_
        permission (_type_, optional): _description_. Defaults to None.
        isNeedDetail (bool, optional): _description_. Defaults to True.

    Returns:
        Task: _description_
    """
    
    logger.info(f"===> queryResult : {queryResult}" )
    
    data = {}
    
    # task_id
    task_id = queryResult.get("task_id")
    if task_id is None:
        raise ArgsException(f"Project({project_id}), task_id is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    data["task_id"] = task_id
    
    # task_name
    task_name = queryResult.get("task_name")
    if task_name is None:
        raise ArgsException(f"Project({project_id}), task_name is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    data["task_name"] = task_name
    
    # task_category
    task_category = queryResult.get("task_category")
    if task_category is not None:
        data["task_category"] = task_category
    
    # task_sub_category
    task_sub_category = queryResult.get("task_sub_category")
    if task_sub_category is not None:
        data["task_sub_category"] = task_sub_category
    
    # permission
    if permission is None:
        is_admin, is_project_manager, permission = PermissionMgr.get_permission_task(serviceUser.getCurrentUserID(), project_id, task_id )
    data["task_permission"] = permission
    
    # project 
    project = serviceProject.getProject(project_id)
    if project is None:
        raise ArgsException(f"Project({project_id}) is not exist", ExceptionCode.INTERNAL_SERVER_ERROR)        
    data["task_project"] = project    
        
    # task type
    task_type_id = queryResult.pop("task_type_id")
    if task_type_id is None:
        raise ArgsException(f"Project({project_id}),Task({task_id}) task type is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    task_type = getTaskType(task_type_id)
    if task_type is None:
        raise ArgsException(f"Project({project_id}),Task({task_id}) task type is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)    
    data["task_type"] = task_type
    
    # task_license
    license = None
    license_id = queryResult.get("license_id")
    if license_id is not None:        
        license = serviceAnnotation.getLicense(license_id)    
    data["task_license"] = license
        
    # task_status 
    task_status_step = queryResult.get("task_status_step", None)
    if task_status_step is None:
        raise ArgsException(f"Project({project_id}),Task({task_id}) - task_status_step is wrong", ExceptionCode.INTERNAL_SERVER_ERROR) 
    
    task_status_progress = queryResult.get("task_status_progress")
    if task_status_progress is None:
        raise ArgsException(f"Project({project_id}),Task({task_id}) - task_status_progress is wrong", ExceptionCode.INTERNAL_SERVER_ERROR) 
                
    task_status = TaskStatus(task_status_step, task_status_progress)
    data["task_status"] = task_status
    
    # task_worker
    task_worker = None
    task_worker_id = queryResult.get("task_worker_id")
    if task_worker_id is not None:
        task_worker = serviceUser.getUser(task_worker_id)
        if task_worker is None:
            raise ArgsException(f"Project({project_id}),Task({task_id}) - task_worker is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
        
    data["task_worker"] = task_worker
    
    # task_validator
    task_validator = None
    task_validator_id = queryResult.get("task_validator_id")
    if task_validator_id is not None:
        task_validator = serviceUser.getUser(task_validator_id)
        if task_validator is None:
            raise ArgsException(f"Project({project_id}),Task({task_id}) - task_validator is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
        
    data["task_validator"] = task_validator
    
    # created 
    created = queryResult.get("created")
    if created is not None:
        data["created"] = created
    
    # created 
    updated = queryResult.get("updated")
    if updated is not None:
        data["updated"] = updated
    
    # task_detail
    task_detail = None
    if isNeedDetail:
        if task_type.isNeedDetail():
            
            task_detail = createTaskDetailWithQueryResult(project_id, task_id, task_type_id, queryResult)
            if task_detail is None:
                raise ArgsException(f"Project({project_id}),Task({task_id}) - task_detail is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)            
        
    data["task_detail"] = task_detail            
                        
            
    task = Task.createFrom(data)  # type: ignore
    if isNeedDetail:
        return CacheMgr.storeTask(project_id, task)
    else:
        return task

def getTask(project_id, task_id, isNeedDetail=True, isClearCache=False) -> Task:
    """task 가져오기_

    Args:
        project_id (_type_): _project id_
        task_id (_type_): _description_
        has_detail (_type_): _description_

    Returns:
        Task: _description_
    """  
          
    if isClearCache:
        CacheMgr.updateTask(project_id, task_id)
        
    task = CacheMgr.getTask(project_id, task_id)
    if task is not None:
        return task
          
    query = """
        SELECT t.*,          
        td.image_name, td.image_format, td.image_file,
        
        true as is_viewable,
        IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id , true, false) as is_createable,
        IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id , true, false) as is_deleteable,
        IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id , true, false) as is_exportable,
        IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id or (t.task_worker_id=u.user_id and t.task_status_step=1) or (t.task_validator_id=u.user_id and t.task_status_step=2) , true, false) as is_importable,
        IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id or (t.task_worker_id=u.user_id and t.task_status_step=1) or (t.task_validator_id=u.user_id and t.task_status_step=2) , true, false) as is_editable
        FROM task t
        LEFT JOIN ( 
            SELECT  project_id , task_id
            , GROUP_CONCAT(IF(td.item_name = 'image_name', td.item_val, NULL)) as image_name
            , GROUP_CONCAT(IF(td.item_name = 'image_format', td.item_val, NULL)) as image_format
            , GROUP_CONCAT(IF(td.item_name = 'image_file', td.item_val, NULL)) as image_file
            , GROUP_CONCAT(IF(td.item_name = 'image_md5', td.item_val, NULL)) as image_md5
            FROM task_detail td 
            GROUP BY td.project_id, task_id  
        ) td ON td.project_id = t.project_id AND td.task_id = t.task_id
        LEFT JOIN project p ON p.project_id = t.project_id
        LEFT JOIN user u ON u.user_id = %s
        LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
        LEFT JOIN roles r ON r.role_id = rg.role_id and r.role_name = 'Administrator'
        WHERE t.project_id = %s and t.task_id = %s 
            and (
                rg.role_id IS NOT NULL OR p.project_manager_id=u.user_id OR t.task_worker_id=u.user_id OR t.task_validator_id=u.user_id
            )
        ;
    """
    
    query_data = [ serviceUser.getCurrentUserID(), project_id, task_id]    

    result = DatabaseMgr.selectOne(query, query_data)
    if result is None:
        return None  # type: ignore
       
    is_admin, is_project_manager, permission = PermissionMgr.createPermissionFrom(result)                
    if permission is None:
        return None          # type: ignore
    
    return createTaskWithQueryResult(project_id, result, permission, isNeedDetail)    

def getTasks(project_id, task_ids:list=None) -> list[Task]:
    if task_ids is None:
        startAt = 0
        maxResults = 1000
        orderBy = 'created'
        order = config.toSortOrder("ASC")

        # search
        tasks:list[Task] = []
        hasNext = True
        while hasNext:
            searchResult = findTasksBy(project_id=project_id, has_detail=True, startAt=startAt, maxResults=maxResults, orderBy=orderBy, order=order)
            tasks.extend(searchResult._datas)

            startAt += maxResults
            hasNext = searchResult._pageinfo._hasNext

        return tasks
    else:
        searchResult = findTasksBy(project_id=project_id, task_ids=task_ids, has_detail=True, maxResults=len(task_ids))
        if searchResult is None or searchResult.datas is None:
            raise ArgsException(f"getTasks, task(project id:{project_id}, ids:{task_ids}) is not exist")
        
        # 존재 하지않는 ids 가 있을 경우
        if len(task_ids) != len(searchResult.datas):
            searchIds = [ task.get_id() for task in searchResult.datas ]
            notExistIds = [ _id for _id in task_ids if _id not in searchIds ]        
            raise ArgsException(f"getTasks, project id:{project_id}, task ids:{notExistIds}) is not exist")
        
        return searchResult.datas


def updateTaskStatus(project_id, task_id, task_status_progress, comment_body) -> TaskComment:
    """_update_task_status_

    Args:
        project_id (int): _description_
        task_id (int): _description_
        task_status_progress (int): _description_
        comment_body (_type_): _description_

    Returns:
        _type_: _description_
    """            
    
    task = getTask(project_id, task_id)
    if task is None:
        raise ArgsException(f"Project({project_id}), task({task_id}) is not exist.")
    
    status = task._task_status
    
    statusStepPast = TaskStep(status._task_status_step)
    statusProgressPast = TaskProgress(status._task_status_progress)
    
    statusStep = TaskStep(status._task_status_step)
    statusProgress = TaskProgress(task_status_progress)
    
    statusStepChange = TaskStep(status._task_status_step)
    statusProgressChange = TaskProgress(task_status_progress)
    
    # todo : 상태 갱신 
    
    # 단계 - 작업 
    if statusStepPast == TaskStep.Work:            
        # 미작업
        if statusProgress == TaskProgress.NotYet:           
            pass
        # 진행 중
        elif statusProgress == TaskProgress.Working:
            pass
        # 완료
        elif statusProgress == TaskProgress.Complete:
            statusStepChange = TaskStep.Validate
            statusProgressChange = TaskProgress.NotYet
            pass
        # 반려
        elif statusProgress == TaskProgress.Reject:
            raise ArgsException(f"In this '{statusStep.name}' step, '{statusProgress.name}' progress status.")
        
    # 단계 - 검증
    if statusStepPast == TaskStep.Validate:            
        # 미작업
        if statusProgress == TaskProgress.NotYet:
            pass
        # 진행 중
        elif statusProgress == TaskProgress.Working:
            pass
        # 완료
        elif statusProgress == TaskProgress.Complete:
            # socket emit to client -> client alarm
            pass
        # 반려
        elif statusProgress == TaskProgress.Reject:
            statusStepChange = TaskStep.Work
            statusProgressChange = TaskProgress.Reject                
      
    # 현재 단계-진행상태 comment 조회
    comment = getTaskComment(project_id, task_id, statusStep.value, statusProgress.value)
    
    logger.info(f"===> comment : {comment}")
    
    with DatabaseMgr.openConnect() as connect:
    
        # comment - create 
        if comment is None:
            comment_body = utils.getOrDefault(comment_body)
            if comment_body is not None:            
                comment_id = Comment.createIdInsertWith(connect, comment_body, serviceUser.getCurrentUserID() )
                
                logger.info(f"==> comment_id : {comment_id}")
                
                table = Table("ref_task_comment")
                query = Query.into(table).columns("project_id", "task_id", "task_status_step", "task_status_progress", "comment_id")
                query = query.select(project_id, task_id, statusStep.value, statusProgress.value, comment_id)
                
                DatabaseMgr.updateWithConnect(connect, query)
            
        # comment - update 
        else:
            comment_body = utils.getOrDefault(comment_body, "")
            Comment.updateWith(connect, comment._comment_id, comment_body, serviceUser.getCurrentUserID())
    
    
        # udpate status 
        Task.updateStatus(connect, project_id, task_id, statusStepChange.value, statusProgressChange.value)
        
        connect.commit()        
    
    # update
    CacheMgr.updateTask(project_id, task_id)
    comment = getTaskComment(project_id, task_id, statusStep.value, statusProgress.value)
    status = TaskStatus(statusStepChange.value, statusProgressChange.value)
    
    return  TaskComment(status, comment)    

def getTaskComment(project_id, task_id, task_status_step, task_status_progress) -> Comment:
    """_get task comment_

    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
        task_status_step (_type_): _description_
        task_status_progress (_type_): _description_

    Returns:
        Comment:  _description_
    """            
    
    query = """SELECT c.*
            FROM comment c
            LEFT JOIN ref_task_comment rtc ON rtc.comment_id = c.comment_id
            WHERE rtc.project_id=%s and rtc.task_id=%s and rtc.task_status_step=%s and rtc.task_status_progress=%s"""
    query_data = [project_id, task_id, task_status_step, task_status_progress]
    result = DatabaseMgr.selectOne(query=query, data=query_data)
    if result is None:
        return None  # type: ignore
    # 
    comment_id = result.get("comment_id")
    
    # comment_creator_id
    comment_creator_id = result.pop("comment_creator_id", None)
    if comment_creator_id is not None:
        comment_creator = serviceUser.getUser(comment_creator_id)
        if comment_creator is None:
            raise ArgsException(f"Comment({comment_id}) is wrong(comment_creator)", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        result["comment_creator"] = comment_creator
  
    # comment_updater_id
    comment_updater_id = result.pop("comment_updater_id", None)
    if comment_updater_id is not None:
        comment_updater = serviceUser.getUser(comment_updater_id)
        if comment_updater is None:
            raise ArgsException(f"Comment({comment_id}) is wrong(comment_updater)", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        result["comment_updater"] = comment_updater
            
            
    return Comment.createFrom(result, allowNone=True)  # type: ignore
                
def getTaskData(project_id, task_id) -> tuple:
    """_get task data(image)_

    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
    Returns:
        task: _description_
        task_detail: _description_
        imageFilename: _description_
        thumbnailFilename: _description_
    """
    task = getTask(project_id, task_id)            
    if task is None:
        return None, None, None, None
    
    if task._task_detail is None:
        return task, None, None, None
          
    imageFilename, thumbnailFilename = task._task_detail.getImagePath(DataPathProject, project_id) 
                
    return task, task._task_detail, imageFilename, thumbnailFilename
                                
def exportTask(project_id, task_ids:list, includeData=True, includeAnnotation=True, annoatationFomat=AnnotationFomat.COCO, filter_category_ids:list=None, filter_category_attribute_select_or_input_values:list=None ):
    """_export tasks_

    Args:
        project_id (_type_): _description_
        task_ids (list): _description_

    Returns:
        _type_: _description_
    """    
    
    if task_ids is None or (isinstance(task_ids, list) == False) or len(task_ids) == 0:
        raise ArgsException("export task, task_ids is empty")
    
    if includeData == False and includeAnnotation == False:
        raise ArgsException("export task, At least one must be selected. includeData or includeAnnotation ")
    
    if len(task_ids) > config.MAX_EXPORT_TASK_COUNT:
        raise ArgsException(f"export task, task_ids exceeds limit (limit : {config.MAX_EXPORT_TASK_COUNT})")

    # get tasks
    tasks = getTasks(project_id, task_ids)
    if tasks is None or len(tasks) == 0:
        raise ArgsException("export task, tasks is not exist")
                
    # make zip
    file_folder = io.BytesIO()
    with zipfile.ZipFile(file_folder, 'w') as exportZipfile:
                                
        # includeData
        if includeData:
            for task in tasks:            
                task_detail:ImageDetail = task._task_detail
                if task_detail is None:
                    raise ArgsException(f"export task, task(project id:{project_id}, task id:{task.get_id()}) has not image", ExceptionCode.INTERNAL_SERVER_ERROR)
                        
                imageFilenamePath, _ = DataPathProject.getImageFilepath(project_id, task_detail._image_file)
                imageFile = os.path.join(config.ANNOTATION_DATA_DIR, f"{task_detail._image_name}.{task_detail._image_format}")
                exportZipfile.write(imageFilenamePath, imageFile)                                
        
        # includeAnnotation
        if includeAnnotation:
            
            print(f"taskexport -> type(task_ids):{type(task_ids)},task_ids : {task_ids}")
            
            annotationsJson = serviceAnnotation.getJsonAnnotationsTo(
                project_id=project_id, 
                task_ids=task_ids, 
                format=annoatationFomat, 
                filter_category_ids=filter_category_ids, 
                filter_category_attribute_select_or_input_values=filter_category_attribute_select_or_input_values,
                isUseDataDir=True, dataDir=config.ANNOTATION_DATA_DIR
                )
            exportZipfile.writestr( config.ANNOTATION_FILENAME, data=json.dumps(annotationsJson, ensure_ascii=False))                    
                
            
    file_folder.seek(0)      
    return file_folder
        

def importTaskFromDataset(project_id, dataset_ids:list):
    """_import from dataset_

    Args:
        project_id (_type_): _description_
        dataset_ids (list): _description_

    Returns:
        _type_: _description_
    """
            
    for dataset_id in dataset_ids:
        
        dataset:Dataset = serviceDataset.getDataset(dataset_id)
        
        startAt = 0
        maxResults = config.MAX_TASK_COUNT
        orderBy = 'created'
        order = config.DEFAULT_SORT_ORDER

        dataset_name = None
        dataset_category = None
        dataset_sub_category = None
        rawdata_name = None
        
        searchResult = serviceRawdata.find_rawdatas_by(dataset_id, dataset_name, dataset_category, dataset_sub_category, rawdata_name, startAt, maxResults, orderBy, order )   
        if searchResult.datas is None:
            continue
        
        taskIds = []
        for raw in searchResult.datas:
            rawdata_detail:ImageDetail = raw._rawdata_detail
            imageFilename, _ = rawdata_detail.getImagePath( DataPathDataset,  dataset_id )
            with open(imageFilename, 'rb') as fp:
                fileStorage =  FileStorage(fp, content_type=rawdata_detail.getContentType() )                        
                task_type_id = TaskType.createDefault()._task_type_id
                newTaskIds = createTask(project_id, [fileStorage],  task_type_id, dataset._dataset_category, dataset._dataset_sub_category)
                taskIds.extend(newTaskIds)

        print(f" taskIds : {taskIds} ")
        return taskIds

def importTaskFromProject(project_id,source_project_id, task_ids:list):
    """_import from projects_

    Args:
        project_id (_type_): _description_
        dataset_ids (list): _description_

    Returns:
        _type_: _description_
    """
    if len(task_ids) == 0:
        pass
    else:
        task_infos = getTasks(source_project_id,task_ids = task_ids)
        taskIds = []
        for task_info in task_infos:
            taskdata_detail:ImageDetail = task_info.task_detail
            task_project = str(task_info.task_project.project_id)
            image_file = str(task_info.task_detail.image_file)
            if os.path.exists(config.Config.BASE_DIR + "/project_images/"+ task_project +"/changed/"+ image_file):
                imageFilePath = config.Config.BASE_DIR + "/project_images/"+ task_project +"/changed/"+ image_file
            else:
                imageFilePath = config.Config.BASE_DIR + "/project_images/"+ task_project +"/source/"+ image_file
            with open(imageFilePath, 'rb') as fp:
                fileStorage =  FileStorage(fp,content_type=taskdata_detail.getContentType())
                task_type_id = TaskType.createDefault()._task_type_id
                newTaskIds = createTask(project_id, [fileStorage],task_type_id)
                taskIds.extend(newTaskIds)
        return taskIds

def importTaskFromCrawling(project_id:int,crawling_channel_type:str,
                           crawling_keywords:list,crawling_period_type:int,crawling_limit:int):
    """_import from web crawling images

    Args:
        project_id (_type_): _description_
        crawling_channel_type (str): _description_
        crawling_keywords (list) : _description_
        crawling_period_type(int) : _description_
        crawling_limit(int) : _description_

    Returns:
        _type_: _description_
    """
    CrawlingServerUrl = config.getCrawlingServerUrl()
    url = f"{CrawlingServerUrl}/crawling"
    param = {"crawling_channel_type":str(crawling_channel_type),"crawling_keywords":str(crawling_keywords[0]),"crawling_period_type": str(crawling_period_type),"crawling_limit":str(crawling_limit)}
    if crawling_channel_type not in ["google","naver","daum"]:
        raise ArgsException(f"crawling_channel_type({crawling_channel_type}) is not supported. only 'google','naver','daum' available")
    if crawling_period_type not in [2,3,4]:
        raise ArgsException(f"crawling_period_type({crawling_period_type}) is not supported. only '2:week, 3:month 4:year' available")
    response = requests.get(url,params = param)
    if response.status_code != 200:
        raise ArgsException(f"API Crawling Server Error: {response.text}", ExceptionCode(response.status_code))
    else:
        taskIds = []
        for image_src in response.json():
            image_nparray = np.asarray(bytearray(requests.get(image_src["src"]).content), dtype=np.uint8)
            image = cv2.imdecode(image_nparray, cv2.IMREAD_COLOR)
            encoded_image  = cv2.imencode('.jpg', image)[1]
            BufferedReader = io.BufferedReader(io.BytesIO(encoded_image.tostring()))
            fileStorage =  FileStorage(BufferedReader,"crawling_image_"+str(image_src["idx"])+".jpg",content_type="image/jpg")
            task_type_id = TaskType.createDefault()._task_type_id
            newTaskIds = createTask(project_id, [fileStorage],task_type_id,is_crawling = True)
            taskIds.extend(newTaskIds)
    return taskIds
    

def createTask(project_id, fileStorageList:list, task_type_id, task_category=None, task_sub_category=None,is_crawling = False) -> Task:
    """Task 생성 _

    Args:
        project_id (_type_): _description_
        fileStorage (_type_): _description_
        task_category (_type_): _description_
        task_sub_category (_type_): _description_

    Returns:
        Task: _description_
    """
    
    if fileStorageList == None or len(fileStorageList) == 0:
        raise ArgsException(f"no files")
   
    if len(fileStorageList) > config.MAX_IMAGE_COUNT:
        raise ArgsException(f"Exceeded number of uploaded images")
    
    # file check
    if is_crawling == False:
        for fileStorage in fileStorageList:
            if fileStorage is None == 0:
                raise ArgsException(f"image is wrong(0 byte)")
            
            if DataPathProject.isAllowImageMineType(fileStorage.mimetype) == False:
                raise ArgsException(f"This is an unacceptable file format.({fileStorage.filename})")
   
    #
    project = serviceProject.getProject(project_id)
    if project is None:
        raise ArgsException(f"Project({project_id}) is not exist")
    
    # init dir
    DataPathProject.createDirForImage(project_id)
    
    taskIdList = []
    for fileStorage in fileStorageList: 
        current_file_name = fileStorage.filename
        if "/" in fileStorage.filename :
            fileStorage.filename = current_file_name.split("/")[-1].split("_0")[0]+".JPEG"
        task_id = Task.createIdWithInsert(project_id, fileStorage, None, task_type_id, task_category, task_sub_category)
        taskIdList.append(task_id)
    #     
    return taskIdList


def updateTaskData(project_id, task_id, fileStorage:FileStorage) -> Task:
    """Task Data Update _

    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
        fileStorage (_type_): _description_

    Returns:
        Task: _description_
    """
    
    # file check
    if fileStorage is None == 0:
        raise ArgsException(f"image is wrong(0 byte)")
    
    if DataPathProject.isAllowImageMineType(fileStorage.mimetype) == False:
        raise ArgsException(f"This is an unacceptable file format.(this format : {fileStorage.mimetype})")   
    
    task = getTask(project_id, task_id, isNeedDetail=True)
    Task.updateData(project_id, task_id, fileStorage, task)
        
    return getTask(project_id, task_id, isNeedDetail=True, isClearCache=True)

def deleteTask(project_id, _id) -> Task:
    """Task 삭제 _

    Args:
        task (_type_): _description_

    Returns:
        task: _description_
    """
    
    task = getTask(project_id, _id)    
    if task is None:
        raise ArgsException(f"Project({project_id}), Task({_id}) is not exist")
    
    # todo - delete
    
    query = "DELETE FROM task where project_id = %s and task_id = %s"
    query_data = [project_id, _id]
    
    with DatabaseMgr.openConnect() as connect:
        
        count = DatabaseMgr.updateWithConnect(connect=connect, query=query, data=query_data)
        if count is None or count <= 0 :
            return None  # type: ignore
        
        if task._task_type.isNeedDetail():
            imagefilename_base = task._task_detail._image_file        
            DataPathProject.deleteImage(project_id, imagefilename_base)
            
        connect.commit()        
    
    CacheMgr.updateTask(project_id, _id)
    
    return task

def updateTask(project_id, jsonData) -> Task:
    """Task 갱신 _

    Args:
        recv (_type_): _description_

    Returns:
        Task: _description_
    """
       
    logger.info(f"----> update_task json : {jsonData}")
    
    task_id = jsonData.get("task_id")
    if task_id is None:
        raise ArgsException(f'task_id is missing')

    # 
    task = getTask(project_id, task_id, False )
    if task is None:
        raise ArgsException(f'Project({project_id}), Task({task_id}) is not exist')

    table = Table("task")
    query = Query.update(table).where(
        table.project_id==project_id
    ).where(
        table.task_id==task_id
    )

    #
    updateCount = 0
    
    # task_name
    task_name = jsonData.get("task_name")
    if task_name is not None:
        query = query.set(table.task_name, task_name)
        updateCount += 1
    # task_category
    task_category = jsonData.get("task_category")
    if task_category is not None:
        query = query.set(table.task_category, task_category)
        updateCount += 1
    # task_sub_category
    task_sub_category = jsonData.get("task_sub_category")
    if task_sub_category is not None:
        query = query.set(table.task_sub_category, task_sub_category)
        updateCount += 1
    # license_id
    license = jsonData.get("task_license")
    if license is not None:
        license_id = license.get("license_id")
        if license_id is None:
            raise ArgsException(f"license_id is missing.")
        
        logger.info(f" license_id : {license_id} ")
        
        license = serviceAnnotation.getLicense(license_id)
        if license is None:
            raise ArgsException(f"License({license_id}) is not exist.")
        
        query = query.set(table.license_id, license_id)
        updateCount += 1
    # task_worker_id
    task_worker = jsonData.get("task_worker")
    if task_worker is not None:
        task_worker_id = task_worker.get("user_id")
        if task_worker_id is None:
            raise ArgsException(f"task_worker - user_id is missing.")
        task_worker = serviceUser.getUser(task_worker_id)
        if task_worker is None:
            raise ArgsException(f"task_worker - User({task_worker_id}) is not exist.")
    
    elif task_worker is None:
        task_worker_id = None

    query = query.set(table.task_worker_id, task_worker_id)
    updateCount += 1
    # task_validator_id
    task_validator = jsonData.get("task_validator")
    if task_validator is not None:
        task_validator_id = task_validator.get("user_id")
        if task_validator_id is None:
            raise ArgsException(f"task_validator _id is missing.")
        task_validator = serviceUser.getUser(task_validator_id)
        if task_validator is None:
            raise ArgsException(f"task_validator _id({task_validator_id}) is not exist.")
    elif task_validator is None:
        task_validator_id = None
        
    query = query.set(table.task_validator_id, task_validator_id)
    updateCount += 1
        
    # update
    if updateCount <= 0:
        raise ArgsException(f"At least 1 item is required for the update.")    
    query = query.set(Field('updated'), fn.Now())
    
    DatabaseMgr.update( query )    
    
    return getTask(project_id, task_id, False, isClearCache=True )

def findTasksBy(project_id=None, task_name=None, task_worker_id=None, task_validator_id=None, task_worker_id_or_validator_id=None, task_status_step=None, task_status_progress=None,
                  created_start=None, created_end=None, updated_start=None, updated_end=None, task_ids:list=None,  has_detail=False,
                  startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER,                   
                  isMy=False) -> SearchResult:
    """_Task Search_

    Args:
        project_id (_type_): _description_
        task_name (_type_): _description_
        task_worker (_type_): _description_
        task_validator (_type_): _description_
        task_worker_or_validator (_type_): _description_
        task_status_step (_type_): _description_
        task_status_progress (_type_): _description_        
        created_start (_type_): _description_
        created_end (_type_): _description_
        updated_start (_type_): _description_
        updated_end (_type_): _description_

    Returns:
        SearchResult: _description_
    """
    
    table_task_detail = Table("task_detail")
    query_sub = Query.from_(table_task_detail).groupby(table_task_detail.project_id, table_task_detail.task_id).select(
        "project_id" , "task_id"
        ,GroupConcat( Case().when(table_task_detail.item_name=='image_name', table_task_detail.item_val).else_(None) ).as_('image_name')
        ,GroupConcat( Case().when(table_task_detail.item_name=='image_format', table_task_detail.item_val).else_(None) ).as_('image_format')
        ,GroupConcat( Case().when(table_task_detail.item_name=='image_file', table_task_detail.item_val).else_(None) ).as_('image_file')
    )
    
    table_project = Table("project")
    table_user = Table("user")
    table_roles_globals = Table("roles_globals")
    table_roles = Table("roles")
    
    # make query
    table_task = Table("task")
    query = Query.from_(table_task).left_join(query_sub).on( 
        (query_sub.project_id == table_task.project_id) & (query_sub.task_id == table_task.task_id)  
    ).left_join(table_project).on(
        table_project.project_id == table_task.project_id
    ).left_join(table_user).on(
        table_user.user_id == serviceUser.getCurrentUserID()
    ).left_join(table_roles_globals).on(
        table_roles_globals.user_id == table_user.user_id
    ).left_join(table_roles).on(
        (table_roles.role_id == table_roles_globals.role_id) & (table_roles.role_name == 'Administrator')
    ).where(
        ( table_roles_globals.user_id == table_user.user_id ) | (table_project.project_manager_id==table_user.user_id) | (table_task.task_worker_id==table_user.user_id) | (table_task.task_validator_id==table_user.user_id)
    )
    
    
    # where
    if project_id is not None:
        query = query.where(table_task.project_id == project_id )    
    if task_name is not None:
        query = query.where(table_task.task_name.like(f"%{task_name}%") )
    if task_worker_id is not None:
        query = query.where(table_task.task_worker_id.like(f"%{task_worker_id}%") )
    if task_validator_id is not None:
        query = query.where(table_task.task_validator_id.like(f"%{task_validator_id}%") )
    if task_worker_id_or_validator_id is not None:
        query = query.where(table_task.task_validator_id.like(f"%{task_worker_id_or_validator_id}%") |  table_task.task_worker_id.like(f"%{task_worker_id_or_validator_id}%"))
    if task_status_step is not None:
        query = query.where(table_task.task_status_step == task_status_step )
    if task_status_progress is not None:
        query = query.where(table_task.task_status_progress == task_status_progress )
    if created_start is not None:
        query = query.where(table_task.created >= utils.toDateTimeFrom(created_start) )
    if created_end is not None:
        query = query.where(table_task.created <= utils.toDateTimeFrom(created_end) )
    if updated_start is not None:
        query = query.where(table_task.updated >= utils.toDateTimeFrom(updated_start) )
    if updated_end is not None:
        query = query.where(table_task.updated <= utils.toDateTimeFrom(updated_end) )
    if task_ids is not None:
        query = query.where(table_task.task_id.isin(task_ids) )
                
    # where my
    if isMy:
        user_id = serviceUser.getCurrentUserID()
        query = query.where( (table_task.task_validator_id == user_id) | (table_task.task_worker_id == user_id) )            
    
    # count
    queryCount = query.select( fn.Count(Distinct(table_task.task_id)).as_("totalResults") )
    print("queryCount from findTasksBy:",queryCount)
    
    countResult = DatabaseMgr.selectOne(queryCount)
    if countResult is None:
        totalResults = 0
    else :
        totalResults = DatabaseMgr.selectOne(queryCount).get("totalResults")     
    
    # select
    querySelect = query.select(
        "task_id", "task_type_id", "task_name", "task_category", "task_sub_category", "license_id", "task_worker_id", "task_validator_id", "task_status_step", "task_status_progress", "created", "updated",
        query_sub.image_name, query_sub.image_format, query_sub.image_file 
    )            
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order)       
        
        
    results = DatabaseMgr.select(querySelect)    
    search_tasks = []
    for r in results:        
        task = createTaskWithQueryResult(project_id, r, None, has_detail)            
        search_tasks.append(task)
    
    return SearchResult.create(search_tasks, startAt=startAt, totalResults=totalResults, maxResults=maxResults)  # type: ignore




