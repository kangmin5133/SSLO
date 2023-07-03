import os
from typing import Final
from enum import Enum, IntEnum, unique
from datetime import timedelta

from .Config import Config
from service.database import Order


def load_config() -> Config:
    """Load config."""
    mode = os.environ.get('MODE', default="TESTING")     
   
    try:
        if mode == "PRODUCTION":
            atConfig = Config()  # type: ignore
        elif mode == "TESTING":
            from .TestingConfig import TestingConfig
            atConfig = TestingConfig()  # type: ignore
        else:            
            atConfig = Config()  # type: ignore
        
    except ImportError:  
        atConfig = None  # type: ignore

    # arg override

    arg = os.environ.get('HOST') 
    if arg is not None:
        atConfig.HOST = arg  # type: ignore

    arg = os.environ.get('FLASK_RUN_PORT')
    if arg is not None:
        atConfig.PORT = arg  # type: ignore
        
    arg = os.environ.get('PORT') 
    if arg is not None:
        atConfig.PORT = arg  # type: ignore
                
    arg = os.environ.get('DEBUG') 
    if arg is not None:
        atConfig.DEBUG = arg                  # type: ignore

    return atConfig  # type: ignore

loaded:Config = load_config()

def getDatabaseInfo():
    return loaded.DATABASE

def getBaseDir():
    return loaded.BASE_DIR


def getAIServerUrl() -> str:
    return loaded.AI_BASE_URL

def getCrawlingServerUrl() -> str:
    return loaded.CRAWLING_BASE_URL

def getAIServerRestBaseUrl() -> str:
    return f"{loaded.AI_BASE_URL}/rest/api/1"
    
def getSecret():
    return loaded.JWT_SECRET_KEY

def isPassLoginRequired():
    return loaded.PASS_LOGIN_REQUIRED



DIR_IMAGE_PROJECT:Final="project_images"
DIR_IMAGE_DATASET:Final="dataset_images"
DIR_IMAGE_SOURCE:Final="source"
DIR_IMAGE_SOURCE_THUMBNAIL:Final="source_thumbnail"
DIR_IMAGE_CHANGED:Final="changed"
DIR_IMAGE_CHANGED_THUMBNAIL:Final="changed_thumbnail"
DIR_FILE_STORAGE:Final="partnership_files"

DIR_IMAGE_PROJECT_TEMP:Final="temp"
DIR_SYNC_DATA_PROJECT = "projectSync"
# annotation
ANNOTATION_FILENAME="annotation.json"
ANNOTATION_DATA_DIR="images"
ANNOTATION_CATEGORY_MIN_ID_ADD=1000


# 1Mbyte = 1 * 1024 * 1024 
MAX_IMAGE_LENGTH= 100 * 1024 * 1024 
""" image max size
"""

MAX_IMAGE_COUNT= 5000
""" image max count
"""

MAX_CONTENT_LENGTH= MAX_IMAGE_COUNT * MAX_IMAGE_LENGTH
"""
 MAX_IMAGE_COUNT * MAX_IMAGE_LENGTH
"""

MAX_TASK_COUNT= MAX_IMAGE_COUNT
"""
task max count 
"""

# 
MAX_WAIT_FOR_WORK = timedelta(minutes=10)
"""_wait for work_
"""

SIZE_THUMBNAIL:Final=(128,128)
"""
thumbnail image size
4.5k
"""

SEARCH_DAY_PRIEOD:Final=7
"""
기본 검색 기간 (day)
"""

DEFAULT_PAGE_LIMIT=5
"""
page 검색 기본 최대값(개수)
"""


# class SortOrder(Order):
#     """_sort order_
#     """
#     ...
    
DEFAULT_SORT_ORDER=Order.desc
"""
    sort order default
"""

def toSortOrder(order:str) -> Order:
    return Order(order)

    
# Separator
SEPARATOR_STR=":-=;"
SEPARATOR_CRAWLING_KEYWORD=";"
SEPARATOR_ANNOTATION_ATTRIBUTE=";;"


# Cache 
isUseCache = True
isExpireCache = True
LIMIT_EXPIRE_CACHE = timedelta(minutes=1)

# export 
MAX_EXPORT_TASK_COUNT = 100
