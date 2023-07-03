import os
from werkzeug.utils import secure_filename
import shutil

import config

from log import logger


def _getImageFilename(project_id, imagefilname):
    
    return f"{imagefilname}"


def getBaseDirForAnnotation(project_id):
    
    return getBaseDirForImage(project_id)


def getImagePathForAnnotation(project_id, imagefilename):    
    
    imageFilename, thumbnailFilename = getImageFilepath(project_id, imagefilename)
        
    if os.path.exists(imageFilename) == False:
        return None
        
    return  os.path.relpath(imageFilename, start=getBaseDirForImage(project_id) )

def getBaseDirForImage(project_id):
    
    return os.path.join( config.getBaseDir(), config.DIR_IMAGE_PROJECT, str(project_id))    

def createDirForImage(project_id):
    
    baseDir = getBaseDirForImage(project_id)
    
    dir = os.path.join( baseDir, config.DIR_IMAGE_SOURCE)
    os.makedirs(dir, exist_ok=True)
    
    dir_thumbnail = os.path.join( baseDir, config.DIR_IMAGE_SOURCE_THUMBNAIL)
    os.makedirs(dir_thumbnail, exist_ok=True)
    
    dirChanged = os.path.join( baseDir, config.DIR_IMAGE_CHANGED)
    os.makedirs(dirChanged, exist_ok=True)
    
    dirChanged_thumbnail = os.path.join( baseDir, config.DIR_IMAGE_CHANGED_THUMBNAIL)
    os.makedirs(dirChanged_thumbnail, exist_ok=True)


def getDirForImage(project_id) -> tuple:
    """
    get dir root - project image 
    return: 
     dir path : source
    """
    
    baseDir = getBaseDirForImage(project_id)
        
    dir = os.path.join( baseDir, config.DIR_IMAGE_SOURCE)    
    dir_thumbnail = os.path.join( baseDir, config.DIR_IMAGE_SOURCE_THUMBNAIL)        
    dirChanged = os.path.join( baseDir, config.DIR_IMAGE_CHANGED)        
    dirChanged_thumbnail = os.path.join( baseDir, config.DIR_IMAGE_CHANGED_THUMBNAIL)        
    return  dir, dir_thumbnail

def createEmptyFileImage(project_id, file_title, file_format):
    """_create emtpy file_

    Args:
        project_id (_type_): _description_
        file_title (_type_): _description_
        file_format (_type_): _file path_
        isCreateThumbnail (_type_): _file path_

    Returns:
        str: _file base name_
        str: _file path _
    """
    s_filename = secure_filename(file_title)
    dir, dir_thumbnail = getDirForImage(project_id)
    
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


def deleteDirForImage(project_id):
    
    baseDir = getBaseDirForImage(project_id)
    if os.path.exists(baseDir):
        shutil.rmtree(baseDir)

def deleteImage(project_id, imagefilename_base):
    """_delete image in project_

    Args:
        project_id (_type_): _description_
        imagefilename_base (_type_): _description_
    """
    deleteImageChanged(project_id, imagefilename_base)
    deleteImageSource(project_id, imagefilename_base)
    
    
def deleteImageChanged(project_id, imagefilename_base):
    """_delete image in project - changed_

    Args:
        project_id (_type_): _description_
        imagefilename_base (_type_): _description_
    """
    imageFilename, thumbnailFilename = getImageChangedFilepath(project_id, imagefilename_base)
    if os.path.exists(imageFilename):
        os.remove(imageFilename)
    if os.path.exists(thumbnailFilename):
        os.remove(thumbnailFilename)

def deleteImageSource(project_id, imagefilename_base):
    """_delete image in project - source_

    Args:
        project_id (_type_): _description_
        imagefilename_base (_type_): _description_
    """
    imageFilename, thumbnailFilename = getImageSourceFilepath(project_id, imagefilename_base)
    if os.path.exists(imageFilename):
        os.remove(imageFilename)
    if os.path.exists(thumbnailFilename):
        os.remove(thumbnailFilename)


def getImageFilepath(project_id, imagefilname ):
    """_get iamge fileinfo_

    Args:
        project_id (_type_): _description_
        imagefilname (_type_): _description_  
    Return:
        imageFilename, thumbnailFilename
    """                               
    
    imageFilename, thumbnailFilename = getImageChangedFilepath(project_id, imagefilname)
    if os.path.exists(imageFilename) == False:
        imageFilename, thumbnailFilename = getImageSourceFilepath(project_id, imagefilname)

    return imageFilename, thumbnailFilename


def getImageFilepathWithRelPath(project_id, imagefilnameRel ):
    """_get iamge fileinfo _

    Args:
        project_id (_type_): _description_
        imagefilnameRel (_type_): _상대 경로(rel path)_        
    """                               
    
    baseDir = getBaseDirForImage(project_id)
    
    # image                                                                    
    imageFilename = os.path.join( baseDir, _getImageFilename(project_id, imagefilnameRel) ) 
    print(f"filename : {imageFilename}")
    
    # thumbnail
    thumbnailFilename = os.path.join( baseDir,  _getImageFilename(project_id, imagefilnameRel) )
    
    return imageFilename, thumbnailFilename
    
def getImageSourceFilepath(project_id, imagefilname):
    """_get image(source) filename_

    Args:
        project_id (_type_): _description_
        imagefilname (_type_): _description_
        
    Returns:
        imageFilename (_type_): _description_
        thumbnailFilename (_type_): _description_
    """        
                           
    baseDir = getBaseDirForImage(project_id)
    
    # image                                                                    
    imageFilename = os.path.join( baseDir, config.DIR_IMAGE_SOURCE, _getImageFilename(project_id, imagefilname) ) 
    print(f"filename : {imageFilename}")
    
    # thumbnail
    thumbnailFilename = os.path.join( baseDir, config.DIR_IMAGE_SOURCE_THUMBNAIL, _getImageFilename(project_id, imagefilname) )
    return imageFilename, thumbnailFilename


def getImageChangedFilepath(project_id, imagefilname):
    """_get image(changed) filename_

    Args:
        project_id (_type_): _description_
        imagefilname (_type_): _description_        
    """                                   
    
    baseDir = getBaseDirForImage(project_id)
    
    # image                                                                    
    imageFilename = os.path.join( baseDir, config.DIR_IMAGE_CHANGED, _getImageFilename(project_id, imagefilname) ) 
    
    # thumbnail
    thumbnailFilename = os.path.join( baseDir, config.DIR_IMAGE_CHANGED_THUMBNAIL, _getImageFilename(project_id, imagefilname) )
    return imageFilename, thumbnailFilename