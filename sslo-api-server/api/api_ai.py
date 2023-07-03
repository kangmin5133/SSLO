"""
#ai
Version : 1
"""

import json
import ast
import io
import inject
from flask import Flask, request, Blueprint, send_file
from flask.wrappers import Response

from api.api_auth import login_required

from exception import ArgsException, ExceptionCode
from config.SSLOEnums import AutoLabelingTypes
from model import Task
from service import serviceAI, serviceUser, serviceTask, serviceProject, serviceAnnotation
from service.permission import PermissionMgr
from config.SSLOEnums import AnnotationTypes, AnnotationFomat
import config

import utils

bp_ai = Blueprint('ai', __name__)

app = inject.instance(Flask)

@bp_ai.route('/statusAutolabeling', methods=['GET'])
@login_required()
def aiStatusAutoLabeling():
    """
    ### Autolabeing 기능 상태 체크

> GET /rest/api/1/ai/statusAutolabeling

오토 레이블링 기능이 가능한지 체크
> 

Permissions : Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | <Project>.project_id |
- Response
    
    **Content type : application/json**
    
    | Item | Desc |  |  |
    | --- | --- | --- | --- |
    | OD | Object Detect | { "status" : bool } |  |
    | IS | Instance Segmentation | { "status" : bool } |  |
    | SES | Semantic Segmentation | { "status" : bool } |  |
    
    ```jsx
    {
    "OD" : { "status" : True },
    "IS" : { "status" : True },
    "SES" : { "status" : True },
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
    
    if PermissionMgr.check_permission_ai_autolableing( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have autolabeing permission.", ExceptionCode.FORBIDDEN)

    
    autolabeingStatus = serviceAI.statusAutolabeling(project_id, task_id)
          
    return Response(response=str(autolabeingStatus)) 

@bp_ai.route('/autolabeling', methods=['GET'])
@login_required()
def aiAutoLabeling():
    """
    ### 오토 레이블링

> GET /rest/api/1/ai/autolabeling

오토 레이블링을 진행하여 annotation정보를 가져온다
> 

Permissions : Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
    | labeling_type | 자동레이블링 타입 id | n | <AnnotationType>.annotation_type_id, Default : 1:bbox |
