import json
import os
import zipfile
import io
import datetime
import time
from tqdm import tqdm
from PIL import Image
import numpy as np
from glob import glob
from werkzeug.datastructures import FileStorage
from exception import ArgsException, ExceptionCode
from utils import DataPathProjectSync
import config
from config import Config

import tritonclient.http as httpclient
from tritonclient.utils import InferenceServerException

import sys
sys.path.append("solution_ai_model")

from solution_ai_model.modules.labels import COCO_NAMES
from solution_ai_model.modules.triton_serving import inference, infer_result_filter_conf, infer_result_filter
from solution_ai_model.modules.formatter import coco_format_inverter, coco_format_inverter_batch
from solution_ai_model.active_learning import activeLearning
from solution_ai_model.modules.container_ctl import get_container_list, get_port_usage
from solution_ai_model.modules.resource_manage import model_ctl
from solution_ai_model.modules.model_validation import get_loss

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.int64):
            return int(obj)
        if isinstance(obj, np.float32):
            return float(obj)
        return json.JSONEncoder.default(self, obj)



def getInferenceServerInfo_OD():
    return "sslo.ai", 8836

def getInferenceServerInfo_IS():
    return "sslo.ai", 8837

def getInferenceServerInfo_SES():
    return "sslo.ai", 8837

def getGpuServerDockerSocketInfo_1():
    return Config.GPU_SERVER_1, 2375

def getGpuServerDockerSocketInfo_2():
    return Config.GPU_SERVER_2, 2375


def converInferenceODResultToSSLO(result:dict, classIds:list=[0], confidence:float=0.6):
    """_ Object Detection - Box _

    Args:
        result (dict): _description_
        classIds (list, optional): _description_. Defaults to [0].
        confidence (float, optional): _description_. Defaults to 0.6.

    Returns:
        _type_: _description_
    """
    
    print(f" result : {result} ")
    
    bboxes = result.get("bboxes__0", [])
    classes = result.get("classes__1", [])
    scores = result.get("scores__2", [])
    shape = result.get("shape__3", [])
    
    info = {
        "shape" : shape.tolist()
    }
    
    dataList = []
    for i in range(len(classes)):            
        classId = classes[i]
        
        if classId not in classIds:
            continue
        
        if confidence > scores[i]:
            continue
        
        data = {}                        
        # annotation_id
        # data["annotation_id"] = i
        # annotation_type_id
        data["annotation_type_id"] = 1
        # annotation_category_id
        data["annotation_category_id"] = classes[i]
        # annotation_data
        data["annotation_data"] = bboxes[i].tolist()
        # annotation_score
        data["annotation_score"] = scores[i]
        
        dataList.append(data)    
    
    return json.dumps({
        "info" : info
        , "datas" : dataList
            }, cls=NumpyEncoder)    

def convertCocoFormatToSSLOAnnotations(cocoDatas:list, sslo_annotation_type_id = 2) -> dict:
    """_convert coco format to sslo annotation_

    Args:
        cocoDatas (dict): _description_
            coco format :
            [{'annotations' : [{...}, .. ]}, {'annotations' : [{...}, .. ]} , ... ]
            
            annotations : [{
                 'id' : ... ,
                 'image_id' : ... ,
                 'category_id' : ... ,
                 'bbox' : [ ... ],
                 'area' : ... ,
                 'segmentation' : [ ... ] ,
                 'iscrowd' : 0
             }] , 
             
    Raises:
        ArgsException: _description_

    Returns:
        dict: _description_
    """
    info = {}
    dataList = []
    
    print(f"==> cocoDatas : {cocoDatas}")
               
    for a in cocoDatas.get("annotations"):        
        category_id = a.get("category_id")    
        annotationData = []
        if sslo_annotation_type_id == 1:    # OD - Obejct Detecting
            annotationData = a.get("bbox")
        elif sslo_annotation_type_id == 2:  # Ploygon 
            annotationData = a.get("segmentation")
        elif sslo_annotation_type_id == 3:  # Segment
            annotationData = a.get("segmentation")
        else:
            raise ArgsException(f"Not Supported sslo_annotation_type({sslo_annotation_type_id})")            
                                
        data = {}                
        # annotation_type_id
        data["annotation_type_id"] = sslo_annotation_type_id
        # annotation_category_id
        data["annotation_category_id"] = category_id
        # annotation_data
        data["annotation_data"] = annotationData
        # annotation_score
        # data["annotation_score"] = scores[i]
        
        dataList.append(data) 
           
    
    print(f" dataList : {dataList}") 
    print(f" dataList dumps : {json.dumps(dataList,cls=NumpyEncoder)}") 
    
    return json.dumps({
        "info" : info
        , "datas" : dataList
            }, cls=NumpyEncoder)

