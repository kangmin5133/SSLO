
from exception import ArgsException
from .Base import ModelBase
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from log import logger

class Comment(ModelBase):
    """
    ### Comment

 - 댓글 
 

| name | type | length | desc |
| --- | --- | --- | --- |
| comment_id | integer |  |  |
| comment_body | string |  | 내용 |
| comment_creator | `model.User` |  | 작성자 |
| comment_updater | `model.User` |  | 수정한 사용자 |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, comment_id, comment_body, comment_creator, comment_updater=None, created=None, updated=None):        
        self.comment_id = comment_id
        self.comment_body = comment_body
        self.comment_creator = comment_creator
        
        # self.comment_updater  = comment_updater if comment_updater is not None else comment_creator
        self.comment_updater  = comment_updater 
        
        super().__init__(created, updated)    
    
    @property
    def _comment_id(self):
        return self.comment_id
    
    @property
    def _comment_body(self):
        return self.comment_body
    @_comment_body.setter
    def _comment_body(self, comment_body) -> None:
        self.comment_body = comment_body
    
    @property
    def _comment_creator(self):
        return self.comment_creator
    @_comment_creator.setter
    def _comment_creator(self, comment_creator) -> None:
        self.comment_creator = comment_creator   
    
    
    @property
    def _comment_updater(self):
        return self.comment_updater
    @_comment_updater.setter
    def _comment_updater(self, comment_updater) -> None:
        self.comment_updater = comment_updater   
    
    @classmethod
    def createIdInsertWith(cls, connect, comment_body, comment_creator_id) -> int:  
        
        table = Table("comment")
        query = Query.into(table).columns("comment_body", "comment_creator_id" )
        
        query = query.select(Parameter("%s"), Parameter("%s"))
        
        query_data = [comment_body, comment_creator_id]
        
        DatabaseMgr.updateWithConnect(connect, query, query_data)
        
        _id = connect.insert_id()
        
        return _id    
        
    @classmethod
    def updateWith(cls, connect, comment_id, comment_body, comment_updater_id) -> int:  
        
        table = Table("comment")
        query = Query.update(table).set(
            "comment_body",  Parameter("%s")
        ).set(
            "comment_updater_id", Parameter("%s")
        ).set(
            "updated", fn.Now()
        ).where(
            table.comment_id==comment_id
        )
                            
        query_data = [comment_body, comment_updater_id]
        
        count = DatabaseMgr.updateWithConnect(connect, query, query_data)

        return comment_id        
       
       
    @classmethod
    def createEmpty(cls):  
        return CommentEmpty()
    
    
class CommentEmpty(Comment):
    """
    ### CommentEmpty

 - empty 
 
    """
    
    def __init__(self):                
        
        super().__init__(comment_id=None, comment_body=None, comment_creator=None, comment_updater=None, created=None, updated=None)    
        