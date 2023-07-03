import os
from flask import Flask, request, Response, Blueprint, send_file
import json
import ast
import inject
from werkzeug.datastructures import FileStorage

from matplotlib.font_manager import json_load

from exception import ArgsException, ExceptionCode
from service import serviceAI, serviceSyncData
import utils

import config
from config import Config

bp_ai = Blueprint('ai', __name__)

          
@bp_ai.route('/inference/batch', methods=['POST'])
def batchInference():
    task_type = request.args.get('task_type', type=int)
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    confidence = utils.getOrDefault(request.args.get('confidence', type=float))

    images = request.files.getlist("images")

    if len(images) == 0:
        raise ArgsException(f"at leat 1 image file is required")

    result = serviceAI.inferenceBatch(task_type,images,confidence)
    
    if result is None:        
        raise ArgsException(f"inference error") 
    
    print(f" ==> batch Inference result : {result}")
    
    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/training', methods=['POST'])
def activeLearningStart():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    gpu_server = utils.getOrDefault(request.args.get('gpu_server', type=int))
    if gpu_server is None:
        raise ArgsException(f"gpu_server is missing")
    
    gpu_id = utils.getOrDefault(request.args.get('gpu_id', type=int))
    if gpu_id is None:
        raise ArgsException(f"gpu_id is missing")
    
    annotation_file = json.loads(request.files['file'].read().decode('utf-8'))
    output_filename = f"{config.Config.AI_BASE_DIR}/{config.DIR_SYNC_DATA_PROJECT}/{project_id}/{config.DIR_IMAGE_SOURCE}/{config.ANNOTATION_FILENAME}"
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(annotation_file, f)

    model_configs = request.form
    model_config={}
    for k,v in model_configs.items():
        model_config[k] = v

    results = serviceAI.activeLearningStart(project_id=project_id,
                                            model_config = model_config,
                                            gpu_server=1,
                                            gpu_id=0)
    
    if gpu_server == 0:
        results["server"] = "192.168.0.2"
    elif gpu_server == 1:
        results["server"] = "192.168.0.3"
    results["gpu_id"] = gpu_id
    
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/training/status', methods=['POST'])
def activeLearningStatus():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    task_type = request.args.get('task_type', type=str)
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    results = serviceAI.activeLearningStatus(project_id,task_type)
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/model/search', methods=['GET'])
def searchModels():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    task_type = request.args.get('task_type', type=str)
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    results = serviceAI.getModelList(project_id,task_type)
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/model/logs', methods=['GET'])
def getModelTrainLogs():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    task_type = utils.getOrDefault(request.args.get('task_type', type=str))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    version = utils.getOrDefault(request.args.get('version', type=int))
    if version is None:
        raise ArgsException(f"version is missing")
    
    results = serviceAI.getTrainedLog(project_id,task_type,version)
    return Response(response=json.dumps(results, ensure_ascii=False))

@bp_ai.route('/model/export', methods=['POST'])
def getModelExport():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    task_type = utils.getOrDefault(request.args.get('task_type', type=str))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    version = utils.getOrDefault(request.args.get('version', type=int))
    if version is None:
        raise ArgsException(f"version is missing")
    
    export_type = utils.getOrDefault(request.args.get('export_type', type=str))
    if export_type is None:
        raise ArgsException(f"export_type is missing")
    
    zipfile = serviceAI.exportModel(project_id,task_type,version,export_type)
    return send_file(zipfile
                     , download_name=f"export_{project_id}_{task_type}_v{version}.zip",
                     as_attachment=True
                     )

@bp_ai.route('/inference/OB', methods=['POST'])
def inferenceOB():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")

    confidence = utils.getOrDefault(request.args.get('confidence', type=float))

    is_batch = request.args.get('is_batch', default = False,type=bool)

    if is_batch:
        listOfFiles = ast.literal_eval(request.args.get('imagefileList'))
        imagefileList = utils.getOrDefault(listOfFiles)
        if imagefileList is None:
            raise ArgsException(f"imagefileList is missing")
        
        result = serviceAI.inferenceOD(project_id,confidence, listOfFiles, is_batch)
        if result is None:        
            raise ArgsException(f"inference object detecting - bbox error")
    else:  
        imagefile = utils.getOrDefault(request.args.get('imagefile'))
        if imagefile is None:
            raise ArgsException(f"imagefile is missing")

        result = serviceAI.inferenceOD(project_id,confidence, imagefile)
        if result is None:        
            raise ArgsException(f"inference object detecting - bbox error")

    print(f" ==> InferenceOB result : {result}")

    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/inference/IS', methods=['POST'])