def getIoU(boxA, boxB):
    # Get coordinates of intersection rectangle
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    # Calculate area of intersection rectangle
    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)

    # Calculate area of both boxes
    boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1)
    boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1)

    # Calculate IoU (Intersection over Union)
    iou = interArea / float(boxAArea + boxBArea - interArea)

    # Return IoU
    return iou

def inference_triton(project_id, image, confidence, label_type = "bbox",is_human=False):
    # inference using triton serving container , with httpclient 
    
    class_list:list = ["person"]
    
    if label_type == "bbox":
        task_type = "od"
        if is_human:
            model_name = "faster_rcnn"
        else:
            model_name = str(project_id)
        host, port = getInferenceServerInfo_OD()
        pred = inference(model_name,image,task_type,host=host,port=port)
        print(f" ==> pred : {pred} ")
        result = infer_result_filter_conf(pred,task_type,confidence)
        
    elif label_type == "polygon":
        task_type = "seg"
        if is_human:
            model_name = "infer_pipeline"
        else:
            model_name = "infer_pipeline_"+str(project_id)
                
        host, port = getInferenceServerInfo_IS()
        pred = inference(model_name,image,task_type,host=host,port=port)
        print(f" ==> pred : {pred} ")
        result = infer_result_filter_conf(pred,task_type,confidence)
        
    elif label_type == "segment":
        task_type = "seg"
        if is_human:
            model_name = "infer_pipeline"
        else:
            model_name = "infer_pipeline_"+str(project_id) 
        host, port = getInferenceServerInfo_SES()    
        pred = inference(model_name,image,task_type,host=host,port=port)
        print(f" ==> pred : {pred} ")
        result = infer_result_filter_conf(pred,task_type,confidence)
    
    elif label_type == "human":
        # for segmentation & bbox
        model_name = "infer_pipeline"
        task_type = "seg"
        host, port = getInferenceServerInfo_IS()
        pred_seg = inference(model_name,image,task_type,host=host,port=port)
        result_seg = infer_result_filter_conf(pred_seg,task_type,confidence)
        response_data = coco_format_inverter(result_seg)
        # for keypoint
        model_name = "keypoint_rcnn"
        task_type = "keypoint"
        host, port = getInferenceServerInfo_OD()
        pred_keypoint = inference(model_name,image,task_type,host=host,port=port)
        result_keyponit = infer_result_filter_conf(pred_keypoint,task_type,confidence)
        response_keypoint = coco_format_inverter(result_keyponit)
        person_idx_list = []
        [person_idx_list.append(i) for i in range(len(response_data["annotations"])) if response_data["annotations"][i]["category_id"] == 0]
        # print(f"\n------person_idx_list:{person_idx_list}------\n")
        for i in range(len(response_keypoint["annotations"])):
            for idx in person_idx_list:
                boxA = response_data["annotations"][idx]["bbox"] #x,y,w,h
                boxB_corner = response_keypoint["annotations"][i]["bbox"] # x1,y1,x2,y2
                boxB = [boxB_corner[0],boxB_corner[1],boxB_corner[2]-boxB_corner[0],boxB_corner[3]-boxB_corner[1]] #x,y,w,h
                iou = getIoU(boxA,boxB)
                # print(f"\n--------\n i:{i}, idx:{idx},boxA:{boxA},boxB:{boxB},ioU:{iou} \n---------\n")
                if iou > 0.5:
                    response_data["annotations"][idx]["keypoints"] = response_keypoint["annotations"][i]["keypoints"]
                    response_data["annotations"][idx]["num_keypoints"] = response_keypoint["annotations"][i]["num_keypoints"]
        # return result
        return response_data
    
    response_data = coco_format_inverter(result)
    return response_data

