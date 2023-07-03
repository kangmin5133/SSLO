from .Base import ModelBase


class StaticsProjectMember(ModelBase):
    """
    ### StaticsProjectMember

 - 프로젝트 멤버 현황(작업자 현황)

| name | type | length | desc |
| --- | --- | --- | --- |
| task_count_total | integer |  | 총 task 수 |
| task_count_complete | integer |  | 완료 task 수 |
| count_worker | integer |  | 작업자 수 |
| count_validator | integer |  | 검증자 수 |
| task_updated | <Time> |  | task 최종 업데이트 시간 |
    """
    
    def __init__(self, task_count_total, task_count_complete, count_worker, count_validator, task_updated):
        self.task_count_total = task_count_total
        self.task_count_complete = task_count_complete
        self.count_worker = count_worker
        self.count_validator = count_validator         
        self.task_updated = task_updated
    
    @property
    def _task_count_total(self):
        return self.task_count_total
    @_task_count_total.setter
    def _task_count_total(self, task_count_total) -> None:
        self.task_count_total = task_count_total
        
    @property
    def _task_count_complete(self):
        return self.task_count_complete
    @_task_count_complete.setter
    def _task_count_complete(self, task_count_complete) -> None:
        self.task_count_complete = task_count_complete
    
    @property
    def _count_worker(self):
        return self.count_worker
    @_count_worker.setter
    def _count_worker(self, count_worker) -> None:
        self.count_worker = count_worker
        
    @property
    def _count_validator(self):
        return self.count_validator
    @_count_validator.setter
    def _count_validator(self, count_validator) -> None:
        self.count_validator = count_validator    
        
    @property
    def _count(self):
        return self.count
    @_count.setter
    def _count(self, count) -> None:
        self.count = count
        
    @property
    def _task_updated(self):
        return self.task_updated
    @_task_updated.setter
    def _task_updated(self, task_updated) -> None:
        self.task_updated = task_updated  
        

    
