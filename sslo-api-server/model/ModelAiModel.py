from .Base import ModelBase, InterfaceHasId

class AiModel(ModelBase):
    """
### Ai Model configuration

 - AI 모델 설정 값

| name | type | length | desc | default  | updateable(* require) |
| --- | --- | --- | --- | --- | --- |
| project_id | integer |  | 프로젝트 id | NULL | *n |
| model_name | string | 100 | OD or SEG 기본 사용 모델 | R_50_FPN_3x | y |
| model_aug | int |  | 데이터 증강 계수 | 20 | y |
| model_epoch | int |  | epoch 설정 | 1000 | y |
| model_lr | float |  | learning rate 설정 | 0.00025 | n |
| model_conf | float |  | 학습완료된 모델 추론시 confidence 설정 | 0.5 | y |
| model_batch | int |  | 학습시 batch_size 설정 | 2 | y |
| created | <Time> |  | 생성일 | n | n |
| updated | <Time> |  | 변경일 | n | n |
    """
    
    def __init__(self, project_id, model_name=None, model_aug=None, model_epoch=None, model_lr=None, model_conf=None, model_batch=None,  created=None, updated=None):        
        self.project_id = project_id
        self.model_name = model_name
        self.model_aug = model_aug
        self.model_epoch = model_epoch
        self.model_lr = model_lr
        self.model_conf = model_conf
        self.model_batch = model_batch
        
        super().__init__(created, updated)    

    @property
    def _project_id(self):
        return self.project_id
    @_project_id.setter
    def _project_id(self, project_id) -> None:
        self.project_id = project_id
    
    @property
    def _model_name(self):
        return self.model_name
    @_model_name.setter
    def _model_name(self, model_name) -> None:
        self.model_name = model_name
    
    @property
    def _model_aug(self):
        return self.model_aug
    @_model_aug.setter
    def _model_aug(self, model_aug) -> None:
        self.model_aug = model_aug 
        
    @property
    def _model_epoch(self):
        return self.model_epoch
    @_model_epoch.setter
    def _model_epoch(self, model_epoch) -> None:
        self.model_epoch = model_epoch 
        
    @property
    def _model_lr(self):
        return self.model_lr
    @_model_lr.setter
    def _model_lr(self, model_lr) -> None:
        self.model_lr = model_lr 
        
    @property
    def _model_conf(self):
        return self.model_conf
    @_model_conf.setter
    def _model_conf(self, model_conf) -> None:
        self.model_conf = model_conf   
        
    @property
    def _model_batch(self):
        return self.model_batch
    @_model_batch.setter
    def _model_batch(self, model_batch) -> None:
        self.model_batch = model_batch
        
 
    
                                        
    