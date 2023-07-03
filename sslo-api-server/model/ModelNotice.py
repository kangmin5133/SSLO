
from exception import ArgsException
from .Base import ModelBase
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from log import logger

class Notice(ModelBase):
    """
    ### Notice

 - 공지사항 
 
| name | type | length | desc |
| --- | --- | --- | --- |
| notice_id | integer |  | 공지 번호 |
| notice_type | string |  | 공지종류(service ,work,faq) |
| if_faq_type | string |  | faq인 경우 faq 종류 (member, service, price, solution, error , etc) |
| notice_contents | text |  | 내용 |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, notice_id,notice_title,notice_type, notice_contents,if_faq_type=None,created=None, updated=None):        
        self.notice_id = notice_id
        self.notice_title = notice_title
        self.notice_type = notice_type
        self.notice_contents = notice_contents
        self.if_faq_type = if_faq_type

        super().__init__(created, updated)    
    
    @property
    def _notice_id(self):
        return self.notice_id
    
    @property
    def _notice_contents(self):
        return self.notice_contents
    @_notice_contents.setter
    def _notice_contents(self, notice_contents) -> None:
        self.notice_contents = notice_contents
    
    @property
    def _notice_type(self):
        return self.notice_type
    @_notice_type.setter
    def _notice_type(self, notice_type) -> None:
        self.notice_type = notice_type
    
    @property
    def _if_faq_type(self):
        return self.if_faq_type
    @_if_faq_type.setter
    def _if_faq_type(self, if_faq_type) -> None:
        self.if_faq_type = if_faq_type
    
    @property
    def _notice_title(self):
        return self.notice_title
    @_notice_title.setter
    def _notice_title(self, notice_title) -> None:
        self.notice_title = notice_title  
    
    @classmethod
    def createIdInsertWith(cls, connect,notice_type,notice_title,notice_contents, notice_id) -> int:  
        
        table = Table("notice")
        query = Query.into(table).columns("notice_id","notice_title","notice_type","notice_contents")
        
        query = query.select(Parameter("%s"), Parameter("%s"))
        
        query_data = [notice_title,notice_type,notice_contents]
        
        DatabaseMgr.updateWithConnect(connect, query, query_data)
        
        _id = connect.insert_id()
        
        return _id    
        
    @classmethod
    def updateWith(cls, connect, notice_id,notice_title, notice_type, notice_contents) -> int:  
        
        table = Table("notice")
        query = Query.update(table).set(
            "notice_type",  Parameter("%s")
        ).set(
            "notice_title", Parameter("%s")
        ).set(
            "notice_contents", Parameter("%s")
        ).set(
            "updated", fn.Now()
        ).where(
            table.notice_id==notice_id
        )
                            
        query_data = [notice_title,notice_type, notice_contents]
        
        count = DatabaseMgr.updateWithConnect(connect, query, query_data)

        return notice_id        
        