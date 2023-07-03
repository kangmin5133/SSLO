

import requests
import time
from datetime import datetime, timedelta
import paramiko
import json

from log import logger
from utils import DataPathProject
from exception import ArgsException, ExceptionCode
import config
from config import Config
import utils
from service import serviceAnnotation, serviceProject, serviceTask
from config.SSLOEnums import AnnotationTypes, AutoLabelingTypes, AnnotationFomat, WorkStatus

from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct
from service.database import IntegrityError
from model import AiModel

def statusAutolabeling(project_id, task_id):
    """_autolabeling status_
    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
    Returns:
        _type_: _description_
    """            
    
    # todo - 라벨링 필터링
    detectingCategoryIds = {
        "OD" : [0],
        "IS" : [0],
        "SES" : [0]
    }
    
    project = serviceProject.getProject(project_id)
    if project is None:        
        raise ArgsException(f"project(id : {project_id}) is not exist")
    
    task = serviceTask.getTask(project_id, task_id)
    if task is None:        
        raise ArgsException(f"Task(id : {task_id}) is not exist")
    
    if project._project_type.hasImageDetail() == False:
        raise ArgsException(f"task(id:{task_id}) is not support, autolabeling")

    categories = serviceAnnotation.getAnnotationCategories(project_id)
    
    autolabeingStatus = {
        "OD" : { "status" : False },
        "IS" : { "status" : False },
        "SES" : { "status" : False }
    }
    
    if categories is None:
        return utils.toStringWithModel(autolabeingStatus)
    
    vals = categories.values()
    if vals is None:
        return utils.toStringWithModel(autolabeingStatus)
    
    ids = [ c.get_id() for c in categories.values() ]
    if ids is None:
        return utils.toStringWithModel(autolabeingStatus)
    
    
    #status 
    for key in autolabeingStatus.keys():

        catIds = detectingCategoryIds.get(key)
        intersectionIds = set(catIds) & set(ids)
        autolabeingStatus.get(key).update({
            "status" : len(intersectionIds) == len(catIds)
        })
   
    return utils.toStringWithModel(autolabeingStatus)

def autolabeling(project_id, task_id, labeling_type:AutoLabelingTypes):
    """_autolabeling_
    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
        labeling_type (_type_): _description_
    Returns:
        _type_: _description_
    """            
    
    # todo - 라벨링 필터링
    # detectingCategoryIds = [0]
    
    project = serviceProject.getProject(project_id)
    if project is None:        
        raise ArgsException(f"project(id : {project_id}) is not exist")
    
    # 라벨링 필터링
    detectingCategoryIds = []
    for cat in project.project_detail.project_categories:
        detectingCategoryIds.append(cat.annotation_category_id)
        # cat.annotation_category_name
    print(f"\n-------------------------------\n detectingCategoryIds : {detectingCategoryIds}\n-------------------------------------\n")
    task = serviceTask.getTask(project_id, task_id)
    if task is None:        
        raise ArgsException(f"Task(id : {task_id}) is not exist")
    
    if project._project_type.hasImageDetail() == False:
        raise ArgsException(f"task(id:{task_id}) is not support, autolabeling")

    # sync data
    syncDatasForAI(project_id)
    
    # ai server
    aiServerUrl = config.getAIServerUrl()
    
    if labeling_type == AutoLabelingTypes.ObjectDetect: 
        annotationType = AnnotationTypes.BBox        
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/OB"        
    elif labeling_type == AutoLabelingTypes.InstanceSegmentation: 
        annotationType = AnnotationTypes.Polygon
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/IS"
    elif labeling_type == AutoLabelingTypes.SemanticSegmentation: 
        annotationType = AnnotationTypes.Segmentation
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/SES"
    elif labeling_type == AutoLabelingTypes.HumanDetection: 
        annotationType = AnnotationTypes.Human
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/HD"          
    else:
        raise ArgsException(f"labeling_type({labeling_type}) is not support autolabeing")
    
    # get confidence level for project_id
    r = DatabaseMgr.select("SELECT model_conf FROM aimodel WHERE project_id=%s",project_id)[0]
    if r is None:
        r = {'model_conf':0.5}
    
    imageFilename = serviceAnnotation.getImageFilenameForAnnotation(project_id,task.task_detail.image_file, isUseDataDir=False)
    response = requests.post(URL, params={"project_id": project_id, "confidence": r.get("model_conf"),"imagefile": imageFilename})
    if response.status_code != 200:
        raise ArgsException(f"API AI Server Error: {response.text}", ExceptionCode(response.status_code))
       
    resultJson = response.json()                
    cocoAnnotations = resultJson.get("annotations")

    if cocoAnnotations is None:
        return []
    
    itemList = []        
    
    # # add for 1222 review - temp 
    person_id = 0
    task_infos = serviceTask.getTasks(project_id)
    for categories in task_infos[0].task_project.project_detail.project_categories:
        if categories.annotation_category_name == "person" or categories.annotation_category_name == "인간" or \
            categories.annotation_category_name == "human" or categories.annotation_category_name == "사람":
            person_id = categories.annotation_category_id
        
    for cocoAnnotation in cocoAnnotations:                     
               
        # todo - filterling (temp)
        category_id = cocoAnnotation.get("category_id")
        if labeling_type == AutoLabelingTypes.HumanDetection: 
            if (category_id == 0) == False:
                continue
        print(f"\n--------------------------\n category_id : {category_id}\n----------------------\n")
        
        
        logger.info(f" cocoAnnotation  : {cocoAnnotation}")
        
        # add for 1222 review - temp 
        # if cocoAnnotation["category_id"] == 0 :
        if labeling_type == AutoLabelingTypes.HumanDetection: 
            cocoAnnotation["category_id"] = person_id 
        else:
            cocoAnnotation["category_id"] = detectingCategoryIds[category_id]  
        item = serviceAnnotation.convertSSLOAnnotation(project_id, task_id, annotationType, cocoAnnotation)
        itemList.append(item)

    return itemList

