import os
from werkzeug.utils import secure_filename
import shutil

import config

from log import logger


def _getFilename(project_id, filename):
    
    return f"{filename}"


def getBaseDirForAnnotation(project_id):
    
    return getBaseDirForSyncData(project_id)


def getFilenameForAnnotationCategories(project_id):
    
    return os.path.join( getBaseDirForAnnotation(project_id), config.FILENAME_ANNOTATION_CATEGORIES )

def getFilenameForAnnotationImages(project_id):
    
    return os.path.join( getBaseDirForAnnotation(project_id), config.FILENAME_ANNOTATION_IMAGES )

def getFilenameForAnnotationLicenses(project_id):
    
    return os.path.join( getBaseDirForAnnotation(project_id), config.FILENAME_ANNOTATION_LICENSES )

def getImagePathForAnnotation(project_id, filename):
    
    
    filename = getDataFilepath(project_id, filename)
        
    if os.path.exists(filename) == False:
        return None    
        
    return  os.path.abspath(filename)

def getBaseDirForSyncData(project_id):
    
    return os.path.join( config.getBaseDir(), config.DIR_SYNC_DATA_PROJECT, str(project_id))
    
def getDataDirForSyncData(project_id):
    
    baseDir = getBaseDirForSyncData(project_id)
    
    # sync data                                                                    
    return os.path.join( baseDir, config.DIR_SYNC_DATA ) 

def isAllowImageMineType(minetype):
    """
    allow image format
    """
    allowed = ['image/jpeg']
    
    return minetype in allowed

def createDirForSyncData(project_id, infoDirs:list = None):        
    # sync data                                                                    
    dir = getDataDirForSyncData(project_id)
    os.makedirs(dir, exist_ok=True)
    
    if infoDirs is not None:
        for d in infoDirs:         
            os.makedirs(os.path.join(dir, d), exist_ok=True)
        
    return dir      


def deleteDirForSyncData(project_id):
    
    baseDir = getBaseDirForSyncData(project_id)
    if os.path.exists(baseDir):
        shutil.rmtree(baseDir)

def deleteData(project_id, filename_base):
    """_delete image in project_

    Args:
        project_id (_type_): _description_
        filename_base (_type_): _description_
    """
    filename = getDataFilepath(project_id, filename_base)
    if os.path.isfile(filename):
        os.remove(filename)
    if os.path.isdir(filename):
        shutil.rmtree(filename)
        
    return filename

def getDataFilepath(project_id, filename ):
    """_get iamge fileinfo_

    Args:
        project_id (_type_): _description_
        filename (_type_): _description_        
    """                               
    
    baseDir = getBaseDirForSyncData(project_id)
    
    # image                                                                    
    filename = os.path.join( baseDir, config.DIR_SYNC_DATA, _getFilename(project_id, filename) ) 
    print(f"filename : {filename}")
    
    return filename
    
