import json
import os
import zipfile
import io
from tqdm import tqdm
from PIL import Image
import numpy as np
from glob import glob
from werkzeug.datastructures import FileStorage
from exception import ArgsException, ExceptionCode
from utils import DataPathProjectSync
import config
from config import Config

import sys
sys.path.append("solution_ai_model")

from solution_ai_model.modules.labels import COCO_NAMES
from solution_ai_model.modules.triton_serving import inference, infer_result_filter_conf, infer_result_filter
from solution_ai_model.modules.formatter import coco_format_inverter, coco_format_inverter_batch
from solution_ai_model.active_learning import activeLearning
from solution_ai_model.modules.container_ctl import get_container_list

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
    
def inference_triton(project_id, image, confidence, label_type = "bbox"):
    # inference using triton serving container , with httpclient 
    
    class_list:list = ["person"]
    
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
    
    response_data = coco_format_inverter(result)
    # return result
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

def inferenceBatch(task_type:int,image_list:list):
    if task_type == 0:
        cocoDatas = inference_triton_batch(image_list, label_type="bbox", confidence=0.5)
    elif task_type == 1:
        cocoDatas = inference_triton_batch(image_list, label_type="polygon", confidence=0.5)
    return cocoDatas

def inferenceOD(project_id, imagefile,is_batch=False):

    print(f"==> inferenceOD")
    host, port = getInferenceServerInfo_OD()
    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="bbox", confidence=0.5)
    else:        
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)
        # imagefile = "../sslo-data-ai/projectSync/8/source/000000045596_0.JPEG"
        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        
        cocoDatas = inference_triton(project_id, imagefile, label_type="bbox", confidence=0.5)
            
    print(f"==> cocoDatas : {cocoDatas}")
    
    # return  convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=1)
    return cocoDatas

def inferenceIS(project_id, imagefile,is_batch=False):

    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="polygon", confidence=0.5)
        
    else:      
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)

        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)

        cocoDatas = inference_triton(project_id, imagefile, label_type="polygon", confidence=0.5 )
    
    # return convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=2)
    return cocoDatas


