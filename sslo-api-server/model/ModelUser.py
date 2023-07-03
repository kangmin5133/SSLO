# flask_login에서 제공하는 사용자 클래스 객체
# from flask_login import UserMixin
import bcrypt
import json

from .Base import ModelBase, InterfaceHasId

import utils

class User(ModelBase, InterfaceHasId):
    """
    ### User

 - 사용자 정보

| name | type | length | desc |
| --- | --- | --- | --- |
| user_id | string | 32 |  |
| user_display_name | string | 256 |  |
| user_email | string | 321 |  |
| role_id | <UserRole> |  | 사용자 권한 |
| organization_id | |  | 소속 조직 id |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, user_id, user_display_name, user_email,role_id=None,organization_id=None, user_password=None, created=None, updated=None):        
        self.user_id = user_id
        self.user_display_name = user_display_name
        self.user_password = user_password
        self.user_email = user_email
        self.role_id = role_id
        self.organization_id = organization_id
                
        super().__init__(created, updated)
        
    
    def get_id(self):
        return str(self.user_id)
    
    @property
    def _user_id(self):
        return self.user_id
    @_user_id.setter
    def _user_id(self, user_id) -> None:
        self.user_id = user_id
        
    @property
    def _user_password(self) -> str:
        return self.user_password  # type: ignore
    @_user_password.setter
    def _user_password(self, user_password) -> None:
        self.user_password = bcrypt.hashpw(user_password.encode("utf-8"), bcrypt.gensalt()).decode('utf-8')  
    
    @property
    def _user_display_name(self):
        return self.user_display_name
    @_user_display_name.setter
    def _user_display_name(self, user_display_name) -> None:
        self.user_display_name = user_display_name
    
    @property
    def _user_email(self):
        return self.user_email
    @_user_email.setter
    def _user_email(self, user_email) -> None:
        self.user_email = user_email

    @property
    def _role_id(self):
        return self.role_id
    @_role_id.setter
    def _role_id(self, role_id) -> None:
        self.role_id = role_id
    
    @property
    def _organization_id(self):
        return self.organization_id
    @_organization_id.setter
    def _organization_id(self, organization_id) -> None:
        self.organization_id = organization_id
                    
    @property
    def _user_role(self):
        return self.user_role
    @_user_role.setter
    def _user_role(self, user_role) -> None:
        self.user_role = user_role
      
    
    # password
    def check_password(self, user_password) -> bool:   
        
        if self.user_password is None:
            return False
           
        if utils.getOrDefault(self.user_password) is None:
            return False
                   
        #return self.user_password == user_password                
        return bcrypt.checkpw(user_password.encode("utf-8"), self.user_password.encode('utf-8'))

        
    def toDict(self):
        mydict = super().toDict().copy()
        mydict.pop('user_password', None)
        return mydict    