def autolabelingBatch(project_id, task_ids:list, labeling_type:AutoLabelingTypes,category_ids):
    """_autolabeling_
    Args:
        project_id (_type_): _description_
        task_id (_type_): _description_
        labeling_type (_type_): _description_
    Returns:
        _type_: _description_
    """       
    # todo - 라벨링 필터링
    detectingCategoryIds = [0]
    
    project = serviceProject.getProject(project_id)
    if project is None:        
        raise ArgsException(f"project(id : {project_id}) is not exist")
    
    tasks = serviceTask.getTasks(project_id, task_ids)

    if project._project_type.hasImageDetail() == False:
        raise ArgsException(f"task(id:{task_ids}) is not support, autolabeling")

    # sync data
    syncDatasForAI(project_id)
    
    # ai server
    aiServerUrl = config.getAIServerUrl()
    
    if labeling_type == AutoLabelingTypes.ObjectDetect: 
        annotationType = AnnotationTypes.BBox        
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/OB"        
    elif labeling_type == AutoLabelingTypes.InstanceSegmentation: 
        annotationType = AnnotationTypes.Polygon
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/IS"
    elif labeling_type == AutoLabelingTypes.SemanticSegmentation: 
        annotationType = AnnotationTypes.Segmentation
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/SES"
    elif labeling_type == AutoLabelingTypes.HumanDetection: 
        annotationType = AnnotationTypes.Human
        URL = f"{aiServerUrl}/rest/api/1/ai/inference/HD"            
    else:
        raise ArgsException(f"labeling_type({labeling_type}) is not support autolabeing")
    
    # get confidence level for project_id
    r = DatabaseMgr.select("SELECT model_conf FROM aimodel WHERE project_id=%s",project_id)[0]
    if r is None:
        r = {'model_conf':0.5}

    imageFilenameList=[]
    for task in tasks:
        imageFilenameList.append(serviceAnnotation.getImageFilenameForAnnotation(project_id,task.task_detail.image_file, isUseDataDir=False))
    response = requests.post(URL, params={"project_id": project_id,"confidence": r.get("model_conf"), "imagefileList": str(imageFilenameList),"is_batch":True})
    
    if response.status_code != 200:
        raise ArgsException(f"API AI Server Error: {response.text}", ExceptionCode(response.status_code))
       
    resultJson = response.json()                
    cocoAnnotations = resultJson.get("annotations")

    if cocoAnnotations is None:
        return []
    
    itemList = []
    person_id = 0
    task_infos = serviceTask.getTasks(project_id)
    for categories in task_infos[0].task_project.project_detail.project_categories:
        if categories.annotation_category_name == "person" or categories.annotation_category_name == "인간" or categories.annotation_category_name == "human" \
            or categories.annotation_category_name == "사람":
            person_id = categories.annotation_category_id
        
    for cocoAnnotation in cocoAnnotations:                     
        # todo - filterling (temp)
        category_id = cocoAnnotation.get("category_id")
        if (category_id in detectingCategoryIds) == False:
            continue
        
        logger.info(f" cocoAnnotation  : {cocoAnnotation}")
        
        # add for 1222 review - temp
        if cocoAnnotation["category_id"] == 0 :
            cocoAnnotation["category_id"] = person_id
            
        logger.info(f" cocoAnnotation_category_id  : {cocoAnnotation}")
        item = serviceAnnotation.convertSSLOAnnotation(project_id, task_ids, annotationType, cocoAnnotation)
        
        if item.annotation_category.annotation_category_id in category_ids:
            itemList.append(item)
        else:
            pass

    return itemList

