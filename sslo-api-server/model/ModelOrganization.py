# flask_login에서 제공하는 사용자 클래스 객체
# from flask_login import UserMixin
import bcrypt
import json

from .Base import ModelBase, InterfaceHasId

import utils

class Organization(ModelBase, InterfaceHasId):
    """
    ### Organization

 - 조직 정보

| name | type | length | desc |
| --- | --- | --- | --- |
| organization_id | int | 32 |  |
| organization_name | string | 32 |  |
| admin_id | string | 32 |  |
| organization_email | string | 321 | 조직 이메일 |
| token | | string | 이메일 인증 토큰 |
| organization_email_verification | |  | 이메일 인증 완료 여부 |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, organization_id, organization_name, admin_id, organization_email,organization_email_verification="false",token=None, created=None, updated=None):        
        self.organization_id = organization_id
        self.organization_name = organization_name
        self.admin_id = admin_id
        self.organization_email = organization_email
        self.token = token
        self.organization_email_verification = organization_email_verification
                
        super().__init__(created, updated)
        
    
    def get_id(self):
        return str(self.user_id)
    
    @property
    def _organization_id(self):
        return self.organization_id
    @_organization_id.setter
    def _organization_id(self, organization_id) -> None:
        self.organization_id = organization_id

    @property
    def _organization_name(self):
        return self.organization_name
    @_organization_name.setter
    def _organization_name(self, organization_name) -> None:
        self.organization_name = organization_name

    @property
    def _admin_id(self):
        return self.admin_id
    @_organization_id.setter
    def _admin_id(self, admin_id) -> None:
        self.admin_id = admin_id
        
    @property
    def _organization_email(self) -> str:
        return self.organization_email  # type: ignore
    @_organization_email.setter
    def _organization_email(self, organization_email) -> None:
        self.organization_email = organization_email
    
    @property
    def _token(self):
        return self.token
    @_token.setter
    def _token(self, token) -> None:
        self.token = token
    
    @property
    def _organization_email_verification(self):
        return self.organization_email_verification
    @_organization_email_verification.setter
    def _organization_email_verification(self, organization_email_verification) -> None:
        self.organization_email_verification = organization_email_verification
          
