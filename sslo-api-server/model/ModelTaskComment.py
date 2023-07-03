from .Base import ModelBase
from .ModelTaskStatus import TaskStatus
from .ModelComment import Comment


class TaskComment(ModelBase):
    """
    ### TaskComment

 - 작업 상태

| name | type | length | desc |
| --- | --- | --- | --- |
| task_status | <TaskStatus> |  | 단계 - 1,2( 1 :수집,정제,가공  2: 검수)  |
| comment | <Comment> |  | 댓글(사유) |


    """
    
    def __init__(self, task_status, comment):
        self.task_status = TaskStatus.createFrom(task_status)
        self.comment = Comment.createFrom(comment, allowNone=True)
            
    @property
    def _task_status(self):
        return self.task_status
    @_task_status.setter
    def _user_name(self, task_status) -> None:
        self.task_status = task_status
        
    @property
    def _comment(self):
        return self.comment
    @_comment.setter
    def _comment(self, comment) -> None:
        self.comment = comment    
        

