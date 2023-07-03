import os
from werkzeug.utils import secure_filename
import shutil


import config

from log import logger


def _getImageFilename(dataset_id, imagefilname):    
    return f"{imagefilname}"

def createDirForImage(dataset_id):
    dir = os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id), config.DIR_IMAGE_SOURCE)
    os.makedirs(dir, exist_ok=True)
    
    dir_thumbnail = os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id), config.DIR_IMAGE_SOURCE_THUMBNAIL)
    os.makedirs(dir_thumbnail, exist_ok=True)
    
    dirChanged = os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id), config.DIR_IMAGE_CHANGED)
    os.makedirs(dirChanged, exist_ok=True)
    
    dirChanged_thumbnail = os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id), config.DIR_IMAGE_CHANGED_THUMBNAIL)
    os.makedirs(dirChanged_thumbnail, exist_ok=True)

def getBaseDirForImage(dataset_id):
    
    return os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id))    


def getDirForImage(dataset_id) -> tuple:
    """
    get dir root - dataset image 
    return: 
     dir path : source
    """
        
    baseDir = getBaseDirForImage(dataset_id)
        
    dir = os.path.join( baseDir, config.DIR_IMAGE_SOURCE)    
    dir_thumbnail = os.path.join( baseDir, config.DIR_IMAGE_SOURCE_THUMBNAIL)        
    dirChanged = os.path.join( baseDir, config.DIR_IMAGE_CHANGED)        
    dirChanged_thumbnail = os.path.join( baseDir, config.DIR_IMAGE_CHANGED_THUMBNAIL)        
    return  dir, dir_thumbnail

def createEmptyFileImage(dataset_id, file_title, file_format):
    """_create emtpy file_

    Args:
        dataset_id (_type_): _description_
        file_title (_type_): _description_
        file_format (_type_): _file path_
        isCreateThumbnail (_type_): _file path_

    Returns:
        str: _file base name_
        str: _file path _
    """
    s_filename = secure_filename(file_title)
    dir, dir_thumbnail = getDirForImage(dataset_id)
    
    index = 0    
    while os.path.exists(os.path.join(dir, f"{s_filename}_{index}.{file_format}")) :
        index += 1
        
        if index > config.MAX_TASK_COUNT:
            break


    filename_base = f"{s_filename}_{index}.{file_format}"
    
    filename = os.path.join(dir, filename_base)
    open(filename, mode='x').close()
    
    return filename_base, filename
    

def isAllowImageMineType(minetype):
    """
    allow image format
    """
    allowed = ['image/jpeg']
    
    return minetype in allowed

def deleteDirForImage(dataset_id):
    """_delete all dataset_

    Args:
        dataset_id (_type_): _description_
    """
    dir = getBaseDirForImage(dataset_id)
    if os.path.exists(dir) :
        shutil.rmtree(dir)

def deleteImage(dataset_id, imagefilename_base):
    """_delete image in dataset_

    Args:
        dataset_id (_type_): _description_
        imagefilename_base (_type_): _description_
    """
    deleteImageChanged(dataset_id, imagefilename_base)
    deleteImageSource(dataset_id, imagefilename_base)
    
    
def deleteImageChanged(dataset_id, imagefilename_base):
    """_delete image in dataset - changed_

    Args:
        dataset_id (_type_): _description_
        imagefilename_base (_type_): _description_
    """
    imageFilename, thumbnailFilename = getImageChangedFilepath(dataset_id, imagefilename_base)
    if os.path.exists(imageFilename):
        os.remove(imageFilename)
    if os.path.exists(thumbnailFilename):
        os.remove(thumbnailFilename)

def deleteImageSource(dataset_id, imagefilename_base):
    """_delete image in dataset - source_

    Args:
        dataset_id (_type_): _description_
        imagefilename_base (_type_): _description_
    """
    imageFilename, thumbnailFilename = getImageSourceFilepath(dataset_id, imagefilename_base)
    if os.path.exists(imageFilename):
        os.remove(imageFilename)
    if os.path.exists(thumbnailFilename):
        os.remove(thumbnailFilename)



def getImageFilepath(dataset_id, imagefilname ):
    """_get iamge fileinfo_

    Args:
        dataset_id (_type_): _description_
        imagefilname (_type_): _description_        
    """                               
    
    imageFilename, thumbnailFilename = getImageChangedFilepath(dataset_id, imagefilname)
    if os.path.exists(imageFilename) == False:
        imageFilename, thumbnailFilename = getImageSourceFilepath(dataset_id, imagefilname)

    return imageFilename, thumbnailFilename
    
def getImageSourceFilepath(dataset_id, imagefilname):
    """_get image(source) filename_

    Args:
        dataset_id (_type_): _description_
        imagefilname (_type_): _description_
        
    Returns:
        imageFilename (_type_): _description_
        thumbnailFilename (_type_): _description_
    """                               
    
    # image                                                                    
    imageFilename = os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id), config.DIR_IMAGE_SOURCE, _getImageFilename(dataset_id, imagefilname) ) 
    print(f"filename : {imageFilename}")
    
    # thumbnail
    thumbnailFilename = os.path.join( config.getBaseDir(), config.DIR_IMAGE_DATASET, str(dataset_id), config.DIR_IMAGE_SOURCE_THUMBNAIL, _getImageFilename(dataset_id, imagefilname) )
    return imageFilename, thumbnailFilename


def getImageChangedFilepath(dataset_id, imagefilname):
    
    baseDir = getBaseDirForImage(dataset_id)
                       
    # image                                                                    
    imageFilename = os.path.join( baseDir, config.DIR_IMAGE_CHANGED, _getImageFilename(dataset_id, imagefilname) ) 
    
    # thumbnail
    thumbnailFilename = os.path.join( baseDir, config.DIR_IMAGE_CHANGED_THUMBNAIL, _getImageFilename(dataset_id, imagefilname) )
        
    return imageFilename, thumbnailFilename