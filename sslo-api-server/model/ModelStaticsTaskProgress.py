
from functools import reduce
from .Base import ModelBase

class StaticsTaskProgress(ModelBase):
    """
    ### StaticsTaskProgress

 - 작업 진행 상태 통계 

| name | type | length | desc |  |
| --- | --- | --- | --- | --- |
| id | integer |  |  1: 미작업, 2:작업중, 3:작업완료, 4:반려<TaskStatus>.task_status_progress  |  |
| name | string |  |  |  |
| count | integer |  | 총 개수 |  |
    """
    
    def __init__(self, id, name, count = None):
        self.id = id
        self.name = name
        self.count = count

    @property
    def _id(self) -> list:
        return self.id
    @_id.setter
    def _id(self, id):
        self.id = id
        
    @property
    def _name(self) -> list:
        return self.name
    @_name.setter
    def _name(self, name):
        self.name = name
        
    @property
    def _count(self) -> list:
        return self.count
    @_count.setter
    def _count(self, count):
        self.count = count
            
            
    