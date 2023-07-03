
from .Base import ModelBase


class License(ModelBase):
    """
   ### License

 - License 현재는 task에만 적용

| name | type | length | desc |
| --- | --- | --- | --- |
| license_id | integer |  |  |
| license_name | string | 64 |  |
| license_url | string | 512 |  |
| license_desc | string | 512 |  |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, license_id, license_name, license_url, license_desc, created=None, updated=None):        
        self.license_id = license_id
        self.license_name = license_name
        self.license_url = license_url
        self.license_desc = license_desc
        
        super().__init__(created, updated) 
        
    @property
    def _license_id(self):
        return self.license_id
    
    @property
    def _license_name(self):
        return self.license_name
    @_license_name.setter
    def _license_name(self, license_name) -> None:
        self.license_name = license_name
    
    @property
    def _license_url(self):
        return self.license_url
    @_license_url.setter
    def _license_url(self, license_url) -> None:
        self.license_url = license_url    
    
    @property
    def _license_desc(self):
        return self.license_desc
    @_license_desc.setter
    def _license_desc(self, license_desc) -> None:
        self.license_desc = license_desc
                                        
