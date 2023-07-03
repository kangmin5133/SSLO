from .Base import ModelBase, InterfaceHasId

class Dataset(ModelBase, InterfaceHasId):
    """
### Dataset

 - 데이터 집합 ( Rawdata 집합 )

| name | type | length | desc | createable(* require)  | updateable(* require) |
| --- | --- | --- | --- | --- | --- |
| dataset_id | integer |  |  | n | *n |
| dataset_name | string | 128 |  | *y | y |
| dataset_desc | string | 512 |  | *y | y |
| dataset_items_count | integer |  | 집합내에 item개수 | n | n |
| dataset_items_size | integer |  | 집합내에 item 총 개수 | n | n |
| dataset_category | string | 32 | 대부류 | y | y |
| dataset_sub_category | string | 32 | 소부류 | y | y |
| created | <Time> |  | 생성일 | n | n |
| updated | <Time> |  | 변경일 | n | n |
    """
    
    def __init__(self, dataset_id, dataset_name, dataset_desc=None, dataset_category=None, dataset_sub_category=None, dataset_items_count=0, dataset_items_size=0,  created=None, updated=None):        
        self.dataset_id = dataset_id
        self.dataset_name = dataset_name
        self.dataset_desc = dataset_desc
        self.dataset_category = dataset_category
        self.dataset_sub_category = dataset_sub_category
        self.dataset_items_count = dataset_items_count
        self.dataset_items_size = dataset_items_size
        
        super().__init__(created, updated)    
    
    def get_id(self):
        return self.dataset_id
    
    @property
    def _dataset_id(self):
        return self.dataset_id
    @_dataset_id.setter
    def _dataset_id(self, dataset_id) -> None:
        self.dataset_id = dataset_id
    
    @property
    def _dataset_name(self):
        return self.dataset_name
    @_dataset_name.setter
    def _dataset_name(self, dataset_name) -> None:
        self.dataset_name = dataset_name
    
    @property
    def _dataset_desc(self):
        return self.dataset_desc
    @_dataset_desc.setter
    def _dataset_desc(self, dataset_desc) -> None:
        self.dataset_desc = dataset_desc 
        
    @property
    def _dataset_category(self):
        return self.dataset_category
    @_dataset_category.setter
    def _dataset_category(self, dataset_category) -> None:
        self.dataset_category = dataset_category 
        
    @property
    def _dataset_sub_category(self):
        return self.dataset_sub_category
    @_dataset_sub_category.setter
    def _dataset_sub_category(self, dataset_sub_category) -> None:
        self.dataset_sub_category = dataset_sub_category 
        
    @property
    def _dataset_items_count(self):
        return self.dataset_items_count
    @_dataset_items_count.setter
    def _dataset_items_count(self, dataset_items_count) -> None:
        self.dataset_items_count = dataset_items_count   
        
    @property
    def _dataset_items_size(self):
        return self.dataset_items_size
    @_dataset_items_size.setter
    def _dataset_items_size(self, dataset_items_size) -> None:
        self.dataset_items_size = dataset_items_size
        
 
    
                                        
    