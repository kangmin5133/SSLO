import os
import json

from.Config import Config

import argparse

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode',help="env : test or product", default="test")
    return parser.parse_args()

def load_config():
    """Load config."""
    args = parse_args()
    
    mode = args.mode
    print( f"config mode: {mode}" )
    
    config = None
    
    try:
        if mode == "product":
            config = Config()
        elif mode == "test":
            from.TestingConfig import TestingConfig
            config = TestingConfig()
        else:            
            config = Config()
        
    except ImportError:  
        config = {}

    # arg override

    arg = os.environ.get('HOST') 
    if arg is not None:
        config.HOST = arg

    arg = os.environ.get('FLASK_RUN_PORT') 
    if arg is not None:
        config.PORT = arg
        
    arg = os.environ.get('PORT') 
    if arg is not None:
        config.PORT = arg
                
    arg = os.environ.get('DEBUG') 
    if arg is not None:
        config.DEBUG = arg                

    return config

loaded:Config = load_config()

def getDatabaseInfo():
    return loaded.DATABASE

def getBaseDir():
    return loaded.BASE_DIR


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
    

DIR_SYNC_DATA_PROJECT = "projectSync"
# annotation
ANNOTATION_FILENAME="annotation.json"
DIR_IMAGE_PROJECT="project_images"
DIR_IMAGE_DATASET="dataset_images"
DIR_IMAGE_SOURCE="source"
DIR_SYNC_DATA=""