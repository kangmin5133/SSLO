import json
import os


from tqdm import tqdm
from PIL import Image
import numpy as np
from werkzeug.datastructures import FileStorage
from exception import ArgsException, ExceptionCode

from utils import DataPathProjectSync
import utils
import config
import hashlib


def isSameFile(project_id, file_name, size, created, updated, md5) -> bool:
    """_현재 있는 파일과 같은 정보를 가지는 파일인지 체크_

    Args:
        project_id (_type_): _description_
        file_name (_type_): _description_
        size (_type_): _description_
        created (_type_): _description_
        updated (_type_): _description_

    Returns:
        bool: _True : 같은 파일_
    """
    imageFilename = DataPathProjectSync.getDataFilepath(project_id, file_name)  
    if os.path.exists(imageFilename) == False:
        return False
    
    current_size = os.path.getsize(imageFilename)
    current_created = utils.toMillisecondFromTimestamp(os.path.getctime(imageFilename))
    current_updated = utils.toMillisecondFromTimestamp(os.path.getmtime(imageFilename))    

    if size != current_size:
        return False
    
    # md5
    lib_md5 = hashlib.md5()
    with open(imageFilename,'rb') as file:            
        chunk = 0
        while chunk != b'':
            chunk = file.read(1024) 
            lib_md5.update(chunk)
                
        current_md5 = lib_md5.hexdigest()
    
    if md5 != current_md5:
        return False

    # if created != current_created:
    #     return False
    
    # if updated != current_updated:
    #     return False
    
    return True

def searchSyncData(project_id, datas, isRemove):

    info = datas.get("info")
    print(f"===> info : {info}")
    
    images = datas.get("images")
    if images is None:
        raise ArgsException("images is missing")
    
    print(f"===> images : {images}")
    print(f"===> images type : {type(images)}")
    
    if isinstance(images, list) == False:
        raise ArgsException("images is missing")

    sameList = []
    updateList = []
    removeList = []        
            
    for image in images:
        # id
        id  = image.get("id")
        # license
        # file_name
        file_name = image.get("file_name")
        # height
        height = image.get("height")
        # width
        width = image.get("width")
        
        # size
        size = image.get("size")
        # created
        created = image.get("created")
        # updated
        updated = image.get("updated")
        # md5
        md5 = image.get("md5")
        
        if isSameFile(project_id, file_name, size, created, updated, md5 ):
            sameList.append(file_name)
        else:
            updateList.append(file_name)
            
    # listdir
    DataPathProjectSync.createDirForSyncData(project_id, info.get("dirs"))
    dir = DataPathProjectSync.getDataDirForSyncData(project_id)
    listOfFiles = list()
    for (dirpath, dirnames, filenames) in os.walk(dir):
        listOfFiles += [ os.path.relpath(os.path.join(dirpath, file), start=dir) for file in filenames]
        
    print(f"===> listOfFiles : {listOfFiles}")
    # listOfFiles = os.listdir(dir)
    for file in listOfFiles:
        if file in sameList: 
            continue
        if file in updateList:
            continue
        
        removeList.append(file) 
    
    # delete
    if isRemove:
        for file in removeList:
            DataPathProjectSync.deleteData(project_id, file)
                
    return sameList, updateList, removeList

def syncData(project_id, fileList:list[FileStorage]):

    if fileList is None:
        raise ArgsException("fileList is missing")
    
    print(f"===> fileList : {fileList}")
    print(f"===> images type : {type(fileList)}")
    
    if isinstance(fileList, list) == False:
        raise ArgsException("fileList is missing")
    
    
    # dir - init
    DataPathProjectSync.createDirForSyncData(project_id)
    
    updateList = []
    
    for fileStorage in fileList:
        
        # check - file size
        total_len = utils.checkFileSize(fileStorage)      
        if utils.isFreeSpace(total_len) == False:
            raise ArgsException("Disk is Full, Check Disk", ExceptionCode.INTERNAL_SERVER_ERROR)
                
        filename = DataPathProjectSync.deleteData(project_id, fileStorage.filename)
        # os.makedirs(filename, exist_ok=True)    
        fileStorage.save(filename)
        updateList.append(fileStorage.filename)
        fileStorage.close()
                
    return updateList