def inference_triton_batch(image_list, confidence, label_type = "bbox"):
    # inference using triton serving container , with httpclient 
    
    class_list:list = ["person"]
    result_list = []
    for image in image_list:
        if label_type == "bbox":
            task_type = "od"
            model_name = "faster_rcnn"
            host, port = getInferenceServerInfo_OD()
            pred = inference(model_name,image,task_type,host=host,port=port)
            print(f" ==> pred : {pred} ")
            result = infer_result_filter(pred,task_type,confidence,class_list)
            
        elif label_type == "polygon":
            task_type = "seg"
            model_name = "infer_pipeline"
            host, port = getInferenceServerInfo_IS()
            if type(image) == FileStorage:
                image = image.read()
            pred = inference(model_name,image,task_type,host=host,port=port)
            print(f" ==> pred : {pred} ")
            result = infer_result_filter(pred,task_type,confidence,class_list)
        result_list.append(result)
    
    response_data = coco_format_inverter_batch(result_list,image_list,is_local = True) 
    return response_data

def inference_triton_batch_sslo(project_id, image_list, confidence, label_type = "bbox"):
    # inference using triton serving container , with httpclient 
    
    class_list:list = ["person"]
    result_list = []
    for image in image_list:
        if label_type == "bbox":
            task_type = "od"
            model_name = "faster_rcnn"
            host, port = getInferenceServerInfo_OD()
            pred = inference(model_name,image,task_type,host=host,port=port)
            print(f" ==> pred : {pred} ")
            result = infer_result_filter_conf(pred,task_type,confidence)
            
        elif label_type == "polygon":
            task_type = "seg"
            model_name = "infer_pipeline"
            host, port = getInferenceServerInfo_IS()
            pred = inference(model_name,image,task_type,host=host,port=port)
            print(f" ==> pred : {pred} ")
            result = infer_result_filter_conf(pred,task_type,confidence)
            
        elif label_type == "segment":
            task_type = "seg"
            model_name = "infer_pipeline"
            host, port = getInferenceServerInfo_SES()
            pred = inference(model_name,image,task_type,host=host,port=port)
            print(f" ==> pred : {pred} ")
            result = infer_result_filter_conf(pred,task_type,confidence)
        result_list.append(result)
        
    response_data = coco_format_inverter_batch(result_list,image_list) 
    # return result
    return response_data

def inferenceBatch(task_type:int,image_list:list,confidence:float):
    if task_type == 0:
        cocoDatas = inference_triton_batch(image_list, label_type="bbox", confidence=confidence)
    elif task_type == 1:
        cocoDatas = inference_triton_batch(image_list, label_type="polygon", confidence=confidence)
    return cocoDatas

def inferenceOD(project_id,confidence, imagefile,is_batch=False):

    print(f"==> inferenceOD")
    host, port = getInferenceServerInfo_OD()
    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="bbox", confidence=confidence)
    else:        
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)
        # imagefile = "../sslo-data-ai/projectSync/8/source/000000045596_0.JPEG"
        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        
        cocoDatas = inference_triton(project_id, imagefile, label_type="bbox", confidence=confidence)
            
    print(f"==> cocoDatas : {cocoDatas}")
    
    # return  convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=1)
    return cocoDatas

def inferenceIS(project_id,confidence, imagefile,is_batch=False):

    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="polygon", confidence=confidence)
        
    else:      
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)

        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)

        cocoDatas = inference_triton(project_id, imagefile, label_type="polygon", confidence=confidence )
    
    # return convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=2)
    return cocoDatas

def inferenceSES(project_id,confidence,imagefile,is_batch=False):
    
    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="segment", confidence=confidence)
    else:
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)

        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton(project_id, imagefile, label_type="segment", confidence=confidence)
    
    # return convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=3)
    return cocoDatas

def inferenceHD(project_id,confidence, imagefile,is_batch=False):

    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="human", confidence=confidence)
        
    else:      
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)

        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)

        cocoDatas = inference_triton(project_id, imagefile, label_type="human", confidence=confidence)
    
    # return convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=2)
    return cocoDatas

