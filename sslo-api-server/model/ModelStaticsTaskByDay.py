
from .Base import ModelBase
from .ModelStaticsTask import StaticsTask
import utils

class StaticsTaskByDay(ModelBase):
    """
    ### StaticsTaskByDay

 - 작업 상태 통계 : 일별

| name | type | length | desc |
| --- | --- | --- | --- |
| day | <Date> |  | 날짜 |
| statics_tasks | <StaticsTask> |  | task 통계 |
    """
    
    def __init__(self, day, statics_tasks):        
                
        # self.day = utils.toMillisecondFrom(day)
        self.day = utils.toFormattedDateStr(day)
        self.statics_tasks = StaticsTask.createFrom(statics_tasks)
    
    @property
    def _day(self):
        return self.day
    @_day.setter
    def _day(self, day) -> None:
        self.day = day   
        
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
        
        
    