from .ModelProjectDetail import ProjectDetail

class ProjectDetailEmpty(ProjectDetail):
    """
    ### ProjectDetailEmpty

 - 프로젝트 유형 - None, detail 없음

    """
    
    def __init__(self):
        pass
    
    def insertWith(self, connect, project_id) -> list:        
        return []
        
    @classmethod
    def fromDict(cls, data:dict):
        return cls()