def activeLearningStart(project_id,model_config,gpu_server=1,gpu_id=1):

    if model_config.get("model_aug") is None:
        aug_iter = 20
    else:
        aug_iter = model_config.get("model_aug")
    
    model_name = model_config.get("model_name")
    epoch = model_config.get("model_epoch")
    lr = model_config.get("model_lr")
    batch_size = model_config.get("model_batch")

    dataset_dir = f"{Config.AI_BASE_DIR}/{config.DIR_SYNC_DATA_PROJECT}/{project_id}/source"
    project_name = project_id
    servable_model_path = "sslo-ai-api-server/solution_ai_model/models_servable/"
    model_repository = "sslo-ai-api-server/solution_ai_model/models_trained/"
    split = 0.7
    device_id = gpu_id
    if gpu_server == 0:
        base_url = 'tcp://192.168.0.2:2375'
    elif gpu_server == 1:
        base_url = 'tcp://192.168.0.3:2375'
    serving_host = "172.17.0.1"
    activeLearning(dataset_dir=dataset_dir,
                   project_name = project_name,
                   servable_model_path = servable_model_path,
                   model_repository = model_repository,
                   split = split,
                   aug_iter = aug_iter,
                   model_name = model_name,
                   epoch = epoch,
                   lr = lr,
                   batch_size = batch_size,
                   device_id = device_id,
                   base_url = base_url,
                   serving_host = serving_host)
    
    return {"container_name":"train_server_"+str(project_id),"train_status":"running"}

def searchModelDirs(project_id,task_type):
    # lv = 0 : no trained & servable model / 1 : only trained model exist / 2 : both exist
    lv = 0
    model_path,model_version = "",""
    model_path_list,model_version_list = [],[]
    # task_type = ["od","seg"]
    model_trained = os.getcwd()+Config.AI_TRAINED_MODEL_REPO+"/"
    model_servable = os.getcwd()+Config.AI_SERVABLE_MODEL_REPO+"/"
    
    if str(project_id) in [ i.split("/")[-1] for i in glob(model_trained+task_type+"/*")]:
        if str(project_id) in [ i.split("/")[-1] for i in glob(model_servable+task_type+"/*")]: 
            lv = 2
            model_path = [ i for i in glob(model_servable+task_type+"/*") if str(project_id) in i][0]
            model_versions = [i.split("/")[-1] for i in glob(model_path+"/*")]
            model_versions.remove("config.pbtxt")
            model_version =  max(list(map(int,model_versions)))

            model_path_list.append(model_path)
            model_version_list.append(model_version)
        
        elif str(project_id) not in [ i.split("/")[-1] for i in glob(model_servable+task_type+"/*")] :
            lv = 1
            model_path = [ i for i in glob(model_trained+task_type+"/*") if str(project_id) in i][0]
            model_version =  max(list(map(int,[i.split("/")[-1] for i in glob(model_path+"/*")])))
            model_path_list.append(model_path)
            model_version_list.append(model_version)
        
    if str(project_id) not in [ i.split("/")[-1] for i in glob(model_trained+task_type+"/*")] and \
        str(project_id) not in [ i.split("/")[-1] for i in glob(model_servable+task_type+"/*")] and lv == 0: 
            lv = 0 
            
    return lv , model_path_list, model_version_list

def getCurrentTrainModel(project_id,task_type):
    model_trained = os.getcwd()+Config.AI_TRAINED_MODEL_REPO+"/"
    # model_servable = os.getcwd()+Config.AI_SERVABLE_MODEL_REPO+"/"
    
    if str(project_id) in [ i.split("/")[-1] for i in glob(model_trained+task_type+"/*")]:
        versions =[i.split("/")[-1] for i in glob(model_trained+task_type+"/"+str(project_id)+"/*")]
        model_version =  max(list(map(int,versions)))
        cur_model_path = model_trained+task_type+"/"+str(project_id)+"/"+str(model_version)        
        return cur_model_path
    else:
        return "none"
        # raise ArgsException(f"project_id {project_id}, task_type {task_type} has no trained or training model")


