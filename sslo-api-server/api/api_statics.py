"""
#Statics
Version : 1
"""
  
import inject
import json
from flask import Flask, request, Blueprint, send_file
from flask.wrappers import Response
import utils
import datetime
import os

from api.api_auth import login_required

from config.SSLOEnums import CreatedOrUpdated
from exception import ArgsException, ExceptionCode
from model import SearchResult, PageInfo
from model import Task, TaskType, User, UserRole, Task, Comment, CommentEmpty, Annotation
import config
from service import serviceStatics, serviceUser
from service.permission import PermissionMgr

bp_statics = Blueprint('statics', __name__)


app = inject.instance(Flask)


@bp_statics.route('/project/task', methods=['GET'])
@login_required()
def staticsProjectTask():
    """
    ### 프로젝트 작업 통계 조회

> GET /rest/api/1/statics/project/task

프로젝트 작업 통계 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
     | Item | Desc | Required | type |
| --- | --- | --- | --- |
| project_id | 프로젝트 id | y | <Project>.project_id |
| createdOrUpdated | 날짜 기준 | n | 1: 생성일, 2: 업데이트일, default: 1 |
| start | 날짜 기준 start   | n | integer (날짜 - 시간은 무시)|
| end | 날짜 기준 end | n | integer (날짜 - 시간은 무시) |
| end | 날짜 기준 end | n | integer (날짜 - 시간은 무시) |
- Response
    
    **Content type : application/json**
    
    Data : <StaticsTaskStep>
    
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

    
    if PermissionMgr.check_permission_statics_view(serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
            
    start = utils.getOrDefault(request.args.get('start', type=int))
    end = utils.getOrDefault(request.args.get('end', type=int))
    
    try:
        createOrUpdated = CreatedOrUpdated(request.args.get('createdOrUpdated', type=int, default=CreatedOrUpdated.created.value))
    except ValueError as e:        
        raise ArgsException(str(e))
                                
    statics = serviceStatics.getStaticsProjectTask(project_id, start, end, createOrUpdated)
    if statics is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics))


@bp_statics.route('/project/task/day', methods=['GET'])
@login_required()
def staticsProjectTaskByDay():
    """
    ### 프로젝트 작업 일별 통계 조회

> GET /rest/api/1/statics/project/task/day

프로젝트 작업 통계 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    | Item | Desc | Required | type |
| --- | --- | --- | --- |
| project_id | 프로젝트 id | y | <Project>.project_id |
| createdOrUpdated | 날짜 기준 | n | 1: 생성일, 2: 업데이트일, default: 1 |
| start | 날짜 기준 start   | n | integer (날짜 - 시간은 무시) |
| end | 날짜 기준 end | n | integer (날짜 - 시간은 무시) |
- Response
    
    **Content type : application/json**
    
    Data : <StaticsTaskByDay>[]
    
    ```python
    [
    {
    }
    ]
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
    
    if PermissionMgr.check_permission_statics_view(serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)        

    startBeforeDays = utils.getOrDefault(request.args.get('startBeforeDays', type=int))   
                
    statics = serviceStatics.getStaticsProjectTaskByDay(project_id, startBeforeDays, CreatedOrUpdated.updated, isMy=False)

    if statics is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics))


@bp_statics.route('/project/task/user', methods=['GET'])
@login_required()
def staticsProjectTaskByUser():
    """
    ### 프로젝트 작업 작업자별 통계 조회

> GET /rest/api/1/statics/project/day

프로젝트 사용자별 작업 통계 가져온다 
>

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
     | Item | Desc | Required | type |
| --- | --- | --- | --- |
| project_id | 프로젝트 id | y | <Project>.project_id |
| createdOrUpdated | 날짜 기준 | n | 1: 생성일, 2: 업데이트일, default: 1 |
| start | 날짜 기준 start   | n | integer (날짜 - 시간은 무시) |
| end | 날짜 기준 end | n | integer (날짜 - 시간은 무시) |
- Response
    
    **Content type : application/json**
    
    Data : <StaticsTaskByDay>[]
    
    ```python
    [
    {
    }
    ]
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
    
    if PermissionMgr.check_permission_statics_view(serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)     
    
    start = utils.getOrDefault(request.args.get('start', type=int))
    end = utils.getOrDefault(request.args.get('end', type=int))
    
    try:
        createOrUpdated = CreatedOrUpdated(request.args.get('createdOrUpdated', type=int, default=CreatedOrUpdated.created.value))
    except ValueError as e:        
        raise ArgsException(str(e))    
    
    
    user_id = utils.getOrDefault(request.args.get('user_id'))
                
    statics = serviceStatics.getStaticsProjectTaskByUser(project_id, start, end, createOrUpdated, user_id)
    if statics is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics))

