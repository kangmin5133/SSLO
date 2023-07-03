
from enum import Enum, unique, IntEnum


@unique
class DataTypes(Enum):
    """_Project Type - datatype_
    """
    SelfSupplied = 1
    """_자체제공 데이터_
    """
    Crawling = 2
    """_크롤링_
    """
    Uploaded = 3
    """_사용자 보유 데이터_
    """
    @classmethod
    def default(cls):
        return cls.SelfSupplied

@unique
class ProjectTypes(Enum):
    """_Project Type
    """
    Collecting = 1
    """_수집_
    """
    PreProcessing = 2
    """_전처리_
    """
    Labeling = 3
    """_가공_
    """

@unique
class AnnotationTypes(Enum):        
    
    # annotaion tools
    BBox = 1
    """
    바운딩 박스 주석도구
    - 이미지 내에서 물체의 위치를 사각형으로 감싼 형태의 도형
    """
    Polygon = 2
    """
    폴리곤 주석도구
    - 다각형 모양으로 객체의 외곽선을 따라 점을 찍는 방법
    """
    
    Segmentation = 3
    """
    세그먼트 주석도구
    - 시맨틱 세그먼트는 이미지 내에 있는 객체들을 의미 있는 단위로 분할
    - 인스턴스 세그먼트는 동일한 클래스에 속하더라도 각각의 사물을 개별적으로 구분
    """
    
    Polyline = 4
    """
    폴리라인 주석도구 
    - 여러 개의 점을 가진 선을 활용
    """
    
    Point = 5
    """
    포인트 주석도구
    - 클래스에 해당되는 지점을 마우스로 클릭하여 점 형태로 지정
    """
    
    BrushPen = 6
    """
    브러쉬펜 주석도구
    - 마우스 커서가 원 형태로 전화되며 객체상에 드래그하여 세그맨테이션을 수행
    """
    
    Cube = 7
    """
    3D큐브 주석도구
    - 2D로 작업할 수 없는 3D객체들을 정육면체로 생성하는 라벨링 방식
    """
    
    MagicWand = 8
    """
    매직완드(magic wand) 주석도구
    - 객체 픽셀 상에 point 도구로 클릭 시 유사 픽셀 간 polygon을 생성
    """
    AutoPotint = 9
    """
    오토 포인트 주석도구
    - 객체가 있는 위치에 좌상단, 우하단 점 클릭만으로 자동 박싱 
    - 객체가 있는 위치에 좌상단, 우하단 점 클릭만으로 자동 폴리곤
    """
    KeyPoint = 10
    """
    키포인트 주석도구 (ex 손뼈대 아이콘) 
    - 사람, 동물 등에 스켈레톤 추출을 위한 도구 
    - 손 뼈대, 사람 뼈대, 동물 뼈대, 얼굴 랜드마크의 키포인트 제공
    - 원하는 모양대로 선택하여 작업 가능
    - 회전, 복사, 점 클릭하여 이동
    - 점 크기 조절 기능 포함
    - 템플릿 생성 시 노출
    """
    Human = 11
    """
    인간 인식 annotation type (bbox, segmentation, keypoint) 
    - object detection 의 bbox
    - instance segmentation의 polygon
    - keypoint detection 의 keypoint 데이터
    를 모두 포함한 annotation 데이터
    """
    
    @classmethod
    def default(cls):
        return cls.BBox  
    
    
@unique
class AutoLabelingTypes(Enum):
    # auto labeing
    ObjectDetect = 1
    """ 오브젝트 디텍팅
    """
    InstanceSegmentation = 2
    """ Instance Segmentation
    """

    SemanticSegmentation = 3
    """ Semantic Segmentation
    """
    HumanDetection = 4
    """ Only Human Detection (box + segment + keypoint)
    """
    
    @classmethod
    def default(cls):
        return cls.ObjectDetect   

@unique
class TaskStep(IntEnum):
    Work = 1,
    Validate = 2
    
    @classmethod
    def default(cls):
        return cls.Work   
    
@unique
class TaskProgress(IntEnum):
    NotYet = 1,
    Working = 2,
    Complete = 3,
    Reject = 4 
    
    @classmethod
    def default(cls):
        return cls.NotYet   
    
@unique
class CreatedOrUpdated(IntEnum):
    """_모델에 날짜, created , updated _

    """
    created = 1,
    updated = 2
    
    @classmethod
    def default(cls):
        return cls.created
    
@unique
class AnnotationFomat(IntEnum):
    """_annotation format _

    """
    COCO = 1
    
    @classmethod
    def default(cls):
        return cls.COCO
    
    
@unique
class WorkStatus(IntEnum):
    """_AI work status format _

    """
    Idle = 0
    Working = 1
    Complete = 2
    
    @classmethod
    def default(cls):
        return cls.Idle