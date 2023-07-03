from werkzeug.datastructures import FileStorage
from PIL import Image
import os
import base64

from .Base import ModelBase, InterfaceHasId
from model import ImageDetail, Dataset
from log import logger
from exception import ArgsException, ExceptionCode
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from utils import DataPathDataset
import config
import utils

class Rawdata(ModelBase, InterfaceHasId):
    """
    ### Rawdata

 - Raw 데이터 (이미지)

| name | type | length | desc |  |
| --- | --- | --- | --- | --- |
| rawdata_id | integer |  |  |  |
| rawdata_name | string | 512 | 파일 제목 |  |
| rawdata_detail | <ImageDetail> |  | 파일 정보 |  |

| created | <Time> |  | 생성일 |  |
| updated | <Time> |  | 변경일 |  |
    """
    
    def __init__(self, rawdata_id, rawdata_name, rawdata_detail, rawdata_dataset, created=None, updated=None):        
        self.rawdata_id = rawdata_id
        self.rawdata_name = rawdata_name
        self.rawdata_detail:ImageDetail = ImageDetail.createFrom(rawdata_detail)  # type: ignore
        self.rawdata_dataset:Dataset = Dataset.createFrom(rawdata_dataset)  # type: ignore
        
        super().__init__(created, updated)    
    
    def get_id(self):
        return self.rawdata_id
    
    @property
    def _rawdata_id(self):
        return self.rawdata_id
    
    @property
    def _rawdata_name(self):
        return self.rawdata_name
    @_rawdata_name.setter
    def _rawdata_name(self, rawdata_name) -> None:
        self.rawdata_name = rawdata_name
    
    @property
    def _rawdata_detail(self) -> ImageDetail:
        return self.rawdata_detail
    @_rawdata_detail.setter
    def _rawdata_detail(self, rawdata_detail) -> None:
        self.rawdata_detail = rawdata_detail   
    
    @property
    def _rawdata_dataset(self) -> Dataset:
        return self.rawdata_dataset
    @_rawdata_dataset.setter
    def _rawdata_dataset(self, rawdata_dataset) -> None:
        self.rawdata_dataset = rawdata_dataset
   
   
    @classmethod    
    def createIdWithInsert(cls, dataset_id, fileStorage:FileStorage, title=None) -> int :
              
        
        # image file name
        image_name = os.path.splitext(fileStorage.filename)[0]  # type: ignore
        
        if title is None:
            title = image_name 
               
        # check - image size
        total_len, md5 = utils.checkFileSize(fileStorage)      
        if utils.isFreeSpace(total_len) == False:
            raise ArgsException("Service Disk is Full, Check Disk", ExceptionCode.INTERNAL_SERVER_ERROR)
          
        newImageFilename_base = None
            
        try:
            image_license_id = None
            with Image.open(fileStorage.stream) as image:
                    newImageFilename_base, newImageFilename  = DataPathDataset.createEmptyFileImage(dataset_id, image_name, image.format )                    
                    image.save(newImageFilename, format=image.format)
                    image_format = image.format
                    imageDetail = ImageDetail.createFromImage( DataPathDataset, dataset_id, image_name, image.format, newImageFilename_base, image_license_id, md5, True)
                    
            table_sub = Table("rawdata")
            query_sub = Query.from_(table_sub).select(fn.IfNull( fn.Max(table_sub.rawdata_id + 1  ), 1 )).where(table_sub.dataset_id==dataset_id)
        
            table = Table("rawdata")
            query = Query.into(table).columns(
                "rawdata_id", "dataset_id", 
                "rawdata_name", 
                "rawdata_fortmat", "rawdata_filename", "rawdata_size", "rawdata_md5"
                ).select(
                    query_sub, dataset_id,
                    Parameter("%s"), 
                    Parameter("%s"), Parameter("%s"), Parameter("%s"), Parameter("%s")
                )
            query_data = [
                title, 
                imageDetail._image_format, imageDetail._image_file, imageDetail._image_size, md5
            ]                
            
            with DatabaseMgr.openConnect() as connect:    
                
                DatabaseMgr.updateWithConnect(connect=connect, query=query, data=query_data)
                
                query_id = Query.from_(table).select(fn.Max(table_sub.rawdata_id).as_('rawdata_id') ).where(table_sub.dataset_id==dataset_id)
                result = DatabaseMgr.selectOneWithConnect(connect=connect, query=query_id)                                
                rawdata_id = result.get('rawdata_id')                                                                                                                        
                                                
                connect.commit()
        except:
            if newImageFilename_base is not None:
                DataPathDataset.deleteImage(dataset_id, newImageFilename_base)
            raise
            
        return rawdata_id