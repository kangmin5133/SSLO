"""
#Task
Version : 1
"""
  
import inject
import json
from flask import Flask, request, Blueprint, send_file
from flask.wrappers import Response
import utils
import datetime
import os
import json
from werkzeug.datastructures import FileStorage

from api.api_auth import login_required

from config.SSLOEnums import TaskStep, TaskProgress, AnnotationFomat
from model import SearchResult, PageInfo
from model import Task, TaskType, User, UserRole, Task, Comment, CommentEmpty, Annotation

from exception import ArgsException, ExceptionCode
from log import logger
import config
from service import serviceTask, serviceUser, serviceAnnotation
from service.permission import PermissionMgr
from service.cache import CacheMgr

bp_task = Blueprint('task', __name__)

app = inject.instance(Flask)

@bp_task.route('', methods=['GET'], strict_slashes=False)
@login_required()
def task():
    """
    ### 작업 조회

> GET /rest/api/1/task

작업 정보를 가져온다
> 

Permissions : Project Owner, Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |

- Response
    
    **Content type : application/json**
    
    Data : <Task>
    
    ```jsx
    {
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")
                  
    # permission
    if PermissionMgr.check_permission_task_view( serviceUser.getCurrentUserID(), project_id, task_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
             
    task = serviceTask.getTask(project_id, task_id)
    if task is None:        
        raise ArgsException(f"task({task_id}) is not exist")
   
    return Response(response=str(task)) 

@bp_task.route('/data', methods=['GET'])
@login_required()
def taskData():
    """
    ### 작업 데이터 조회

> GET /rest/api/1/task/data

작업 데이터(이미지)를 가져온다
> 

Permissions : Project Owner, Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
- Response
    
    **Content type : image/subtype (현재는 image만- image/jpeg,image/png, image/bmp)**
    
    Data : image file
    
    ```jsx
    
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """        
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    # permission
    if PermissionMgr.check_permission_task_view( serviceUser.getCurrentUserID(), project_id, task_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
    
    task, taskDetail, imageFilename, thumbnailFilename = serviceTask.getTaskData(project_id, task_id)
    
    if task is None:        
        raise ArgsException(f"task({task_id}) is not exist")
    
    if task._task_type is None:
        raise ArgsException(f"task({task_id}) - tasktype is null. check system", ExceptionCode.INTERNAL_SERVER_ERROR)
        
    if task._task_type.isNeedDetail() == False:
        raise ArgsException(f"task type({task._task_type._task_type_name}) is not support imageDetail")
   
    if taskDetail is None:
        raise ArgsException(f"task({task_id}), taskDetail is null. check system", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    if imageFilename is None:
        raise ArgsException(f"task({task_id}), image is not exist. check system", ExceptionCode.INTERNAL_SERVER_ERROR)
            
        
    return send_file(imageFilename
                     , mimetype=f"image/{taskDetail._image_format}"
                     , as_attachment=False
                     , download_name=taskDetail._image_name
                     )

@bp_task.route('/data/update', methods=['POST'])
@login_required()
def taskDataUpdate():
    """
   ### 작업 데이터 변경

> POST /rest/api/1/task/data/update

이미지를 upload 해서 작업 이미지를 변경한다
> 

Permissions : Project Owner

Methods : POST

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
    
    **Content type : image/subtype (현재는 image만- image/jpeg,image/png, image/bmp)**
    
    Data: image file
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <Task>
    
    ```jsx
    
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
       
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")     
    
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")     
   
    if request.files is None or len(request.files.keys()) == 0:
        raise ArgsException(f"file is missing") 
                        
    files = request.files.getlist("image")
    if files is None or len(files) == 0:
        raise ArgsException(f"file(image) is missing")

    if len(files) > 1:
        raise ArgsException(f"file(image) is wrong")
    
    file = files[0]
    if isinstance(file, FileStorage) == False :
        raise ArgsException(f"file(image) is wrong")
                   
        
    # permission
    if PermissionMgr.check_permission_task_edit( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)     
   
                
    task = serviceTask.updateTaskData(project_id, task_id, file)
         
    logger.info(f"task : {task}")
    return Response(response=str(task))

