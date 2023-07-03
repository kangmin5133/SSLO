from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn

from exception import ArgsException, ExceptionCode
from .ModelProjectDetail import ProjectDetail
from .ModelAnnotationCategory import AnnotationCategory

class ProjectDetailProcessing(ProjectDetail):
    """
    ### ProjectDetailProcessing

 - 프로젝트 유형 - 가공

| name | type | length | desc |
| --- | --- | --- | --- |
| project_categories | <AnnotationCategory>[] |  | 프로젝트 내 클래스 정보 리스트 |
    """
    
    def __init__(self, project_categories:list):
        
        print(f"====> project_categories : {project_categories}")
        
        self.project_categories = list(map(AnnotationCategory.createFrom, project_categories))
        
                    
    @property
    def _project_categories(self):
        return self.project_categories
    @_project_categories.setter
    def _dataset_ids(self, project_categories) -> None:
        self.project_categories = project_categories
        
        
    def insertWith(self, connect, project_id, project_type_id) -> list:
        
        resultList = []                                        
        
        for c in self.project_categories:
                
            resultList_c = c.insertWith(connect, project_id)
            resultList.append(resultList_c)
                                
        return resultList
        
    
    
    