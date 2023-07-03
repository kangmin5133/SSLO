# flask_login에서 제공하는 사용자 클래스 객체

from .Base import ModelBase


class UserRole(ModelBase):
    """
    ### UserRole

 - 사용자 역할( 권한 )

| name | type | length | desc |
| --- | --- | --- | --- |
| is_admin | boolean |  | 시스템 어드민 여부 |
| is_manager | boolean |  | 프로젝트 매니저 여부 |
| managed_projects | Array`model.Project` |  | PM(project manager)인 프로젝트 리스트 |
    """
    
    def __init__(self, is_admin=False,is_manager=False, managed_projects=[]): 
                      
        self.is_admin = bool(is_admin)
        self.is_manager = bool(is_manager)
        
        if isinstance(managed_projects, str) :
            self.managed_projects = list(map(int, managed_projects.split(","))) 
            
        if managed_projects is None:
            self.managed_projects = []        
    
    @property
    def _is_admin(self):
        return self.is_admin
    @_is_admin.setter
    def _is_admin(self, is_admin) -> None:
        self.is_admin = is_admin    

    @property
    def _is_manager(self):
        return self.is_manager
    @_is_manager.setter
    def _is_manager(self, is_manager) -> None:
        self.is_manager = is_manager       
    
    @property
    def _managed_projects(self):
        return self.managed_projects
    @_managed_projects.setter
    def _managed_projects(self, managed_projects) -> None:
        self.managed_projects = managed_projects 
        
        
    @classmethod
    def createEmpty(cls):
        
        return UserRole(is_admin=False,is_manager=False, managed_projects=[])
