
from .Base import ModelBase
from .ModelUser import User
from .ModelStaticsTask import StaticsTask


class StaticsTaskByUser(ModelBase):
    """
    ### StaticsTaskByUser

 - 작업 상태 통계 : 사용자

| name | type | length | desc |
| --- | --- | --- | --- |
| user | <User> |  | 사용자 |
| statics_tasks | <StaticsTask>[] |  | task 통계 |
    """
    
    def __init__(self, user, statics_tasks):        
        
        self.user = User.createFrom(user, allowNone=True)
        self.statics_tasks = StaticsTask.createFrom(statics_tasks)
    
    @property
    def _user(self):
        return self.user
    @_user.setter
    def _user(self, user) -> None:
        self.user = user   
        
    @property
    def _statics(self):
        return self.statics
    @_statics.setter
    def _statics(self, statics) -> None:
        self.statics = statics
                                        
    @property
    def _statics_tasks(self):
        return self.statics_tasks
    @_statics_tasks.setter
    def _statics_tasks(self, statics_tasks) -> None:
        self.statics_tasks = statics_tasks
        
        
    