def activeLearningStatus(project_id,task_type):
    is_training = False
    
    result = {"project_id" : project_id,
              "task_type": task_type,
              "container_name":f"train_server_{project_id}",
              "learning_status":"",
              "result":"",
              "current_serving_version":"",
              "latest_train_version":"",
              "model_upgradable":"",
              "model_path":""}
    
    gpu_1_host,gpu_1_port = getGpuServerDockerSocketInfo_1()
    gpu_2_host,gpu_2_port = getGpuServerDockerSocketInfo_2()
    
    container_dict = {"gpu_server_1":[],"gpu_server_2":[]}
    for i,url in enumerate([(gpu_1_host,gpu_1_port),(gpu_2_host,gpu_2_port)]):
        if i == 0 : container_dict["gpu_server_1"] = get_container_list(base_url = f"tcp://{url[0]}:{url[1]}")
        elif i == 1 : container_dict["gpu_server_2"] = get_container_list(base_url = f"tcp://{url[0]}:{url[1]}")
    
    if len([container_name for server in container_dict for container_name in container_dict[server] \
            if f"train_server_{project_id}" == container_name]) != 0:
        is_training = True

    # get current serving model info
    inference_ports = get_port_usage()    
    for k,v in inference_ports.items():
        if k == f"inference_server_{task_type}":
            host = Config.GPU_SERVER_2
            port = v    
    triton_client = httpclient.InferenceServerClient(url=host+":"+port, verbose=False)
    model_list = triton_client.get_model_repository_index()
    result["current_serving_version"] = "none"
    for model in model_list:
        if model["name"] == str(project_id) and "version" in [k for k,v in model.items()]:
            result["current_serving_version"] = model["version"]
        
    lv , model_path, model_version = searchModelDirs(project_id,task_type)

    cur_model_path = getCurrentTrainModel(project_id,task_type)

    if cur_model_path == "none":
        result["container_name"] = "none"
        result["learning_status"] = "none"
        result["result"] = "none"
        result["current_serving_version"] = "none"
        result["latest_train_version"] = "none"
        result["model_upgradable"] = "none"
        result["model_path"] = "none"
    else:
        if is_training :
            result["learning_status"] = "active"
            result["result"] = "learning"
            result["latest_train_version"] = cur_model_path.split("/")[-1]
            if result["current_serving_version"] == "none":
                result["model_path"] = "none"
                result["model_upgradable"] = "unavailable"
            else:
                result["model_path"] = model_path[0]+"/"+str(model_version[0])
                result["model_upgradable"] = "unavailable"

        elif is_training == False and lv == 0: 
            result["learning_status"] = "inactive"
            result["result"] = "fail"
            result["latest_train_version"] = "none"
            if result["current_serving_version"] == "none":
                result["model_path"] = "none"
                result["model_upgradable"] = "unavailable"
            else:
                result["model_path"] = model_path[0]+"/"+str(model_version[0])
                result["model_upgradable"] = "unavailable"

        elif is_training == False and (lv == 1 or lv == 2): 
        #     result["learning_status"] = "done"
        #     result["result"] = "success"
        #     # result["model_version"] = model_version
        #     result["model_path"] = model_path
        #     result["model_upgradable"] = "unavailable"
        # elif is_training == False and lv == 2: 
            result["learning_status"] = "done"
            result["result"] = "success"
            result["latest_train_version"] = cur_model_path.split("/")[-1]
            result["model_path"] = cur_model_path
            result["model_upgradable"] = "available"

    return result

