import os
from werkzeug.utils import secure_filename
import shutil

import config

from log import logger

def getBaseDirForFile(user_id):
    
    return os.path.join( config.getBaseDir(), config.DIR_FILE_STORAGE, str(user_id))    

def createDirForFile(user_id):
    
    baseDir = getBaseDirForFile(user_id)
    os.makedirs(baseDir, exist_ok=True)


def getDirForFile(user_id) -> tuple:
    """
    get dir root - project image 
    return: 
     dir path : source
    """
    
    baseDir = getBaseDirForFile(user_id)
         
  
    return  baseDir

def isAllowImageMineType(minetype):
    """
    allow image format
    """
    allowed = ['application/pdf']
    
    return minetype in allowed