def get_gpu_proc(lines,total_resource = 24268):
    result_list = []
    lines = [ line.strip() for line in lines if line.strip() != '' ]
    for i in range(len(lines)):
        if "GPU   GI   CI" in lines[i]:
            proc_info_index = i
    proc_lines = lines[proc_info_index:-1]
    if "No running processes found" in proc_lines[-1]: 
        return []
    else:
        processes = [proc_lines[3:][i].replace(" ","_").strip("|") for i in range(len(proc_lines[3:]))]
        process_refine = [list(filter(None,process.split("_"))) for process in processes]
        for i in range(len(process_refine)):
            result = {"gpu_id":'',"process_name":'',"gpu_memory_usage":''}
            for j in range(len(process_refine[i])):          
                if j == 0 : result["gpu_id"] = process_refine[i][j]
                elif j == 5 : result["process_name"] = process_refine[i][j]
                elif j == 6 : result["gpu_memory_usage"] = process_refine[i][j]
            result_list.append(result)
        return result_list

def resourceAvailable():
    """_ 각 서버의 gpu resource check _

    Args:
        None
    Returns:
         _type_: _description_
    """
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    host = "210.113.122.196"
    ssh_port_gpu_server = ["2221","2222"]
    username = "tbelldev"
    password = "tbell0518"
    result = {"gpu_server_1":[],"gpu_server_2":[]}
    for port in ssh_port_gpu_server:
        ssh.connect(host,port=port, username=username, password=password)
        stdin, stdout, stderr = ssh.exec_command('nvidia-smi')
        lines = stdout.read().decode().split('\n')
        
        gpu_mem_free_list = []
        gpu_mem_val = []
        [gpu_mem_val.append([item for i, item in enumerate(line.split(" ")) if 'MiB' in item]) for line in lines if "MiB" in line]
        for i in range(len(gpu_mem_val[:2])):
            result_parser = {"id":None,"process":[]}
            result_parser["id"] = i
            result_parser["use"] = gpu_mem_val[i][0]
            result_parser["free"] = str(int(gpu_mem_val[i][1].strip("MiB")) - int(gpu_mem_val[i][0].strip("MiB")))+"MiB"
            gpu_mem_free_list.append(result_parser)
            
        for proc in get_gpu_proc(lines):
            if proc["gpu_id"] == "0":
                proc.pop("gpu_id")
                gpu_mem_free_list[0]["process"].append(proc)

            elif proc["gpu_id"] == "1":
                proc.pop("gpu_id")
                gpu_mem_free_list[1]["process"].append(proc)
        if port == "2221":result["gpu_server_1"] = gpu_mem_free_list
        if port == "2222":result["gpu_server_2"] = gpu_mem_free_list
    ssh.close()
    
    return result

def compute_resources(resource_status, server_num):
    gpu_0 = int(resource_status[f"gpu_server_{server_num}"][0]["use"].strip("MiB")) + int(resource_status[f"gpu_server_{server_num}"][0]["free"].strip("MiB"))
    gpu_1 = int(resource_status[f"gpu_server_{server_num}"][1]["use"].strip("MiB")) + int(resource_status[f"gpu_server_{server_num}"][1]["free"].strip("MiB"))
    gpu_0_free = int(resource_status[f"gpu_server_{server_num}"][0]["free"].strip("MiB"))
    gpu_1_free = int(resource_status[f"gpu_server_{server_num}"][1]["free"].strip("MiB"))
    total = gpu_0 + gpu_1
    free = int(resource_status[f"gpu_server_{server_num}"][0]["free"].strip("MiB")) + int(resource_status[f"gpu_server_{server_num}"][1]["free"].strip("MiB"))
    free_ratio = free / total
    return free_ratio ,gpu_0_free, gpu_1_free