def getModelList(project_id,task_type):
    result = {}
    model_list,versions = [],[]
    gpu_1_host,gpu_1_port = getGpuServerDockerSocketInfo_1()
    gpu_2_host,gpu_2_port = getGpuServerDockerSocketInfo_2()
    
    container_dict = {"gpu_server_1":[],"gpu_server_2":[]}
    for i,url in enumerate([(gpu_1_host,gpu_1_port),(gpu_2_host,gpu_2_port)]):
        if i == 0 : container_dict["gpu_server_1"] = get_container_list(base_url = f"tcp://{url[0]}:{url[1]}")
        elif i == 1 : container_dict["gpu_server_2"] = get_container_list(base_url = f"tcp://{url[0]}:{url[1]}")
    model_trained_repo = os.getcwd()+Config.AI_TRAINED_MODEL_REPO+"/"
    models = [ i.split("/")[-1] for i in glob(model_trained_repo+task_type+"/*")]
    # print(f"\n-------------------\ncontainer_dict : {container_dict}\n-----------------------\n")
    if str(project_id) in models:
        versions = [ i.split("/")[-1] for i in glob(model_trained_repo+task_type+"/"+str(project_id)+"/*")]
        for version in versions:
            model_info = {"model_name": str(project_id)+"_"+task_type+"_v"+str(version), "status":"","progress":"","model_backbone":"","create_time":""}
        
            # get file create time            
            file_path = [model_path for model_path in glob(f"{model_trained_repo}{task_type}/{project_id}/{version}/*.pth") \
            if model_path.split('/')[-1] == "model_final.pth"]
            if len(file_path) == 0: 
                model_info["create_time"] = "none"
            else:
                # print("\n\nfile_path : ",f"{model_trained_repo}{task_type}/{project_id}/{version}/*.pth",file_path)
                creation_time = os.path.getctime("/".join(file_path[0].split("/")[:-1]))
                formatted_time = time.ctime(creation_time)
                model_info["create_time"] = str(formatted_time)

            # get model backbone
            file_path = [model_path for model_path in glob(f"{model_trained_repo}{task_type}/{project_id}/{version}/*.txt") \
            if model_path.split('/')[-1] == "model_config_name.txt"]
            if len(file_path) == 0: 
                model_info["model_backbone"] = "none"
            else:
                with open(file_path[0], 'r') as f:
                    # Read entire file content as a string
                    file_content = f.read()
                model_info["model_backbone"] = str(file_content).strip("\n")

            # get progress & status
            file_path = [model_path for model_path in glob(f"{model_trained_repo}{task_type}/{project_id}/{version}/*.json") \
            if model_path.split('/')[-1] == "metrics.json"]
            if len(file_path) == 0: 
                model_info["progress"] = "none"
                model_info["status"] = "none"
            else:
                f = open(file_path[0], 'r')
                lines = f.readlines()
                json_data = []
                for line in lines:
                    json_ins = json.loads(line)
                    json_data.append(json_ins)
                key_list = []
                for k,v in json_data[0].items():key_list.append(k)
                if "eta_seconds" not in key_list:
                    model_info["progress"] = "none"
                    model_info["status"] = "fail"
                else:
                    initial_eta = json_data[0]["eta_seconds"]
                    final_eta = json_data[-1]["eta_seconds"]
                    progress = round(((initial_eta - final_eta) / initial_eta) * 100,2)
                    model_info["progress"] = str(progress)
                    if progress < 100.0:
                        if model_info["create_time"] == "none":
                            if f"train_server_{str(project_id)}" in container_dict["gpu_server_2"]:
                                model_info["status"] = "in progress"

                            else: model_info["status"] = "fail"
                        else:
                            model_info["status"] = "in progress"
                    else:
                        model_info["status"] = "done"

            model_list.append(model_info)

    result["project_id"] = project_id
    result["model_list"] = model_list
    return result