def inferenceSES(project_id, imagefile,is_batch=False):
    
    imagefileList = []
    if is_batch:
        for i in range(len(imagefile)):
            imagefileList.append(DataPathProjectSync.getDataFilepath(project_id, imagefile[i]))
            
        for imagefile in imagefileList:
            if os.path.exists(imagefile) == False:
                raise ArgsException(f"image file(filepath : {imagefile[i]}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton_batch_sslo(project_id, imagefileList, label_type="segment", confidence=0.5)
    else:
        imagefile = DataPathProjectSync.getDataFilepath(project_id, imagefile)

        if os.path.exists(imagefile) == False:
            raise ArgsException(f"image file(filepath : {imagefile}) is not exist.", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        cocoDatas = inference_triton(project_id, imagefile, label_type="segment", confidence=0.5 )
    
    # return convertCocoFormatToSSLOAnnotations(cocoDatas, sslo_annotation_type_id=3)
    return cocoDatas

def activeLearningStart(project_id,gpu_server=1,gpu_id=1):
    dataset_dir = f"{Config.AI_BASE_DIR}/{config.DIR_SYNC_DATA_PROJECT}/{project_id}/source"
    project_name = project_id
    servable_model_path = "sslo-ai-api-server/solution_ai_model/models_servable/"
    model_repository = "sslo-ai-api-server/solution_ai_model/models_trained/"
    split = 0.7
    aug_iter = 10
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
                   device_id = device_id,
                   base_url = base_url,
                   serving_host = serving_host)
    
    return {"container_name":"train_server_"+str(project_id),"train_status":"running"}

def searchModelDirs(project_id):
    # lv = 0 : no trained & servable model / 1 : only trained model exist / 2 : both exist
    lv = 0
    model_path,model_version = "",""
    task_type = ["od","seg"]
    model_trained = os.getcwd()+Config.AI_CORE_DIR + "/models_trained/"
    model_servable = os.getcwd()+Config.AI_CORE_DIR + "/models_servable/"
    for task in task_type:
        if str(project_id) in [ i.split("/")[-1] for i in glob(model_trained+task+"/*")]:
            if str(project_id) in [ i.split("/")[-1] for i in glob(model_servable+task+"/*")]: 
                lv = 2
                model_path = [ i for i in glob(model_servable+task+"/*") if str(project_id) in i][0]
                model_versions_list = [i.split("/")[-1] for i in glob(model_path+"/*")]
                model_versions_list.remove("config.pbtxt")
                model_version =  max(list(map(int,model_versions_list)))
                break
            
            elif str(project_id) not in [ i.split("/")[-1] for i in glob(model_servable+task+"/*")] :
                lv = 1
                model_path = [ i for i in glob(model_trained+task+"/*") if str(project_id) in i][0]
                model_version =  max(list(map(int,[i.split("/")[-1] for i in glob(model_path+"/*")])))
                break
            
        if str(project_id) not in [ i.split("/")[-1] for i in glob(model_trained+task+"/*")] and \
            str(project_id) not in [ i.split("/")[-1] for i in glob(model_servable+task+"/*")] and lv == 0: 
                lv = 0 
            
    return lv , model_path, model_version

def activeLearningStatus(project_id):
    is_training = False
    
    result = {"project_id" : project_id,
              "container_name":f"train_server_{project_id}",
              "status":"",
              "result":"",
              "model_version":"",
              "model_upgradable":"",
              "model_path":""}
    
    gpu_1_host,gpu_1_port = getGpuServerDockerSocketInfo_1()
    gpu_2_host,gpu_2_port = getGpuServerDockerSocketInfo_2()
    
    container_dict = {"gpu_server_1":[],"gpu_server_2":[]}
    for i,url in enumerate([(gpu_1_host,gpu_1_port),(gpu_2_host,gpu_2_port)]):
        if i == 0 : container_dict["gpu_server_1"] = get_container_list(base_url = f"tcp://{url[0]}:{url[1]}")
        elif i == 1 : container_dict["gpu_server_2"] = get_container_list(base_url = f"tcp://{url[0]}:{url[1]}")
    
    if len([container_name for server in container_dict for container_name in container_dict[server] 
            if f"train_server_{project_id}" == container_name]) != 0:
        is_training = True
        
    lv , model_path, model_version = searchModelDirs(project_id)

    if is_training : 
        result["status"] = "active"
    elif is_training == False and lv == 0: 
        result["status"] = "inactive"
        result["result"] = "fail"
    elif is_training == False and lv == 1: 
        result["status"] = "done"
        result["result"] = "success"
        result["model_version"] = model_version
        result["model_path"] = model_path
        result["model_upgradable"] = "unavailable"
    elif is_training == False and lv == 2: 
        result["status"] = "done"
        result["result"] = "success"
        result["model_version"] = model_version
        result["model_path"] = model_path
        result["model_upgradable"] = "available"

    return result

def getModelList(project_id):
    result = {}
    model_list,versions = [],[]
    model_trained_repo = os.getcwd()+Config.AI_TRAINED_MODEL_REPO
    task_type=["od","seg"]
    od_all_models = [ i.split("/")[-1] for i in glob(model_trained_repo+task_type[0]+"/*")]
    seg_all_models = [ i.split("/")[-1] for i in glob(model_trained_repo+task_type[1]+"/*")]
    if str(project_id) in od_all_models:
        versions = [ i.split("/")[-1] for i in glob(model_trained_repo+task_type[0]+"/"+str(project_id)+"/*")]
        for v in versions: model_list.append(str(project_id)+"_"+task_type[0]+"_v"+str(v))

    if str(project_id) in seg_all_models:
        versions = [ i.split("/")[-1] for i in glob(model_trained_repo+task_type[1]+"/"+str(project_id)+"/*")]
        for v in versions: model_list.append(str(project_id)+"_"+task_type[1]+"_v"+str(v))

    result["project_id"] = project_id
    result["model_list"] = model_list
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

    datas["project_id"] = project_id
    datas["task_type"] = task_type
    datas["version"] = version
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
        raise ArgsException("Invalid Export Type only support (pytorch, onnx, tensorflow, keras) types of model")
    
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