

from .ModelStaticsProjectMember import StaticsProjectMember


from .Base import ModelBase, InterfaceHasId
from .ModelUser import User
from .ModelProjectType import ProjectType
from .ModelPermission import Permission


class Project(ModelBase, InterfaceHasId):
    """
    ### Project

 - 프로젝트 정보

| name | type | length | desc | createable(* require) | updateable(* require) |
| --- | --- | --- | --- | --- | --- |
| project_id | integer |  |  | n | *n |
| project_name | string | 256 | 이름 | *y | y |
| project_desc | string | 512 | 설명 | *y | y |
| project_manager | <User> |  | 관리자 | y | y |
| project_members | [<User>] |  | 할당된 사용자 | y | y |
| project_status | integer |  | 프로젝트 상태 - 1: 생성 중, 2:진행 중, 3:완료 | n | n |
| project_permission | <Permission> |  | 권한 | n | n |
| project_type | <ProjectType> |  | 프로젝트 유형, 1:수집, 2: 정제, 3:전처리, 4: 가공 | *y | y |
| project_detail | <ProjectDetail> |  | 프로젝트 내 유형에 따른 정보 | *y | y |
| created | <Time> |  | 생성시간 | n | n |
| updated | <Time> |  | 변경시간 | n | n |
    """
    
    def __init__(self,project_id, project_name, project_manager,project_type, project_desc,project_members=None, project_detail=None, project_member_statics=None, project_permission=None, project_status=None, task_updated=None, created=None, updated=None):
        self.project_id = project_id
        self.project_name = project_name
        if project_manager is None:
            self.project_manager = project_manager
        else:
            self.project_manager = User.createFrom(project_manager)
        self.project_members = project_members     
        self.project_desc = project_desc
        self.project_permission = Permission.createFrom(project_permission, allowNone=True)
        
        self.project_type:ProjectType = ProjectType.createFrom(project_type)                  # type: ignore
        
        if self.project_type.isNeedProjectDetail():
            detailCls = self.project_type.getProjectDetailTypeClass()        
            self.project_detail = detailCls.createFrom(project_detail)
        else:
            self.project_detail = None

        self.project_member_statics = StaticsProjectMember.createFrom(project_member_statics, True)
        self.project_status = project_status

        super().__init__(created, updated)
    
    @property
    def _project_id(self):
        return self.project_id   
    
    def get_id(self):
        return self.project_id
        
    @property
    def _project_name(self):
        return self.project_name
    @_project_name.setter
    def _project_name(self, project_name) -> None:
        self.project_name = project_name
        
    @property
    def _project_manager(self):
        return self.project_manager
    @_project_manager.setter
    def _project_manager(self, project_manager) -> None:
        self.project_manager = project_manager

    @property
    def _project_members(self):
        return self.project_members
    @_project_members.setter
    def _project_members(self,project_members) -> None:
        self.project_members = project_members  
        
    @property
    def _project_desc(self):
        return self.project_desc
    @_project_desc.setter
    def _project_desc(self, project_desc) -> None:
        self.project_desc = project_desc   
    
    @property
    def _project_type(self):
        return self.project_type
    @_project_type.setter
    def _project_type(self, project_type) -> None:
        self.project_type = project_type
                            
    @property
    def _project_detail(self):
        return self.project_detail
    @_project_detail.setter
    def _project_detail(self, project_detail) -> None:
        self.project_detail = project_detail
        
    @property
    def _project_member_statics(self):
        return self.project_member_statics
    @_project_member_statics.setter
    def _project_member_statics(self, project_member_statics) -> None:
        self.project_member_statics = project_member_statics
    
    @property
    def _project_status(self):
        return self.project_status
    @_project_status.setter
    def _project_status(self, project_status) -> None:
        self.project_status = project_status
    
    def hasDetail(self) -> bool:
        if self.project_detail is None:
            return False        
        return True
