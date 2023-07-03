from .Base import ModelBase
from .ModelProjectDetailCollect import ProjectDetailCollect
from .ModelProjectDetailProcessing import ProjectDetailProcessing
from .Base import ModelBase, InterfaceHasId
import config

class ProjectType(ModelBase, InterfaceHasId):
    """
    ### ProjectType

 - 프로젝트 유형 : 정제, 전처리, 가공

| name | type | length | desc |
| --- | --- | --- | --- |
| project_type_id | integer |  |  |
| project_type_name | string | 32 |  |
    """
    
    def __init__(self, project_type_id, project_type_name, created=None, updated=None):
        self.project_type_id = project_type_id
        self.project_type_name = project_type_name 
        
        super().__init__(created, updated)
    
    def get_id(self):
        return self.project_type_id
    
    @property
    def _project_type_id(self):
        return self.project_type_id
    @_project_type_id.setter
    def _user_name(self, project_type_id) -> None:
        self.project_type_id = project_type_id
        
    @property
    def _project_type_name(self):
        return self.project_type_name
    @_project_type_name.setter
    def _project_type_name(self, project_type_name) -> None:
        self.project_type_name = project_type_name    
        
        
    def getProjectDetailTypeClass(self):
        return ProjectType.getProjectDetailTypeMap().get(self._project_type_id, None)
    
    def isNeedProjectDetail(self):
        typeClass = self.getProjectDetailTypeClass()
        if  typeClass is None:
            return False
    
        return True
    
    def hasImageDetail(self):
        
        return True
    
    def hasAnnotation(self):
        if self.getProjectDetailTypeClass() == ProjectDetailProcessing:
            return True
        
        return False
       
    @classmethod
    def getProjectDetailTypeMap(cls):
        return {
            1 : ProjectDetailCollect,
            3 : ProjectDetailProcessing,
        }
        
    