- Response
    
    **Content type : application/json**
    
    Data : <Annotation>[]
    
    ```jsx
    [{
    }, {
    } ...
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
    
    task_id = request.args.get('task_id', type=int)
    if task_id is None:
        raise ArgsException(f"task_id is missing")
    
    if PermissionMgr.check_permission_ai_autolableing( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
        raise ArgsException(f"You do not have autolabeing permission.", ExceptionCode.FORBIDDEN)
    
    try:
        labeling_type =  AutoLabelingTypes(request.args.get('labeling_type', type=int, default= AutoLabelingTypes.ObjectDetect.value))
    except ValueError as e:        
        raise ArgsException(str(e))
    
    statics_task = serviceAI.autolabeling(project_id, task_id, labeling_type)
    if statics_task is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(statics_task)) 

@bp_ai.route('/autolabeling/batch', methods=['GET'])
@login_required()
def aiAutoLabelingBatch():
    """
    ### 오토 레이블링 일괄 처리

> GET /rest/api/1/ai/autolabeling/batch

일괄 오토 레이블링을 진행하여 annotation정보를 가져온다
> 

Permissions : Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | task_id | task id | y | Task.task_id |
    | labeling_type | 자동레이블링 타입 id | n | <AnnotationType>.annotation_type_id, Default : 1:bbox |
- Response
    
    **Content type : application/json**
    
    Data : <Annotation>[]
    
    ```jsx
    [{
    }, {
    } ...
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
    
    task_ids = request.args.get('task_ids', type=str)
    task_ids = ast.literal_eval(task_ids)
    if task_ids is None or len(task_ids) == 0:
        raise ArgsException(f"task_ids is missing")
    
    category_ids = request.args.get('category_ids',default=None, type=str)
    if category_ids is not None:
        category_ids = ast.literal_eval(category_ids)
    elif category_ids is None:
        category_ids = [1000]

    for task_id in task_ids:
        if PermissionMgr.check_permission_ai_autolableing( serviceUser.getCurrentUserID(), project_id, task_id ) == False:
            raise ArgsException(f"You do not have autolabeing permission.", ExceptionCode.FORBIDDEN)
    try:
        labeling_type =  AutoLabelingTypes(request.args.get('labeling_type', type=int, default= AutoLabelingTypes.ObjectDetect.value))
    except ValueError as e:        
        raise ArgsException(str(e))

    statics_task = serviceAI.autolabelingBatch(project_id, task_ids, labeling_type,category_ids)
    if statics_task is None:
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    return Response(response=str(statics_task)) 

@bp_ai.route('/resource', methods=['GET'])
@login_required()
def resourceAvailable():
    """
    ### 서버 GPU 리소스 사용량 조회 및 trainable status check

> GET /rest/api/1/ai/resource

GPU가 탑재되어있는 서버의 리소스 사용량 및 학습 가능 상태 정보를 가져온다
> 

Permissions : Task Validator, Task Worker

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    None
    
- Response
    
    **Content type : application/json**
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
    results = serviceAI.resourceAvailable()
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/activelearning/start', methods=['POST'])
@login_required()
def activeLearning():
    """
    ### active learning 시작

> GET /rest/api/1/ai/activelearning/start
    """
    learnngAvailable = False
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    tasks = serviceTask.getTasks(project_id)
    
    resource_status = serviceAI.resourceAvailable()
    server_1_gpu_free_ratio ,server_1_gpu_0_free, server_1_gpu_1_free = serviceAI.compute_resources(resource_status,1)
    server_2_gpu_free_ratio ,server_2_gpu_0_free, server_2_gpu_1_free = serviceAI.compute_resources(resource_status,2)

    max_free_server_ratio = max(server_1_gpu_free_ratio,server_2_gpu_free_ratio)
    server_index = next(i for i, x in enumerate([server_1_gpu_free_ratio,server_2_gpu_free_ratio]) if x == max_free_server_ratio)
    if server_index == 0:
        max_free_gpu = max(server_1_gpu_0_free,server_1_gpu_1_free)
        gpu_index = next(i for i, x in enumerate([server_1_gpu_0_free,server_1_gpu_1_free]) if x == max_free_gpu)
    elif server_index == 1:
        max_free_gpu = max(server_2_gpu_0_free,server_2_gpu_1_free)
        gpu_index = next(i for i, x in enumerate([server_2_gpu_0_free,server_2_gpu_1_free]) if x == max_free_gpu)
    if max_free_server_ratio > 0.3 : 
        learnngAvailable = True
        task_ids = [task.task_id for task in tasks if task.task_status.task_status_step == 2 and task.task_status.task_status_progress == 3]
        if len(task_ids) > 0 :
            annotationsJson = serviceAnnotation.getJsonAnnotationsTo(
                        project_id=project_id, 
                        task_ids=task_ids, 
                        format=AnnotationFomat.COCO,
                        dataDir=config.ANNOTATION_DATA_DIR
                        )
            results = serviceAI.activateLearning(project_id,server_index,gpu_index,annotationsJson)
        else: 
            raise ArgsException(f"no completed label in the project_id:{project_id}")
    else: 
        raise ArgsException("no available resources in server")
    
    
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/activelearning/status', methods=['GET'])
@login_required()
def activeLearningStatus():
    """
    ### active learning 상태 확인

> GET /rest/api/1/ai/activelearning/status
    """
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    task_type = utils.getOrDefault(request.args.get('task_type', type=int))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    results = serviceAI.activateLearningStatus(project_id,task_type)
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/model/config', methods=['GET'])
@login_required()
def getModelConfig():
    """
    ### 프로젝트 당 할당된 ai model 설정 정보 확인

> GET /rest/api/1/ai/model/config
    """
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    result = serviceAI.getAIModelCofig(project_id)
    return Response(response=str(result))

@bp_ai.route('/model/config/update', methods=['POST'])
@login_required()
def updateModelConfig():
    """
    ### 프로젝트 당 할당된 ai model 설정 정보 갱신

> GET /rest/api/1/ai/model/config/update
    """
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
            
    params = request.get_json()
    project_id = params.get('project_id')
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    result = serviceAI.updateAIModelCofig(params)
    return Response(response=str(result))

@bp_ai.route('/model/search', methods=['GET'])
@login_required()
def getModelList():
    """
    ### 프로젝트 당 할당된 ai model 설정 정보 확인

> GET /rest/api/1/ai/model/config
    """
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    task_type = utils.getOrDefault(request.args.get('task_type', type=int))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    result = serviceAI.getModelList(project_id,task_type)
    return Response(response=str(result))

@bp_ai.route('/model/logs', methods=['POST'])
@login_required()
def getModelTrainedLog():
    """
    ### ai model 학습 로그 확인

> GET /rest/api/1/ai/model/logs
    """
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
            
    params = request.get_json()
    project_id = params.get("project_id")
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    result = serviceAI.getTrainedLog(params)
    return Response(response=str(result))

@bp_ai.route('/model/export', methods=['POST'])
@login_required()
def getExportableModel():
    """
    ### ai model export 

> GET /rest/api/1/ai/model/export
    """
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
            
    params = request.get_json()
    project_id = params.get("project_id")
    task_type = params.get("task_type")
    version = params.get("version")
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    result_file = serviceAI.getExportableModel(params)
    file_obj = io.BytesIO(result_file)
    
    return send_file(file_obj,
                     download_name=f"export_{project_id}_{task_type}_v{version}.zip",
                     as_attachment=True,
                     mimetype='application/zip'
                     )

@bp_ai.route('/model/upload', methods=['GET'])
@login_required()
def loadModelInference():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")

    task_type = utils.getOrDefault(request.args.get('task_type', type=int))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    response = serviceAI.loadModel(project_id,task_type)

    return Response(response=str(response))

@bp_ai.route('/model/unload', methods=['GET'])
@login_required()
def unloadModelInference():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")

    task_type = utils.getOrDefault(request.args.get('task_type', type=int))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    response = serviceAI.unloadModel(project_id,task_type)

    return Response(response=str(response))

@bp_ai.route('/sync/syncDatas', methods=['POST'])
@login_required()
def syncData():
    """
    ### 프로젝트 데이터 동기화 (Sync Data)

> GET /rest/api/1/ai/sync/syncDatas
    """        
    project_id = request.args.get('project_id', type=int)                   
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    if PermissionMgr.check_permission_ai_syncData( serviceUser.getCurrentUserID(), project_id ) == False:
        raise ArgsException(f"You do not have syncData permission.", ExceptionCode.FORBIDDEN)
    
    results = serviceAI.syncDatasForAI(project_id)       
    return Response(response=json.dumps(results, ensure_ascii=False))