
from werkzeug.datastructures import FileStorage
from PIL import Image
import os
import base64
import hashlib


from .Base import ModelBase
from exception import ArgsException, ExceptionCode
import utils
import config
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from log import logger


class ImageDetail(ModelBase):
    """
    ### ImageDetail

- task_type : image

- taskdetail - image

| name | type | length | desc |
| --- | --- | --- | --- |
| image_name | string | 128 | 이미지 이름 |
| image_format | string | 32 | jpge, png, 같은 이미지 포멧 |
| image_file | string | 256 | 실제 이미지 파일 경로 |
| image_size | integer |  |  |
| image_height | integer |  |  |
| image_width | integer |  |  |
| image_thumbnail | base64string | 1024*10 | 썸네일 이미지, base64, utf-8 |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, image_name, image_format, image_file,  image_size=None, image_height=None, image_width=None, image_thumbnail=None, image_license_id=None, image_md5=None, created=None, updated=None):
        self.image_name = image_name
        self.image_format = image_format
        self.image_file = image_file
        self.image_height = image_height
        self.image_width = image_width
        self.image_size = image_size
        self.image_thumbnail = image_thumbnail
        self.image_license_id = image_license_id
        self.image_md5 = image_md5
        
        super().__init__(created, updated)    

    @property
    def _image_name(self):
        return self.image_name
    @_image_name.setter
    def _image_name(self, image_name) -> None:
        self.image_name = image_name        
       
    @property
    def _image_format(self):
        return self.image_format
    @_image_format.setter
    def _image_format(self, image_format) -> None:
        self.image_format = image_format
        
    @property
    def _image_file(self):
        return self.image_file
    @_image_file.setter
    def _image_file(self, image_file) -> None:
        self.image_file = image_file
    
    @property
    def _image_height(self):
        return self.image_height
    @_image_height.setter
    def _image_height(self, image_height) -> None:
        self.image_height = image_height      
    
    @property
    def _image_width(self):
        return self.image_width
    @_image_width.setter
    def _image_width(self, image_width) -> None:
        self.image_width = image_width
                
    @property
    def _image_size(self):
        return self.image_size
    @_image_size.setter
    def _image_size(self, image_size) -> None:
        self.image_size = image_size
        
    @property
    def _image_thumbnail(self):
        return self.image_thumbnail
    @_image_thumbnail.setter
    def _image_thumbnail(self, image_thumbnail) -> None:
        self.image_thumbnail = image_thumbnail    
       
       
    @property
    def _image_license_id(self):
        return self.image_license_id
    @_image_license_id.setter
    def _image_license_id(self, image_license_id) -> None:
        self.image_license_id = image_license_id
        
    @property
    def _image_md5(self):
        return self.image_md5
    @_image_md5.setter
    def _image_md5(self, image_md5) -> None:
        self.image_md5 = image_md5
        
    def getContentType(self):
        return f"image/{self.image_format}"

    def getImagePath(self, pathModeule, projec_id_or_dataset_id):
        
        return pathModeule.getImageFilepath(projec_id_or_dataset_id, self.image_file )
    
    def removeImage_changed(self, pathModeule,  projec_id_or_dataset_id):
        
        imageFilename, thumbnailFilename = pathModeule.getImageChangedFilepath(projec_id_or_dataset_id, self.image_file ) 
        
        if os.path.exists(imageFilename):
            os.remove(imageFilename)
            
        if os.path.exists(thumbnailFilename):
            os.remove(thumbnailFilename)
            
    def updateWith(self, connect, project_id, task_id ):
        """_summary_

        Args:
            connect (_type_): _description_
            project_id (_type_): _description_
            task_id (_type_): _description_

        Returns:
            _type_: _description_
        """                
        
        table = Table("task_detail")
        query = Query.update(table).set(
            "item_val", Parameter("%s")
        ).set(
            "item_val_int", Parameter("%s")
        ).set(
            "item_val_datetime", Parameter("%s")
        ).where(
            table.project_id==project_id
        ).where(
            table.task_id==task_id
        ).where(
            table.item_name==Parameter("%s")
        )
        
        query_datas = []
        
        # image_name
        query_datas.append( [self._image_name, None, None, "image_name"] )
        
        # image_format
        query_datas.append( [self._image_format, None, None, "image_format"] )
        
        # image_file
        query_datas.append( [self._image_file, None, None, "image_file"] )
        
        # image_license_id
        if self._image_license_id is not None:
            query_datas.append( [None, self._image_license_id, None, "image_license_id"] )
            
        # image_md5
        if self._image_md5 is not None:
            query_datas.append( [self._image_md5, None, None, "image_md5"] )
            
        
        return DatabaseMgr.updateManyWithConnect(connect, query, query_datas)
            
      
    def insertWith(self, connect, project_id, task_id):
        """_insert _

        Args:
            connect (_type_): _description_
            project_id (_type_): _description_
            task_id (_type_): _description_
            
            ex )
            insert into `task_detail` (project_id, task_id, item_name, item_val, item_val_int, item_val_datetime ) 
            select t.project_id, t.task_id , 'image_name', CONCAT(CAST(t.task_id as CHAR), '번 이미지', CAST(t.task_id as CHAR)), NULL, NULL 
        
        """
        table = Table("task_detail")
        query = Query.into(table).columns(
            "project_id", "task_id", 
            "item_name", 
            "item_val", "item_val_int", "item_val_datetime"
        ).select(
            project_id, task_id,
            Parameter("%s"), 
            Parameter("%s"), Parameter("%s"), Parameter("%s")
        )        
         
        query_datas = []
        
        # image_name
        query_datas.append( ["image_name",  self._image_name, None, None] )
        
        # image_format
        query_datas.append( ["image_format",  self._image_format, None, None] )
        
        # image_file
        query_datas.append( ["image_file",  self._image_file, None, None] )
        
        # image_license_id
        if self._image_license_id is not None:
            query_datas.append( ["image_license_id", None, self._image_license_id, None] )
            
        # image_md5
        if self._image_md5 is not None:
            query_datas.append( ["image_md5",  self._image_md5, None, None] )
        
        return DatabaseMgr.updateManyWithConnect(connect=connect, query=query, dataList=query_datas)
        
        
    @classmethod
    def createFromImage(cls, pathModeule, _id, image_name, image_format, image_file, image_license_id, image_md5, isRecreateThumbnail=False):
        
        pathModeule.createDirForImage(_id)
        imageFilename, thumbnailFilename = pathModeule.getImageFilepath(_id, image_file ) 
        
        logger.info(f"imageFilename : {imageFilename}, thumbnailFilename : {thumbnailFilename} ")                
        
        if imageFilename is None or os.path.exists(imageFilename) == False:
            raise ArgsException(f"image not exist(file - {imageFilename}) ", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        image_file_basename = os.path.basename(imageFilename)
        image_size = os.path.getsize(imageFilename)
        ctime = utils.toMillisecondFromTimestamp(os.path.getctime(imageFilename))
        mtime = utils.toMillisecondFromTimestamp(os.path.getmtime(imageFilename))
        
        with Image.open(imageFilename) as image:
            image_format = image.format
            image_height=image.height
            image_width=image.width
        
            # re create thumbnail
            if isRecreateThumbnail:    
                if os.path.exists(thumbnailFilename):
                    os.remove(thumbnailFilename)                    
                image.thumbnail(config.SIZE_THUMBNAIL)
                image.convert("RGB")
                image.save(thumbnailFilename)
                
            if os.path.exists(thumbnailFilename) == False:
                image.thumbnail(config.SIZE_THUMBNAIL)
                image.convert("RGB")
                image.save(thumbnailFilename)            
                
        # thumbnail_base64_string
        thumbnail_base64_string = None
        if os.path.exists(thumbnailFilename):
            with open(thumbnailFilename, 'rb') as tb:
                base64_b = base64.b64encode(tb.read())
                thumbnail_base64_string = base64_b.decode('utf-8')
         
        # md5
        if image_md5 is None or image_md5 == "":
            md5 = hashlib.md5()
            with open(imageFilename,'rb') as file:            
                chunk = 0
                while chunk != b'':
                    chunk = file.read(1024) 
                    md5.update(chunk)
                        
                image_md5 = md5.hexdigest()
                
        # image info                                   
        at = cls(
            image_name=image_name
            , image_format=image_format
            , image_file=image_file_basename
            , image_size=image_size
            , image_height=image_height
            , image_width=image_width
            , image_thumbnail=thumbnail_base64_string
            , image_license_id=image_license_id
            , image_md5=image_md5
            , created=ctime
            , updated=mtime
            )                
         
        return at