@bp_statics.route('/project/task/category', methods=['GET'])
@login_required()
def staticsProjectCategory():
    """
    ### 프로젝트 클래스 통계 조회

> GET /rest/api/1/statics/project/task/category

프로젝트 category  통계 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
- Response
    
    **Content type : application/json**
    
    Data : <StaticsProjectClass>[]
    
    ```python
    
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
    
    if PermissionMgr.check_permission_statics_view(serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
                
    statics = serviceStatics.getStaticsProjectCategory(project_id)
    if statics is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics))


@bp_statics.route('/project/my/task', methods=['GET'])
@login_required()
def staticsProjectMyTask():
    """
    ### 프로젝트 My 작업 통계 조회

> GET /rest/api/1/statics/project/my/task

프로젝트 작업 통계 가져온다
> 

Permissions : LogginedUser

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****    
    
    | Item | Desc | Required | type |
| --- | --- | --- | --- |
| project_id | 프로젝트 id | y | <Project>.project_id |
| createdOrUpdated | 날짜 기준 | n | 1: 생성일, 2: 업데이트일, default: 1 |
| start | 날짜 기준 start   | n | integer (날짜 - 시간은 무시) |
| end | 날짜 기준 end | n | integer (날짜 - 시간은 무시) |
| user_id |  사용자 id | n | <User>.user_id  |

- Response
    
    **Content type : application/json**
    
    Data : <StaticsTaskStep>
    
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
    
    if PermissionMgr.check_permission_statics_view(serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)     
        
    start = utils.getOrDefault(request.args.get('start', type=int))
    end = utils.getOrDefault(request.args.get('end', type=int))
    
    try:
        createOrUpdated = CreatedOrUpdated(request.args.get('createdOrUpdated', type=int, default=CreatedOrUpdated.created.value))
    except ValueError as e:        
        raise ArgsException(str(e))
                    
    statics = serviceStatics.getStaticsProjectTask(project_id, start, end, createOrUpdated, isMy=True)
    if statics is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics))


@bp_statics.route('/project/my/task/day', methods=['GET'])
@login_required()
def staticsProjectMyTaskByDay():
    """
    ### 프로젝트 작업 일별 통계 조회

> GET /rest/api/1/statics/project/task/day

프로젝트 작업 통계 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
     | Item | Desc | Required | type |
| --- | --- | --- | --- |
| project_id | 프로젝트 id | y | <Project>.project_id |
| createdOrUpdated | 날짜 기준 | n | 1: 생성일, 2: 업데이트일, default: 1 |
| start | 날짜 기준 start   | n | integer (날짜 - 시간은 무시) |
| end | 날짜 기준 end | n | integer (날짜 - 시간은 무시) |

- Response
    
    **Content type : application/json**
    
    Data : <StaticsTaskByDay>[]
    
    ```python
    [
    {
    }
    ]
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
    
    if PermissionMgr.check_permission_statics_view(serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)      
        
    startBeforeDays = request.args.get('startBeforeDays',type=int, default=config.SEARCH_DAY_PRIEOD)    
                    
    statics = serviceStatics.getStaticsProjectTaskByDay(project_id, startBeforeDays,CreatedOrUpdated.updated, isMy=True)
    if statics is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics))

    


