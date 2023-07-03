
from werkzeug.datastructures import FileStorage
from PIL import Image
import os

from .Base import ModelBase, InterfaceHasId
from .ModelTaskStatus import TaskStatus
from .ModelTaskType import TaskType
from .ModelTaskStatus import TaskStatus
from .ModelLicense import License
from .ModelUser import User
from .ModelImageDetail import ImageDetail
from .ModelProject import Project

from .ModelPermission import Permission
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from log import logger
import config
from exception import ArgsException, ExceptionCode
from utils import DataPathProject
import utils

class Task(ModelBase, InterfaceHasId):
    """
    ### Task

 - Task는 작업의 최소단위 

 - TaskDetail은 상세 조회에서만 포함

 - task_detail은 task type에 따라서 다르게 구성

| name | type | length | desc | createable(* require) | updateable(* require) |
| --- | --- | --- | --- | --- | --- |
| task_id | integer |  |  | n | *n |
| task_name | string | 256 |  | *y | y |
| task_project | <Project> |  |  | n | n |
| task_category | string | 32 | 대분류 | y | y |
| task_sub_category | string | 32 | 소분류 | y | y |
| task_status | <TaskStatus> |  | 현재 작업 상태 - TaskStatus 참조,   default 미작업 | n | n |
| task_permission | <Permission> |  | 권한 | n | n |
| task_license | <License> |  | 라이센스 | y | y |
| task_worker | <User> |  | 작업자 | y | y |
| task_validator | <User> |  | 검증자 | y | y |
| task_type | <TaskType> |  | task의 종류 - default : image  | y | n |
| task_detail | <TaskDetail> |  | task_type에 따라서 결정  | n | n |
| created | <Time> |  | 생성시간 | n | n |
| updated | <Time> |  | 변경시간 | n | n |
    """
    
    def __init__(self, task_id, task_name, task_project, task_category = None, task_sub_category=None, task_status=TaskStatus.createDefault(), task_permission=None, task_license=None, task_worker=None, task_validator=None, task_type=TaskType.createDefault(), task_detail = None, created=None, updated=None):
        self.task_id = task_id
        self.task_name = task_name
        self.task_project = Project.createFrom(task_project)
        
        self.task_category = task_category
        self.task_sub_category = task_sub_category
                
        self.task_status:TaskStatus = TaskStatus.createFrom(task_status)  # type: ignore
        self.task_permission:Permission = Permission.createFrom(task_permission)  # type: ignore
        self.task_license:License = License.createFrom(task_license, allowNone=True)  # type: ignore
        self.task_worker:User = User.createFrom(task_worker, allowNone=True)  # type: ignore
        self.task_validator:User = User.createFrom(task_validator, allowNone=True)  # type: ignore
        self.task_type:TaskType = TaskType.createFrom(task_type)  # type: ignore
        
        self.task_detail:ImageDetail = ImageDetail.createFrom(task_detail, allowNone=True)  # type: ignore
        
        super().__init__(created, updated)    
    
    def get_id(self):
        return self.task_id
    
    @property
    def _task_id(self):
        return self.task_id
    
    @property
    def _task_name(self):
        return self.task_name
    @_task_name.setter
    def _task_name(self, task_name) -> None:
        self.task_name = task_name
        
    @property
    def _task_project(self):
        return self.task_project
    @_task_project.setter
    def _task_project(self, task_project) -> None:
        self.task_project = task_project
    
    @property
    def _task_category(self):
        return self.task_category
    @_task_category.setter
    def _task_category(self, task_category) -> None:
        self.task_category = task_category
        
    @property
    def _task_sub_category(self):
        return self.task_sub_category
    @_task_sub_category.setter
    def _task_sub_category(self, task_sub_category) -> None:
        self.task_sub_category = task_sub_category   
    
    @property
    def _task_status(self) -> TaskStatus:
        return self.task_status
    @_task_status.setter
    def _task_status(self, task_status) -> None:
        self.task_status = task_status
        
    @property
    def _task_permission(self) -> Permission:
        return self.task_permission
    @_task_permission.setter
    def _task_permission(self, task_permission) -> None:
        self.task_permission = task_permission    
    
    @property
    def _task_license(self) -> License:
        return self.task_license
    @_task_license.setter
    def _task_license(self, task_license) -> None:
        self.task_license = task_license
                                        
    @property
    def _task_worker(self) -> User:
        return self.task_worker
    @_task_worker.setter
    def _task_worker(self, task_worker) -> None:
        self.task_worker = task_worker
        
    @property
    def _task_validator(self) -> User:
        return self.task_validator
    @_task_validator.setter
    def _task_validator(self, task_validator) -> None:
        self.task_validator = task_validator
        
    @property
    def _task_type(self) -> TaskType:
        return self.task_type
    @_task_type.setter
    def _task_type(self, task_type) -> None:
        self.task_type = task_type
                
    @property
    def _task_detail(self) -> ImageDetail:
        return self.task_detail
    @_task_detail.setter
    def _task_detail(self, task_detail) -> None:
        self.task_detail = task_detail

        
    @classmethod    
    def createIdWithInsert(cls, project_id, fileStorage:FileStorage, task_name=None, task_type_id=None, task_category=None, task_sub_category=None, image_license_id=None) -> int :
        """_create task_

        Args:
            project_id (_type_): _description_
            fileStorage (FileStorage): _description_
            task_name (_type_, optional): _description_. Defaults to None.
            task_type_id (_type_, optional): _description_. Defaults to None.
            task_category (_type_, optional): _description_. Defaults to None.
            task_sub_category (_type_, optional): _description_. Defaults to None.
            image_license_id (_type_, optional): _description_. Defaults to None.

        Raises:
            ArgsException: _description_

        Returns:
            int: _description_
        """
        
        # image file name
        image_name = os.path.splitext(fileStorage.filename)[0]  # type: ignore
        
        if task_name is None:
            task_name = image_name 
        if task_type_id is None:
            task_type = TaskType.createDefault()
            task_type_id = task_type._task_type_id
        
        # check - image size   
        # check - image size
        total_len, md5 = utils.checkFileSize(fileStorage)      
        if utils.isFreeSpace(total_len) == False:
            raise ArgsException("Service Disk is Full, Check Disk", ExceptionCode.INTERNAL_SERVER_ERROR)
        
                
        table_sub = Table("task")
        query_sub = Query.from_(table_sub).select(fn.IfNull( fn.Max(table_sub.task_id + 1  ), 1 )).where(table_sub.project_id==project_id)
        
        table = Table("task")
        query = Query.into(table).columns(
            "task_id", "project_id", 
            "task_type_id", "task_name", "task_category", "task_sub_category",
            "license_id",
            "task_worker_id", "task_validator_id",
            "task_status_step", "task_status_progress"
            ).select(
                query_sub, project_id,
                Parameter("%s"), Parameter("%s"), Parameter("%s"), Parameter("%s"),
                Parameter("%s"), 
                Parameter("%s"), Parameter("%s"), 
                Parameter("%s"), Parameter("%s")
            )
        query_data = [
            task_type_id, task_name, task_category, task_sub_category,
            None, 
            None, None, 
            1, 1
        ]
        
        newImageFilename_base = None
            
        try:
            with Image.open(fileStorage.stream) as image:
                    newImageFilename_base, newImageFilename  = DataPathProject.createEmptyFileImage(project_id, image_name, image.format )                    
                    image.save(newImageFilename, format=image.format) 
            
            with DatabaseMgr.openConnect() as connect:    
                DatabaseMgr.updateWithConnect(connect, query, query_data)
                
                query_id = Query.from_(table).select(fn.Max(table_sub.task_id).as_('task_id') ).where(table_sub.project_id==project_id)
                result = DatabaseMgr.selectOneWithConnect(connect=connect, query=query_id)                                
                task_id = result.get('task_id')                                                                        

                image_license_id = None
                taskDetail = ImageDetail.createFromImage( DataPathProject, project_id, image_name, image.format, newImageFilename_base, image_license_id, md5, True)
                taskDetail.insertWith(connect, project_id, task_id)
                
                connect.commit()

        except:
            if newImageFilename_base is not None:
                DataPathProject.deleteImage(project_id, newImageFilename_base)
            raise
            
        return task_id
    
    @classmethod    
    def updateData(cls, project_id, task_id, fileStorage:FileStorage, task) -> int :
        
        # image file name
        image_name = os.path.splitext(fileStorage.filename)[0]  # type: ignore
        taks_name = image_name
        
        # check - image size
        total_len, md5 = utils.checkFileSize(fileStorage)      
        if utils.isFreeSpace(total_len) == False:
            raise ArgsException("Service Disk is Full, Check Disk", ExceptionCode.INTERNAL_SERVER_ERROR)        
                           
        if task is None:
            raise ArgsException(f"Project({project_id}), Task({task_id}) is not exist")                
        
        if task._task_type.isNeedDetail() == False:
            raise ArgsException(f"Project({project_id}), Task({task_id}) is wrong(type)")
        
        if task._task_detail is None:
            raise ArgsException(f"Project({project_id}), Task({task_id}) is wrong(detail)")
        
        if task._task_detail._image_file is None:
            raise ArgsException(f"Project({project_id}), Task({task_id}) is wrong(detail - image file name)")
        
        imagefilename_base = task._task_detail._image_file
        image_license_id = task._task_detail._image_license_id
                                
        try:                        
            
            DataPathProject.deleteImageChanged(project_id=project_id, imagefilename_base=imagefilename_base)
            
            with DatabaseMgr.openConnect() as connect:    
                                                                                        
                with Image.open(fileStorage.stream) as image:
                    
                    imageFilename, thumbnailFilename  = DataPathProject.getImageChangedFilepath(project_id, imagefilename_base )                    
                    image.save(imageFilename, format=image.format)                                                            
                    taskDetail = ImageDetail.createFromImage( DataPathProject, project_id, image_name, image.format, imagefilename_base, image_license_id, md5, True)
                    taskDetail.updateWith(connect, project_id, task_id)
                    
                table = Table("task")
                query = Query.update(table).set(
                    "updated", fn.Now()
                    ).where(
                        table.project_id==Parameter("%s")
                    ).where(
                        table.task_id==Parameter("%s")
                    ) 
                query_data = [
                    project_id, task_id
                ]
                
                DatabaseMgr.updateWithConnect(connect=connect, query=query, data=query_data)
                
                connect.commit()
        except:            
            DataPathProject.deleteImageChanged(project_id, imagefilename_base)
            raise
            
        return task_id
    
    
    @classmethod    
    def updateStatus(cls, connect, project_id, task_id, statusStep, statusProgress) -> int :

        table = Table("task")
        query = Query.update(table).set(
            "updated", fn.Now()
            ).set(
            "task_status_step", Parameter("%s")
            ).set(
            "task_status_progress", Parameter("%s")
            ).where(
                table.project_id==project_id
            ).where(
                table.task_id==task_id
            ) 
        query_data = [
            statusStep, statusProgress
        ]
        
        return DatabaseMgr.updateWithConnect(connect, query, query_data)
                              

    
    