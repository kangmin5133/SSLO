from .Base import ModelBase


class TaskStatus(ModelBase):
    """
    ### TaskStatus

 - 작업 상태

| name | type | length | desc |
| --- | --- | --- | --- |
| task_status_step | integer |  | 단계 - 1,2( 1 :수집,정제,가공  2: 검수)  |
| task_status_progress | integer |  | 상태 - 1,2,3,4 ( 1:미작업, 2:진행중,가공중 3.완료 4.반려) |
| task_status_extra | string | 512 | 부가 정보 |


    """
    
    def __init__(self, task_status_step:int, task_status_progress:int, task_status_extra=None):
        self.task_status_step = task_status_step
        self.task_status_progress = task_status_progress
        self.task_status_extra = task_status_extra
            
    @property
    def _task_status_step(self) -> int:
        return self.task_status_step
    @_task_status_step.setter
    def _user_name(self, task_status_step:int) -> None:
        self.task_status_step = task_status_step
        
    @property
    def _task_status_progress(self):
        return self.task_status_progress
    @_task_status_progress.setter
    def _task_status_progress(self, task_status_progress) -> None:
        self.task_status_progress = task_status_progress    
        
    @property
    def _task_status_extra(self):
        return self.task_status_extra
    @_task_status_extra.setter
    def _task_status_extra(self, task_status_extra) -> None:
        self.task_status_extra = task_status_extra  
          
    @classmethod
    def createDefault(cls):
        return TaskStatus(task_status_step=1, task_status_progress=1 )
        

