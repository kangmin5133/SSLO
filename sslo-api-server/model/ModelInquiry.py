
from exception import ArgsException
from .Base import ModelBase
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from log import logger

class Inquiry(ModelBase):
    """
    ### 문의 사항

 - 문의 사항 
 
| name | type | length | desc |
| --- | --- | --- | --- |
| inquiry_id | int |  | 문의 사항 id | PK
| user_id | `model.User` |  | 사용자 id |
| inquiry_type | string |  | 문의 유형 | 사이트, 계정, 솔루션, 기타
| inquiry_title | string |  | 문의 제목 |
| inquiry_user_display_name | string |  | 사용자 설정 이름 |
| inquiry_user_number | string |  | 사용자 연락처 |
| inquiry_user_email | string |  | 사용자 이메일 |
| inquiry_contents | string|  | 문의 내용 |
| inquiry_status | string|  | 답변 상태 |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, inquiry_id,user_id, inquiry_type, inquiry_title, inquiry_user_display_name,inquiry_user_number,
    inquiry_user_email,inquiry_contents,inquiry_status=None,created=None, updated=None):
        self.inquiry_id = inquiry_id   
        self.user_id = user_id
        self.inquiry_type = inquiry_type
        self.inquiry_title = inquiry_title
        self.inquiry_title = inquiry_title
        self.inquiry_user_display_name = inquiry_user_display_name
        self.inquiry_user_number = inquiry_user_number
        self.inquiry_user_email = inquiry_user_email
        self.inquiry_contents = inquiry_contents
        self.inquiry_status = inquiry_status
                
        super().__init__(created, updated)    
    
    @property
    def _inquiry_id(self):
        return self.inquiry_id
    @_inquiry_id.setter
    def _inquiry_id(self, inquiry_id) -> None:
        self.inquiry_id = inquiry_id
    
    @property
    def _user_id(self):
        return self.user_id
    
    @property
    def _inquiry_type(self):
        return self.inquiry_type
    @_inquiry_type.setter
    def _inquiry_type(self, inquiry_type) -> None:
        self.inquiry_type = inquiry_type

    @property
    def _inquiry_title(self):
        return self.inquiry_title
    @_inquiry_title.setter
    def _inquiry_title(self, inquiry_title) -> None:
        self.inquiry_title = inquiry_title

    @property
    def _inquiry_user_display_name(self):
        return self.inquiry_user_display_name
    @_inquiry_user_display_name.setter
    def _inquiry_user_display_name(self, inquiry_user_display_name) -> None:
        self.inquiry_user_display_name = inquiry_user_display_name

    @property
    def _inquiry_user_number(self):
        return self.inquiry_user_number
    @_inquiry_user_number.setter
    def _inquiry_user_number(self, inquiry_user_number) -> None:
        self.inquiry_user_number = inquiry_user_number

    @property
    def _inquiry_user_email(self):
        return self.inquiry_user_email
    @_inquiry_user_email.setter
    def _inquiry_user_email(self, inquiry_user_email) -> None:
        self.inquiry_user_email = inquiry_user_email
    
    @property
    def _inquiry_contents(self):
        return self.inquiry_contents
    @_inquiry_contents.setter
    def _inquiry_contents(self, inquiry_contents) -> None:
        self.inquiry_contents = inquiry_contents
    
    @property
    def _inquiry_status(self):
        return self.inquiry_status
    @_inquiry_status.setter
    def _inquiry_status(self, inquiry_status) -> None:
        self.inquiry_status = inquiry_status
    
    
    @classmethod
    def createIdInsertWith(cls, connect, inquiry_id,user_id,inquiry_type,inquiry_title,inquiry_user_display_name,inquiry_user_number,inquiry_user_email,inquiry_contents) -> int:  
        
        table = Table("inquiry")
        query = Query.into(table).columns("inquiry_id","user_id", "inquiry_type","inquiry_title","inquiry_user_display_name","inquiry_user_number","inquiry_user_email","inquiry_contents")
        
        query = query.select(Parameter("%s"), Parameter("%s"))
        
        query_data = [inquiry_id,user_id,inquiry_type,inquiry_title,inquiry_user_display_name,inquiry_user_number,inquiry_user_email,inquiry_contents]
        
        DatabaseMgr.updateWithConnect(connect, query, query_data)
        
        _id = connect.insert_id()
        
        return _id    
        
    @classmethod
    def updateWith(cls, connect, inquiry_id,user_id,inquiry_type,inquiry_title,inquiry_user_number,inquiry_contents) -> int:  
        
        table = Table("inquiry")
        query = Query.update(table).set(
            "inquiry_type",  Parameter("%s")
        ).set(
            "inquiry_title", Parameter("%s")
        ).set(
            "inquiry_user_number", Parameter("%s")
        ).set(
            "inquiry_contents", Parameter("%s")
        ).set(
            "updated", fn.Now()
        ).where(
            table.inquiry_id==inquiry_id
        )
                            
        query_data = [inquiry_type,inquiry_title,inquiry_user_number,inquiry_contents]
        
        count = DatabaseMgr.updateWithConnect(connect, query, query_data)

        return inquiry_id        
        