@bp_task.route('/create', methods=['POST'])
@login_required()
def taskCreate():
    """
    ### 작업 생성

> POST /rest/api/1/task/create

이미지를 upload 해서 작업을 생성한다
> 

Permissions : Project Owner

Methods : POST

- Request
    
    **Content type : image/subtype (현재는 image만- image/jpeg,image/png, image/bmp)**
    
    Data: image file
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <Task>
    
    ```jsx
    
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
       
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing") 
    
    task_category = utils.getOrDefault(request.args.get('task_category'))
    task_sub_category = utils.getOrDefault(request.args.get('task_sub_category'))
    
    if request.files is None or len(request.files.keys()) == 0:
        raise ArgsException(f"file is missing") 
                        
    files = request.files.getlist("image")
    
    if files is None or len(files) == 0:
        raise ArgsException(f"file(image) is missing")
        
    # permission
    if PermissionMgr.check_permission_task_create( serviceUser.getCurrentUserID(), project_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN) 
    
    task_type_id = TaskType.createDefault()._task_type_id
    task = serviceTask.createTask( project_id, files, task_type_id, task_category, task_sub_category)
         
    logger.info(f"task : {task}")
    return Response(response=str(task))

@bp_task.route('/delete', methods=['DELETE'])
@login_required()
def taskDelete():
    """
    ### 작업 삭제

> DELETE /rest/api/1/task/delete

작업을 삭제한다
> 

Permissions : Project Owner 

