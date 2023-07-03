
from .Base import ModelBase
from .ModelAnnotationCategory import AnnotationCategory


class StaticsProjectCategory(ModelBase):
    """
    ### StaticsProjectCategory

 - 프로젝트 Category  통계 

| name | type | length | desc |
| --- | --- | --- | --- |
| category | <AnnotationCategory> |  | class |
| count | integer |  | 총 수 |
    """
    
    def __init__(self, category, count):        
        self.category = AnnotationCategory.createFrom(category)
        self.count = count        
            
    @property
    def _category(self):
        return self.category
    @_category.setter
    def _category(self, category) -> None:
        self.category = category
    
    @property
    def _count(self):
        return self.count
    @_count.setter
    def _count(self, count) -> None:
        self.count = count

    