def activateLearning(project_id:int,server_index:int,gpu_index:int,annotationsJson)-> bool:
    """_ 학습이 가능한지 반환한다. 가능하면 True 반환과 동시에 학습이 시작된다. _

    Args:
        project_id (_type_): _description_

    Returns:
        bool: _true : 학습 가능 및 시작._
    """
    param = {"project_id": project_id,"gpu_server":server_index,"gpu_id":gpu_index}
    # sync data
    syncDatasForAI(project_id)
    # get project model config
    r = DatabaseMgr.select("SELECT * FROM aimodel WHERE project_id=%s",project_id)[0]
    if r is None or type(r) == tuple and len(r) == 0:
        raise ArgsException(f"no model config for project_id{project_id}")
    else:  
        model_info:AiModel = AiModel.createFrom(r)
        datas = model_info.toDict()
        model_name = datas.get("model_name")
        if model_name not in Config.MODEL_NAME_PREDEFINED:
            raise ArgsException(f"model_name {model_name} is not supported")
        [datas.pop(i) for i in ["project_id","created","updated"]]
    
    output_filename = f"{config.Config.BASE_DIR}/{config.DIR_IMAGE_PROJECT}/{project_id}/{config.DIR_IMAGE_SOURCE}/{config.ANNOTATION_FILENAME}"
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(annotationsJson, f)
    
    file = open(output_filename, "rb")
   
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/training"
    response = requests.post(URL, params=param, data=datas,files={"file": file})
    return response.json()

def activateLearningStatus(project_id,task_type):
    """_ 학습 중인 컨테이너의 정보를 반환 한다 _

    Args:
        project_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/training/status"
    if task_type == 1:
        task_type = "od"
    elif task_type == 2 or task_type == 3:
        task_type = "seg"
    response = requests.post(URL, params={"project_id": project_id,"task_type":task_type})
    return response.json()

def getAIModelCofig(project_id) -> AiModel:
    """_ project_id의 모델 설정 정보를 반환 한다 _

    Args:
        project_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    r = DatabaseMgr.select("SELECT * FROM aimodel where project_id=%s",project_id)[0]
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        model:AiModel = AiModel.createFrom(r)
        return model
    
def updateAIModelCofig(jsonData) -> AiModel:
    """_ project_id의 모델 설정 정보를 갱신 후 반환 한다 _

    Args:
        project_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    model:AiModel = AiModel.createFrom(jsonData)
    # make query
    table = Table('aimodel')
    query = Query.update(table).where(table.project_id==model._project_id)
    
    # update item 
    updateCount = 0
    updateableColums = ["model_name","model_aug","model_epoch","model_lr","model_conf","model_batch"]
    for col in updateableColums:
        item = jsonData.get(col)
        if item is not None:
            setattr(model, "_"+col, item)
            query = query.set(Field(col), getattr(model, "_"+col))                                    
            
            updateCount += 1
    
    query = query.set(Field('updated'), fn.Now())
    
    if updateCount <= 0:
        raise ArgsException(f"At least 1 item is required for the update.")
                            
    count = DatabaseMgr.update( query )

    return getAIModelCofig(model._project_id)
    
def getModelList(project_id,task_type):
    """_AI 서버 내 모델 레포지토리의 project_id에 해당하는 모델 리스트 반환_

    Args:
        project_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/model/search"
    if task_type == 1:
        task_type = "od"
    elif task_type == 2 or task_type == 3:
        task_type = "seg" 
    response = requests.get(URL, params={"project_id": project_id,"task_type":task_type})
    return response.json()

def getTrainedLog(jsonData):
    """_AI 서버 내 모델 레포지토리의 project_id에 해당하는 모델 학습 로그 반환_

    Args:
        project_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    jsonData["project_id"]
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/model/logs"
    response = requests.get(URL, params={"project_id": jsonData["project_id"],
                                         "task_type":jsonData["task_type"],
                                         "version":jsonData["version"]})
    return response.json()

def getExportableModel(jsonData):
    """_AI 서버 내 모델 레포지토리의 project_id에 해당하는 exportable 모델 경로 반환_

    Args:
        project_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/model/export"
    response_file = requests.post(URL, params={"project_id": jsonData["project_id"],
                                         "task_type":jsonData["task_type"],
                                         "version":jsonData["version"],
                                         "export_type":jsonData["export_type"]})
    return response_file.content

