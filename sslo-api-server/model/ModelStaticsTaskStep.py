
from .Base import ModelBase
from .ModelStaticsTaskProgress import StaticsTaskProgress


class StaticsTaskStep(ModelBase):
    """
    ### StaticsTaskStep

 - 작업 단계  통계 

| name | type | length | desc |
| --- | --- | --- | --- |
| task_status_step | <TaskStatus>.task_status_step  |  | Task step |
| task_status_progress | <StaticsTaskProgress>[] |  | Task 진행 상태, TaskStatus>.task_status_progress 참조 |
| count | integer |  | 총 수 |
    """
    
    def __init__(self, task_status_step, task_status_progress, task_status_complete_count, count):        
        self.task_status_step = task_status_step
        self.task_status_progress = StaticsTaskProgress.createFrom(task_status_progress)
        self.task_status_complete_count = task_status_complete_count
        self.count = count        
            
    @property
    def _task_status_step(self):
        return self.task_status_step
    @_task_status_step.setter
    def _task_status_step(self, task_status_step) -> None:
        self.task_status_step = task_status_step
    
    @property
    def _task_status_progress(self):
        return self.task_status_progress
    @_task_status_progress.setter
    def _task_status_progress(self, task_status_progress) -> None:
        self.task_status_progress = task_status_progress

    @property
    def _task_status_complete_count(self):
        return self.task_status_complete_count
    @_task_status_complete_count.setter
    def _task_status_complete_count(self, task_status_complete_count) -> None:
        self.task_status_complete_count = task_status_complete_count
    
    @property
    def _count(self):
        return self.count
    @_count.setter
    def _count(self, count) -> None:
        self.count = count

    