from datetime import datetime, timedelta

from model import InterfaceHasId
import config


# cache interface
class InterfaceCache:
    def __init__(self):
        self.cachedList = {}    

    def clearAll(self):
        self.cachedList.clear()
        
    def clear(self, _id):
        self.cachedList.pop(_id, None)
        
    def restore(self, _id) -> InterfaceHasId:
        cache = self.cachedList.get(_id, None)  # type: ignore
        if cache is None:
            return None
        cachedRegDate = cache.get("regDate")
        if config.isExpireCache:
            if datetime.now() > (cachedRegDate + config.LIMIT_EXPIRE_CACHE):
                self.clear(_id)
                return None
        
        return cache.get("data")                
        

    def store(self, obj:InterfaceHasId):
        
        if obj is None:
            return
        
        if obj.get_id() is None:
            return
        
        self.cachedList.update({ obj.get_id() : { "regDate" : datetime.now(), "data" : obj} })        

# cache
_cachedUser = InterfaceCache()
_cachedProject = InterfaceCache()

_projectForTask = {}
def _getCachedTask(project_id) -> InterfaceCache:
    cached = _projectForTask.get(project_id)
    if cached is None:
        _projectForTask[project_id] = InterfaceCache()
        
    return _projectForTask.get(project_id)

_annotationCategory = {} # 
def _getAnnotationCategory(project_id) -> dict:
    cached = _annotationCategory.get(project_id)
    if cached is None:
        _annotationCategory[project_id] = {}        
    return _annotationCategory.get(project_id)

_annotationType = {}
def _getAnnotationType(project_id) -> InterfaceCache:
    cached = _annotationType.get(project_id)
    if cached is None:
        _annotationType[project_id] = InterfaceCache()
    return _annotationType.get(project_id)


# update cache obj
def updateProject(project_id):
    _cachedProject.clear(project_id)
    
    _getCachedTask(project_id).clearAll()
    _getAnnotationType(project_id).clearAll()
    _getAnnotationCategory(project_id).clear()
    
def updateProjectMemberStatics(project_id):
    project = getProject(project_id)
    if project is None: 
        return None
    if project._project_member_statics is None:
        return None
    
    project._project_member_statics = None
                
def updateTask(project_id, task_id) :
    _getCachedTask(project_id).clear(task_id) 
    updateProjectMemberStatics(project_id)
        
def updateAnnotation(project_id, task_id, annotation_id):    
    _getCachedTask(project_id).clear(task_id)
    updateProjectMemberStatics(project_id)
    
def updateAnnotationType(project_id, annotation_type_id):
        
    _cachedProject.clear(project_id)
    
    _getCachedTask(project_id).clearAll()
    
    _getAnnotationType(project_id).clearAll()
    _getAnnotationCategory(project_id).clearAll()
    
def updateAnnotationCategories(project_id):
    _cachedProject.clear(project_id)
    _getCachedTask(project_id).clearAll()
    
    _getAnnotationType(project_id).clearAll()
    _getAnnotationCategory(project_id).clear()
    
def updateAnnotationCategory(project_id, annotation_category_id):
    _cachedProject.clear(project_id)
    _getCachedTask(project_id).clearAll()
    
    _getAnnotationType(project_id).clearAll()
    _getAnnotationCategory(project_id).clear()
    
def updateAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attribute_id):
    _cachedProject.clear(project_id)
    _getCachedTask(project_id).clearAll()
    
    _getAnnotationType(project_id).clearAll()
    _getAnnotationCategory(project_id).clear()
    
def updateUser(user_id):
    _cachedUser.clear(user_id)
    _cachedProject.clearAll() 
    _projectForTask.clear()

from model import Project, User, Task, AnnotationType, AnnotationCategory, AnnotationCategoryAttribute, StaticsProjectMember

# project
def getProject(project_id) -> Project:
    return _cachedProject.restore(project_id)

def storeProject(project:Project) -> Project:
    
    if config.isUseCache == False:
        return project
    
    if project is None:
        return
    _cachedProject.store(project)
    return getProject(project.get_id())

def getProjectMemeberStatics(project_id) -> StaticsProjectMember:
    project = getProject(project_id)
    if project is None: 
        return None
    if project._project_member_statics is None:
        return None
    
    return project._project_member_statics

def storeProjectMemberStatics(project_id, projectMemberStatics:StaticsProjectMember) -> StaticsProjectMember:
    
    if config.isUseCache == False:
        return projectMemberStatics
    
    project = getProject(project_id)
    if project is None: 
        return None
    
    project._project_member_statics = projectMemberStatics
    
    return getProjectMemeberStatics(project_id)

# task
def getTask(project_id, task_id) -> Task:
    return _getCachedTask(project_id).restore(task_id)

def storeTask(project_id, task:Task) -> Task:
    
    if config.isUseCache == False:
        return task
    
    if task is None:
        return
    _getCachedTask(project_id).store(task)
    return getTask(project_id, task.get_id())

# annotation_type 
def getAnnotationType(project_id, annotation_type_id):
    return _getAnnotationType(project_id).restore(annotation_type_id)

def storeAnnotationType(project_id, annotation_type:AnnotationType) -> AnnotationType:
    
    if config.isUseCache == False:
        return annotation_type
    
    if annotation_type is None:
        return
    _getAnnotationType(project_id).store(annotation_type)
    return getAnnotationType(project_id, annotation_type.get_id())

# annotation_category 
def getAnnotationCategories(project_id) -> dict:      
    cache = _getAnnotationCategory(project_id)
    if cache is None or len(cache) == 0:
        return None
    
    return cache

def storeAnnotationCategories(project_id, annotation_categories) -> dict:
    
    if config.isUseCache == False:
        return annotation_categories
    
    if annotation_categories is None:
        return None
    
    _annotationCategory[project_id] = annotation_categories
    return getAnnotationCategories(project_id)


def getAnnotationCategory(project_id, annotation_category_id) -> AnnotationCategory:      
    cache = _getAnnotationCategory(project_id)
    if cache is None or len(cache) == 0:
        return None
    
    annotation_category = cache.get(annotation_category_id)
    return annotation_category

def getAnnotationCategoryAttribute(project_id, annotation_category_id, annotation_category_attr_id) -> AnnotationCategoryAttribute:      
    
    annotation_category = getAnnotationCategory(project_id, annotation_category_id)
    if annotation_category is None:
        return None
    
    attrList = [attr for attr in annotation_category._annotation_category_attributes if attr.get_id() == annotation_category_attr_id]
    if attrList is None or len(attrList) != 1:
        return None
    
    return attrList[0]

# user
def getUser(user_id) -> User:
    return _cachedUser.restore(user_id)

def storeUser(user:User) -> User:
    
    if config.isUseCache == False:
        return user
    
    if user is None:
        return
    updateUser(user.get_id())
    _cachedUser.store(user)
    
    return getUser(user.get_id())
        

    
    


    
    
    