def loadModel(project_id,task_type):
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/model/upload"
    if task_type == 1:
        task_type = "od"
    elif task_type == 2 or task_type == 3:
        task_type = "seg" 
    response = requests.post(URL, params={"project_id": project_id,
                                         "task_type":task_type})
    return response.json()

def unloadModel(project_id,task_type):
    aiServerUrl = config.getAIServerUrl()
    URL = f"{aiServerUrl}/rest/api/1/ai/model/unload"
    if task_type == 1:
        task_type = "od"
    elif task_type == 2 or task_type == 3:
        task_type = "seg" 
    response = requests.post(URL, params={"project_id": project_id,
                                         "task_type":task_type})
    return response.json()

def isUpdatedData(project_id) -> bool:
    """_ 동기화 해야 하는지 체크 _

    Args:
        project_id (_type_): _description_

    Returns:
        bool: _true : 동기화 해야 합니다._
    """
    logger.debug(f"--> isUpdatedData")
   
    return True

def isSyncData(project_id) -> bool:
    """_ 동기화 가능한지 체크 _

    Args:
        project_id (_type_): _description_

    Returns:
        bool: _true : 동기화 가능 _
    """
    
    logger.debug(f"--> isSyncData")
    
    if serviceProject.isWorking(project_id):
        return False
   
    return True


def lockForSyncData(project_id):
    """_동기화를 위한 lock_

    Args:
        project_id (_type_): _description_   
    """
    
    logger.debug(f"--> lockForSyncData")
    
    serviceProject.setWorkStatus(project_id, WorkStatus.Working)
        
    
def unlockForSyncData(project_id):
    """_동기화를 위한 lock_

    Args:
        project_id (_type_): _description_   
    """
    
    logger.debug(f"--> unlockForSyncData")
    
    serviceProject.clearWorkStatus(project_id)

def syncData(project_id):
    """_프로젝트 데이터 동기화_

    Args:
        project_id (_type_): _description_
    """
    
    logger.debug(f"--> syncData")
    
    aiServerRestBaseUrl = config.getAIServerRestBaseUrl()
    
    # query sync data    
    URL = f"{aiServerRestBaseUrl}/ai/sync/searchData?project_id={project_id}"
    
    cocoData = serviceAnnotation.getJsonAnnotationsTo(project_id,format=AnnotationFomat.COCO, isUseDataDir=False)    
    images = cocoData.get("images")
    dirs = [config.DIR_IMAGE_SOURCE, config.DIR_IMAGE_CHANGED]    
    response = requests.post(URL, json={"info": {"dirs":dirs}, "images" : images})
    
    if response.status_code != 200:
        raise ArgsException(f"API AI Server Error: {response.text}", ExceptionCode(response.status_code))
            
    result = response.json()
    logger.info(f"==> result : { result }")
    logger.info(f"==> result update : { result.get('update') }")

    updateList = result.get('update')

    # update 가 없으면
    if updateList is None or len(updateList) == 0:
        return result
    
    # send files
    tag = "image"
    cType = "application/octet-stream"
    sendFiles = []
    for name in updateList:
        imageFilename, _ = DataPathProject.getImageFilepathWithRelPath(project_id, name)
        item = (tag,(name,open(imageFilename,'rb'),cType))
        sendFiles.append(item)
    
    URL = f"{aiServerRestBaseUrl}/ai/sync/syncData?project_id={project_id}"
    
    response = requests.post(URL, files=sendFiles)
    
    # close file
    for i in sendFiles:        
        i[1][1].close()
    
    if response.status_code != 200:
        raise ArgsException(f"API AI Server Error: {response.text}", ExceptionCode(response.status_code))  
    
    return result
    

def syncDatasForAI(project_id) -> list:
    """_ai 학습, 추론을 위한 데이터 동기화 _

    Args:
        project_id (_type_): _description_
    """
    
    
    logger.debug(f"--> syncDatasForAI")
    
    # 동기화 여부 - 데이터 변경 여부
    if isUpdatedData(project_id) == False:
        return False
    
    # wait for work
    # serviceProject.waitForWork(project_id)    
                    
    # sync data
    results = syncData(project_id)
    
    # unlock
    # serviceProject.completeWork(project_id)
    
    return results