def inferenceIS():
   
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    confidence = utils.getOrDefault(request.args.get('confidence', type=float))
    
    is_batch = request.args.get('is_batch', default = False,type=bool)
    if is_batch:
        listOfFiles = ast.literal_eval(request.args.get('imagefileList'))
        imagefileList = utils.getOrDefault(listOfFiles)
        if imagefileList is None:
            raise ArgsException(f"imagefileList is missing")
        result = serviceAI.inferenceIS(project_id,confidence, listOfFiles, is_batch)
        if result is None:        
            raise ArgsException(f"inference IS detecting - IS error")
    else:  
        imagefile = utils.getOrDefault(request.args.get('imagefile'))
        if imagefile is None:
            raise ArgsException(f"imagefile is missing")

        result = serviceAI.inferenceIS(project_id,confidence, imagefile)
        if result is None:        
            raise ArgsException(f"inference IS detecting - IS error")
    
    print(f" ==> inferencePolygon result : {result}")
    
    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/inference/SES', methods=['POST'])
def inferenceSES():
    
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    confidence = utils.getOrDefault(request.args.get('confidence', type=float))
    
    is_batch = request.args.get('is_batch', default = False,type=bool)
    if is_batch:
        listOfFiles = ast.literal_eval(request.args.get('imagefileList'))
        imagefileList = utils.getOrDefault(listOfFiles)
        if imagefileList is None:
            raise ArgsException(f"imagefileList is missing")
        result = serviceAI.inferenceSES(project_id,confidence, listOfFiles, is_batch)
        if result is None:
            raise ArgsException(f"inference SES detecting - SES error")
    else:
        imagefile = utils.getOrDefault(request.args.get('imagefile'))
        if imagefile is None:
            raise ArgsException(f"imagefile is missing")

        result = serviceAI.inferenceSES(project_id,confidence,imagefile)
        if result is None:        
            raise ArgsException(f"inference SES detecting - SES error")
    
    print(f" ==> inferenceSegment result : {result}")
    
    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/inference/HD', methods=['POST'])
def inferenceHD():
   
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))

    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    confidence = utils.getOrDefault(request.args.get('confidence', type=float))
    
    is_batch = request.args.get('is_batch', default = False,type=bool)
    if is_batch:
        listOfFiles = ast.literal_eval(request.args.get('imagefileList'))
        imagefileList = utils.getOrDefault(listOfFiles)
        if imagefileList is None:
            raise ArgsException(f"imagefileList is missing")
        result = serviceAI.inferenceHD(project_id,confidence,listOfFiles, is_batch)
        if result is None:        
            raise ArgsException(f"inference HD detecting - HD error")
    else:  
        imagefile = utils.getOrDefault(request.args.get('imagefile'))
        if imagefile is None:
            raise ArgsException(f"imagefile is missing")

        result = serviceAI.inferenceHD(project_id,confidence,imagefile)
        if result is None:
            raise ArgsException(f"inference HD detecting - HD error")
    
    print(f" ==> inferenceHuman result : {result}")
    
    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/model/upload', methods=['POST'])
def loadModeltoInference():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    task_type = utils.getOrDefault(request.args.get('task_type', type=str))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    result = serviceAI.loadModel(project_id,task_type)
    
    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/model/unload', methods=['POST'])
def unloadModeltoInference():
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    task_type = utils.getOrDefault(request.args.get('task_type', type=str))
    if task_type is None:
        raise ArgsException(f"task_type is missing")
    
    result = serviceAI.unloadModel(project_id,task_type)
    
    return Response(response=json.dumps(result, cls=serviceAI.NumpyEncoder, ensure_ascii=False))

@bp_ai.route('/sync/searchData', methods=['POST'])
def syncSearchData():
   
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    isRemove = request.args.get('isRemove', type=bool, default=True)
    
    if request.is_json == False:
        raise ArgsException(f"data is missing!")     
    
    params = request.get_json()
    
    sameList, updateList, removeList = serviceSyncData.searchSyncData(project_id,  params, isRemove)  
    
    print(f"syncSearchData list : {updateList}")
    
    return Response(response=json.dumps({
        "same" : sameList, 
        "update": updateList,
        "removed": removeList    
        }, ensure_ascii=False))

@bp_ai.route('/sync/syncData', methods=['POST'])
def syncData():
   
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")    
                        
    files = request.files.getlist("image")
    if files is None or len(files) == 0:
        raise ArgsException(f"file(image) is missing")
        
    idList = serviceSyncData.syncData(project_id,  files)  
    
    print(f"syncData idList : {idList}")
    
    return Response(response=json.dumps(idList))