
from .Base import ModelBase
# from .StaticsTaskStep import StaticsTaskStep


class StaticsTask(ModelBase):
    """
    ### StaticsTask

 - 작업  통계 

| name | type | length | desc |
| --- | --- | --- | --- |
| statics_status_steps | <StaticsTaskStep>[] |  | Task step list |
| count | integer |  | 총 수 |
| task_last_updated | <Time> |  | Task의 마지막 updated 시간 |
    """
    
    def __init__(self, statics_status_steps, count, task_last_updated):        
        self.statics_status_steps = statics_status_steps
        self.count = count
        self.task_last_updated = task_last_updated
        
    @property
    def _statics_status_steps(self) -> list:
        return self.statics_status_steps
    @_statics_status_steps.setter
    def _statics_status_steps(self, statics_status_steps) -> None:
        self.statics_status_steps = statics_status_steps
        
    @property
    def _count(self):
        return self.count
    @_count.setter
    def _count(self, count) -> None:
        self.count = count
        
    @property
    def _task_last_updated(self):
        return self.task_last_updated
    @_task_last_updated.setter
    def _task_last_updated(self, task_last_updated) -> None:
        self.task_last_updated = task_last_updated
        
    