Methods : DELETE

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    # permission
    if PermissionMgr.check_permission_task_delete( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have delete permission.", ExceptionCode.FORBIDDEN) 
    
    task = serviceTask.deleteTask(project_id, task_id)   
        
    return Response(response=str(task)) 

@bp_task.route('/update', methods=['POST'])
@login_required()
def taskUpdate():
    """
    ### 프로젝트 정보 변경

> POST /rest/api/1/task/update

프로젝트 정보를 변경한다
> 

Permissions : task Owner

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <task>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data : <task>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")               
    
    if request.is_json == False:
        raise ArgsException(f"task data is missing!")
      
    params = request.get_json()
    if params is None:
        raise ArgsException(f"task data is missing!")
        
    task_id = params.get("task_id")
    if task_id is None:
        raise ArgsException(f"task_id is missing!") 
    
    # permission
    if PermissionMgr.check_permission_task_edit( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN) 
    
    task = serviceTask.updateTask( project_id, params )
    
    return Response(response=str(task)) 

@bp_task.route('/status/update', methods=['POST'])
@login_required()
def taskStatusUpdate():
    """
    ### 작업 진행 상태 변경

> POST /rest/api/1/task/status/update

작업 진행 상태를 변경한다
> 

Permissions : Task Worker, Task Validator

Methods : POST

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | task_id | task id | y | <Task>.task_id |
    
    **Content type : application/json**
    
    Data :  
    
    | name | type | length | desc |
    | --- | --- | --- | --- |
    | task_status_progress | integer |  | 상태 - 3,4 ( 3.완료 4.반려) |
    | comment_body | <Comment>.comment_body |  | 댓글(사유) |
    
    ```jsx
    {
     "task_status_progress" : 4
     , "comment_body" : "사유"
    }
    ```
    
- Response
    
    **Content type : application/json**
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    if request.is_json == False:
        raise ArgsException(f" data is missing!") 
      
    params = request.get_json()
    if params is None:
        raise ArgsException(f"data is missing!")
    
    task_status_progress = params.get("task_status_progress")
    if task_status_progress is None:
        raise ArgsException(f" data is wrong(task_status_progress)!")
    
    comment_body = params.get("comment_body")
    
    # permission
    if PermissionMgr.check_permission_task_edit( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)

    # 검증 - 반려
    taskComment = serviceTask.updateTaskStatus(project_id, task_id, task_status_progress, comment_body)
    task = serviceTask.getTask(project_id, task_id, isNeedDetail=False, isClearCache=True)
    
    return Response(response=str(task)) 

@bp_task.route('/comment/reject', methods=['GET'])
@login_required()
def commentReject():
    """
    ### 작업 반려 사유 조회

> GET /rest/api/1/task/comment/reject

반려 사유 조회
> 

Permissions : Project Owner, Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | task_id | task id | y | <Task>.task_id |
- Response
    
    **Content type : application/json**
    
    Data :  <Comment>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """  
    
    project_id = request.args.get('project_id', type=int)
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    
    # permission
    if PermissionMgr.check_permission_task_view( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
    
    # 검증 - 반려
    task_status_step = TaskStep.Validate
    task_status_progress = TaskProgress.Reject
    comment = serviceTask.getTaskComment(project_id, task_id, task_status_step.value, task_status_progress.value)
   
    if comment is None:       
        return Response() 
    
    return Response(response=str(comment)) 

@bp_task.route('/search', methods=['GET'])
@login_required()
def taskSearch():
    """
    ### 작업 목록  조회

> GET /rest/api/1/task/search

task 리스트를 가져온다
> 

Permissions : LogginedUser

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | task_name | 작업명(이미지 이름) | n | <Task>.task_name |
    | task_worker | task 작업자 id | n | <User>.user_id |
    | task_validator | task 검증자 id | n | <User>.user_id |
    | task_worker_or_validator | task 검증자 id or task 작업자 id | n | <User>.user_id |
    | task_status_step | 작업 단계 - 1,2( 1 :수집,정제,가공  2: 검수)  | n | <TaskStatus>.task_status_step |
    | task_status_progress | 작업 진행 상태 - 1,2,3,4 ( 1:미작업, 2:진행중,가공중 3.완료 4.반려) | n | <TaskStatus>.task_status_progress |
- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Task>[]
    
    ```jsx
    {
    	"pageinfo": {
    		...
    	},
    	"datas" : [
    		{
    			...
    		}
    	]
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='created')
    order = config.toSortOrder(request.args.get('order', default=config.DEFAULT_SORT_ORDER.value))
    
    created_start = utils.getOrDefault(request.args.get('created_start'))
    created_end = utils.getOrDefault(request.args.get('created_end'))
    updated_start = utils.getOrDefault(request.args.get('updated_start'))
    updated_end = utils.getOrDefault(request.args.get('updated_end'))
        
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    
    task_name = utils.getOrDefault(request.args.get('task_name'))
    task_worker = utils.getOrDefault(request.args.get('task_worker'))
    task_validator = utils.getOrDefault(request.args.get('task_validator'))
    task_worker_or_validator = utils.getOrDefault(request.args.get('task_worker_or_validator'))
    task_status_step = utils.getOrDefault(request.args.get('task_status_step'))
    task_status_progress = utils.getOrDefault(request.args.get('task_status_progress'))
    has_detail = request.args.get('has_detail', type=bool, default=True)
    searchResult = serviceTask.findTasksBy(
        project_id=project_id
        , task_name=task_name
        , task_worker_id=task_worker
        , task_validator_id=task_validator
        , task_worker_id_or_validator_id=task_worker_or_validator
        , task_status_step=task_status_step 
        , task_status_progress=task_status_progress
        , created_start=created_start
        , created_end=created_end
        , updated_start=updated_start
        , updated_end=updated_end
        , has_detail=has_detail
        , startAt=startAt, maxResults=maxResults, orderBy=orderBy, order=order
        , isMy=False      
        )

    return Response(response= str(searchResult) )

@bp_task.route('/my', methods=['GET'])
@login_required()
def taskSearchMy():
    """
    ### 내 작업 목록  조회

> GET /rest/api/1/task/my

task 리스트를 가져온다
> 

Permissions : LogginedUser

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | n | <Project>.project_id |
    | task_name | 작업명(이미지 이름) | n | <Task>.task_name |
    | task_worker | task 작업자 id | n | <User>.user_id |
    | task_validator | task 검증자 id | n | <User>.user_id |
    | task_worker_or_validator | task 검증자 id or task 작업자 id | n | <User>.user_id |
    | task_status_step | 작업 단계 - 1,2( 1 :수집,정제,가공  2: 검수)  | n | <TaskStatus>.task_status_step |
    | task_status_progress | 작업 진행 상태 - 1,2,3,4 ( 1:미작업, 2:진행중,가공중 3.완료 4.반려) | n | <TaskStatus>.task_status_progress |
- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Task>[]
    
    ```jsx
    {
    	"pageinfo": {
    		...
    	},
    	"datas" : [
    		{
    			...
    		}
    	]
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='created')
    order = config.toSortOrder(request.args.get('order', default=config.DEFAULT_SORT_ORDER.value))
    
    created_start = utils.getOrDefault(request.args.get('created_start'))
    created_end = utils.getOrDefault(request.args.get('created_end'))
    updated_start = utils.getOrDefault(request.args.get('updated_start'))
    updated_end = utils.getOrDefault(request.args.get('updated_end'))
        
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    
    task_name = utils.getOrDefault(request.args.get('task_name'))
    task_worker = utils.getOrDefault(request.args.get('task_worker'))
    task_validator = utils.getOrDefault(request.args.get('task_validator'))
    task_worker_or_validator = utils.getOrDefault(request.args.get('task_worker_or_validator'))
    task_status_step = utils.getOrDefault(request.args.get('task_status_step'))
    task_status_progress = utils.getOrDefault(request.args.get('task_status_progress'))
    has_detail = request.args.get('has_detail', type=bool, default=True)
        
    searchResult = serviceTask.findTasksBy(
        project_id=project_id
        , task_name=task_name
        , task_worker_id=task_worker
        , task_validator_id=task_validator
        , task_worker_id_or_validator_id=task_worker_or_validator
        , task_status_step=task_status_step 
        , task_status_progress=task_status_progress
        , created_start=created_start
        , created_end=created_end
        , updated_start=updated_start
        , updated_end=updated_end
        , has_detail=has_detail
        , startAt=startAt, maxResults=maxResults, orderBy=orderBy, order=order
        , isMy=True    
        )

    return Response(response= str(searchResult) )

@bp_task.route('/annotation', methods=['GET'], strict_slashes=False)
@login_required()
def annotation():
    """
    ### annotation 조회

> GET /rest/api/1/task/annotation

annotation 조회
> 

Permissions : Project Owner, Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | task_id | task id | y | <Task>.task_id |
    | annotation_id | annotation id | y | <Annotation>.annotation_id |

- Response
    
    **Content type : application/json**
    
    Data : <Task>
    
    ```jsx
    {
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    annotation_id = request.args.get('annotation_id', type=int)
    if annotation_id is None:
        raise ArgsException(f"annotation_id is missing")
                  
    # permission
    if PermissionMgr.check_permission_task_view( serviceUser.getCurrentUserID(), project_id, task_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
             
    task = serviceAnnotation.getAnnotation(project_id, task_id, annotation_id)
    if task is None:        
        raise ArgsException(f"task({task_id}), annotation_id({annotation_id}) is not exist")
   
    return Response(response=str(task)) 

@bp_task.route('/annotation/create', methods=['POST'])
@login_required()
def annotationCreate():
    """
    ### 작업 annotation 생성

> POST /rest/api/1/task/annotation/create

작업 annotation 정보를 생성한다
> 

Permissions : Task Worker, Task Validator

Methods : POST

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
    
    **Content type : application/json**
    
    Data: <Annotation>

    
- Response
    
    **Content type : application/json**
    
    Data: <Annotation>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")        
    
    if request.is_json == False:
        raise ArgsException(f" annotation data is missing!")
    
    params = request.get_json()
                
    # permission
    if PermissionMgr.check_permission_task_edit( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)
        
        
    task = serviceTask.getTask(project_id, task_id)
    if task is None:
        raise ArgsException(f"Project({project_id}), Task({task_id}) is not exist!")
    
    annotation = serviceAnnotation.createAnnotation( project_id, task_id, params)        
        
    return Response(response=str(annotation))

@bp_task.route('/annotation/update', methods=['POST'])
@login_required()
def annotationUpdate():
    """
    ### 작업 annotation 정보 변경

> POST /rest/api/1/task/annotation/update

작업 annotation 정보를 변경한다
> 

Permissions : Task Worker, Task Validator

Methods : POST

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
    
    **Content type : application/json**
    
    Data: <TaskAnnotation>
    
    ```jsx
    
    ```
    
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing")        
    
    if request.is_json == False:
        raise ArgsException(f" annotation data is missing!")         
    params = request.get_json()
    
    if PermissionMgr.check_permission_task_edit( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)     
    
    updated_item = serviceAnnotation.updateAnnotation( project_id, task_id, params )    
    logger.info(updated_item)
    
    return Response(response=str(updated_item)) 

@bp_task.route('/annotation/delete', methods=['DELETE'])
@login_required()
def annotationDelete():
    """
    ### 작업 annotation 삭제

> DELETE /rest/api/1/task/annotation/delete

작업 annotation 정보를 삭제
> 

Permissions : Project Manger, Task Worker, Task Validator

Methods : DELETE

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | task_id | task id | y | <Task>.task_id |
    | annotation_id | annotation id  | y | <Annotation>.annotation_id |
    
    **Content type : application/json**
    
    Data: <Annotation>
    
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)                   
    if task_id is None:
        raise ArgsException(f"task_id is missing") 
    
    annotation_id = request.args.get('annotation_id', type=int)                   
    if annotation_id is None:
        raise ArgsException(f"annotation_id is missing")          
       
    if PermissionMgr.check_permission_task_edit( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)     
    
    delete_item = serviceAnnotation.deleteAnnotation( project_id, task_id, annotation_id )    
    logger.info(delete_item)
    
    return Response(response=str(delete_item)) 

@bp_task.route('/export', methods=['POST'])
@login_required()
def taskExport():
    """
    ### 작업 Export

> POST /rest/api/1/task/export

선택된 작업들 export (export task)
> 

Permissions : Project Owner

Methods : POST

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    |  |  |  |  |
    |  |  |  |  |
    
    **Content type : application/json**
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | source_project_id | export 소스 프로젝트 id | y | <Project>.project_id |
    | task_ids | export 소스 task id list | n | <Task>.task_id   [] |
- Response
    
    **Content type : application/json**
    
    Data: file
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    | 413 | RequestEntityTooLarge |
    """        
    
    
    if request.is_json == False:
        raise ArgsException(f"data is missing!")         
    params = request.get_json()
    
    source_project_id = params.get("source_project_id")
    if source_project_id is None:
        raise ArgsException(f"source_project_id is missing")
    
    task_ids = params.get("task_ids")
    if task_ids is None:
        raise ArgsException(f"task_ids is missing")
    
    include_data = params.get("include_data", True)
    include_annotation = params.get("include_annotation", True)
    try:
        annotation_format = AnnotationFomat[params.get("annotation_format", AnnotationFomat.default().name)]
    except ValueError as e:        
        raise ArgsException(str(e))
    
    filter_category_ids = utils.getOrDefault(params.get("filter_category_ids"))
    filter_category_attribute_select_or_input_values = utils.getOrDefault(params.get("filter_category_attribute_select_or_input_values"))
        
    # permission
    if PermissionMgr.check_permission_task_export( serviceUser.getCurrentUserID(), source_project_id) == False:
        raise ArgsException(f"You do not have export permission.", ExceptionCode.FORBIDDEN)
    
    #
    zipfile = serviceTask.exportTask(
        source_project_id,
        task_ids,
        includeData=include_data,
        includeAnnotation=include_annotation,
        annoatationFomat=annotation_format, 
        filter_category_ids=filter_category_ids, 
        filter_category_attribute_select_or_input_values=filter_category_attribute_select_or_input_values
    )
    return send_file(zipfile
                     , download_name=f"export_{source_project_id}.zip",
                     as_attachment=True
                     )
    
@bp_task.route('/importFromProject', methods=['POST'])
@login_required()
def taskImport():
    """
    ### 작업 Import

> POST /rest/api/1/task/importFromProject

선택된 task들 import (import task)
> 

Permissions : Project Owner

Methods : POST

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    |  |  |  |  |
    |  |  |  |  |
    
    **Content type : application/json**
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | source_project_id | import 소스 프로젝트 id | y | <Project>.project_id |
    | task_ids | export 소스 task id list | y | <Task>.task_id   [] |
- Response
    
    **Content type : application/json**
    
    Data: file
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    | 413 | RequestEntityTooLarge |
    """ 
    
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing") 
    
    if request.is_json == False:
        raise ArgsException(f"data is missing!")         
    params = request.get_json()
    
    if type(params) == list:
        ImportResult = []
        for param in params:
            source_project_id = param.get("source_project_id")
            if source_project_id is None:
                raise ArgsException(f"source_project_id is missing")
            
            task_ids = param.get("task_ids")
            if task_ids is None:
                raise ArgsException(f"task_ids is missing")
            
            Resultlist = serviceTask.importTaskFromProject(project_id,source_project_id,task_ids)
            for re in Resultlist:
                ImportResult.append(re)
        
    else:
        source_project_id = params.get("source_project_id")
        if source_project_id is None:
            raise ArgsException(f"source_project_id is missing")
        
        task_ids = params.get("task_ids")
        if task_ids is None:
            raise ArgsException(f"task_ids is missing")
        
        ImportResult = serviceTask.importTaskFromProject(project_id,source_project_id,task_ids)
    
    return Response(response=str(ImportResult))


@bp_task.route('/annotation/search', methods=['GET'])
@login_required()
def annotationSearch():
    """
    ### 작업 annotation 목록 조회

> GET /rest/api/1/task/annotation

작업 annotation 정보를 가져온다
> 

Permissions : Project Owner, Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
    | task_id | task id | y | <Project>.project_id |
    | annotation_category_id |  | n | <AnnotationCategory>.annotation_category_id |
    | annotation_category_name | 이름 | n | <AnnotationCategory>.annotation_category_name |
    | annotation_type_id | 타입 - 1:bbox, 2:polygon |  | <AnnotationType>.annotation_type_id |
- Response
    
    **Content type : application/json**
    
    Data : <Annotation>[]
    
    ```jsx
    {
    	"pageinfo": {
    		...
    	},
    	"datas" : [
    		{
    			...
    		}
    	]
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    """    
                
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")        
            
    task_id = request.args.get('task_id', type=int)
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    if PermissionMgr.check_permission_task_search( serviceUser.getCurrentUserID(), project_id ) == False:
        raise ArgsException(f"You do not have search permission.", ExceptionCode.FORBIDDEN)    
    
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='updated,created')
    order = request.args.get('order', default=config.toSortOrder("ASC"))
    
    annotation_category_id = request.args.get('annotation_category_id', type=int)
    annotation_category_name = utils.getOrDefault(request.args.get('annotation_category_name'))
    annotation_type_id = request.args.get('annotation_type_id', type=int)          
            

    searchResult = serviceAnnotation.findAnnotationBy(
        project_id=project_id, task_ids=task_id, 
        annotation_category_ids=annotation_category_id, annotation_category_names=annotation_category_name, annotation_type_id=annotation_type_id,
        startAt=startAt, maxResults=maxResults, orderBy=orderBy, order=order
    )
   
    return Response(response=str(searchResult) )