def loadModel(project_id,task_type):
    """
    1. get current serving model version
    2. make comparison between loaded model and new model
    """
    # 1. get current serving model 
    host = Config.GPU_SERVER_2
    port = None
    inference_ports = get_port_usage()
    for k,v in inference_ports.items():
        if k == f"inference_server_{task_type}":
            port = v
    triton_client = httpclient.InferenceServerClient(url=host+":"+port, verbose=False)
    model_list = triton_client.get_model_repository_index()
    current_serving_version = None
    
    print(f"\n----------------\nmodel_list:{model_list}\n--------------------\n")
    for model in model_list:
        if model["name"] == str(project_id) and "version" in [k for k,v in model.items()]:
            current_serving_version = model["version"]
    print(f"\n----------------\ncurrent_serving_version:{current_serving_version}\n--------------------\n")
    if current_serving_version is not None:
        # 2. get loss and compare
        model_trained = os.getcwd()+Config.AI_TRAINED_MODEL_REPO+"/"
        new_model_version = [i.split("/")[-1] for i in glob(model_trained+task_type+"/"+str(project_id)+"/*")][-1]
        current_metric_path = "/".join([model_trained,task_type,str(project_id),current_serving_version+"/"])
        current_model_loss = get_loss(current_metric_path)["total_loss"]

        new_metric_path = "/".join([model_trained,task_type,str(project_id),new_model_version+"/"])
        new_model_loss = get_loss(new_metric_path)["total_loss"]

        if current_model_loss <= new_model_loss :
            if task_type == "od":
                port = 8000
                model_name = str(project_id)
                result = model_ctl("load",model_name,host=Config.GPU_SERVER_2,port = port)
            elif task_type == "seg":
                port = 8001
                model_name = "infer_pipeline_"+str(project_id)
                result = model_ctl("load",model_name,host=Config.GPU_SERVER_2,port = port)
            # result = {'name': str(project_id), 'version':current_serving_version, 'state': 'UNCHANGED'}
        elif new_model_loss <= current_model_loss :
            if task_type == "od":
                port = 8000
                model_name = str(project_id)
                result = model_ctl("load",model_name,host=Config.GPU_SERVER_2,port = port)
            elif task_type == "seg":
                port = 8001
                model_name = "infer_pipeline_"+str(project_id)
                
                result = model_ctl("load",model_name,host=Config.GPU_SERVER_2,port = port)
    else:
        if task_type == "od":
            port = 8000
            model_name = str(project_id)
            result = model_ctl("load",model_name,host=Config.GPU_SERVER_2,port = port)
        elif task_type == "seg":
            port = 8001
            model_name = "infer_pipeline_"+str(project_id)
            result = model_ctl("load",model_name,host=Config.GPU_SERVER_2,port = port)
    return result

def unloadModel(project_id,task_type):
    if task_type == "od":
        port = 8000
        model_name = str(project_id)
        result = model_ctl("unload",model_name,host=Config.GPU_SERVER_2,port = port)
    elif task_type == "seg":
        port = 8001
        model_name = "infer_pipeline_"+str(project_id)
        result = model_ctl("unload",model_name,host=Config.GPU_SERVER_2,port = port)
    return result


def getTrainedLog(project_id:int,task_type:str,version:int):
    datas = {}
    json_data = []
    model_trained_repo = os.getcwd()+Config.AI_TRAINED_MODEL_REPO
    model_path = "/".join([model_trained_repo,task_type,str(project_id),str(version)])
    model_files = [i.split("/")[-1] for i in glob(model_path +"/*")]
    
    if "metrics.json" in model_files:
        f = open(model_path+"/metrics.json", 'r')
        lines = f.readlines()
        [json_data.append(json.loads(line)) for line in lines]
        creation_time = os.path.getctime(model_path+"/metrics.json")
        create_time = datetime.datetime.fromtimestamp(creation_time)

    datas["project_id"] = project_id
    datas["task_type"] = task_type
    datas["version"] = version
    datas["created"] = str(create_time)
    datas["metrics"] = json_data
    return datas

def exportModel(project_id,task_type,version,export_type):
    model_trained_repo = os.getcwd()+Config.AI_TRAINED_MODEL_REPO
    model_path = "/".join([model_trained_repo,task_type,str(project_id),str(version)])
    if export_type in ["pytorch","onnx","tensorflow","keras"]:
        if export_type == "pytorch": exp = ".pt"         
        elif export_type == "onnx": exp = ".onnx"
        elif export_type == "tensorflow":
            exp = ".pb"
            raise ArgsException("Currently not support tensorflow")
        elif export_type == "keras":
            exp = ".h5"
            raise ArgsException("Currently not support keras")
    else:
        raise ArgsException("Invalid Export Type, only support (pytorch, onnx, tensorflow, keras) types of model")
    
    model_file_path = [i for i in glob(model_path+"/*"+exp)]
    if model_file_path is None : 
        raise ArgsException("no exportable model in repository")
    
    # make zip
    file_folder = io.BytesIO()
    with zipfile.ZipFile(file_folder, 'w') as exportZipfile:
        model_name = model_file_path[0].split("/")[-1]
        exportZipfile.write(model_file_path[0], model_name)
    file_folder.seek(0)
    return file_folder
