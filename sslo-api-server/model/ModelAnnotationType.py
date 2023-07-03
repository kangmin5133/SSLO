
from .Base import ModelBase, InterfaceHasId


class AnnotationType(ModelBase, InterfaceHasId):
    """
    ### AnnotationType

 - type : bbox, polygon, segment 

| name | type | length | desc |
| --- | --- | --- | --- |
| annotation_type_id | integer |  |  |
| annotation_type_name | string | 32 | bbox, polygon, segment, keypoint |
| annotation_type_desc | string | 512 |  |
    """
    
    def __init__(self, annotation_type_id, annotation_type_name="", annotation_type_desc="", created=None, updated=None):        
        self.annotation_type_id = annotation_type_id
        self.annotation_type_name = annotation_type_name
        self.annotation_type_desc = annotation_type_desc        
            
        super().__init__(created, updated)
          
    def get_id(self):
        return self.annotation_type_id
        
    @property
    def _annotation_type_id(self):
        return self.annotation_type_id
    
    @property
    def _annotation_type_name(self):
        return self.annotation_type_name
    @_annotation_type_name.setter
    def _annotation_type_name(self, annotation_type_name) -> None:
        self.annotation_type_name = annotation_type_name
    
    @property
    def _annotation_type_desc(self):
        return self.annotation_type_desc
    @_annotation_type_desc.setter
    def _annotation_type_desc(self, annotation_type_desc) -> None:
        self.annotation_type_desc = annotation_type_desc        
        
    @classmethod
    def createDefault(cls):
        return AnnotationType(annotation_type_id=1, annotation_type_name="bbox", annotation_type_desc="" )
                                        
    