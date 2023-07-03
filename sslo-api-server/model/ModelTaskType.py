from .Base import ModelBase

class TaskType(ModelBase):
    """
    ### TaskType

| name | type | length | desc |
| --- | --- | --- | --- |
| task_type_id | integer |  |  |
| task_type_name | string |  | 종류 : image |
    """
    
    def __init__(self, task_type_id, task_type_name, created=None, updated=None):
        self.task_type_id = task_type_id
        self.task_type_name = task_type_name 
        
        super().__init__(created, updated)
    
    @property
    def _task_type_id(self):
        return self.task_type_id
    @_task_type_id.setter
    def _user_name(self, task_type_id) -> None:
        self.task_type_id = task_type_id
        
    @property
    def _task_type_name(self):
        return self.task_type_name
    @_task_type_name.setter
    def _task_type_name(self, task_type_name) -> None:
        self.task_type_name = task_type_name            
    
    def isNeedDetail(self) -> bool:
        """
        현재 타입이 taskDetail이 있어야 하는 타입인지
        True: detail이 있어야 하는 타입
        """
        needImageTypeList = [1,]
                
        if self.task_type_id in needImageTypeList:
            return True
        
        return False
        
    
    @classmethod
    def createDefault(cls):
        return cls(task_type_id=1, task_type_name='image' )
