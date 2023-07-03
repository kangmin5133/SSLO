

import time
from datetime import datetime, timedelta
import json
from model import License, ModelBaseJSONEncoder
from model import User
from model import Project, ProjectType, StaticsProjectMember
from model import ProjectDetail, ProjectDetailCollect, ProjectDetailProcessing
from model import Annotation, AnnotationCategory, AnnotationCategoryAttribute, AnnotationType
from model import SearchResult, PageInfo

from log import logger
from config.SSLOEnums import TaskStep, TaskProgress, DataTypes, WorkStatus, ProjectTypes
from exception import ArgsException, ExceptionCode
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct
from service.permission import PermissionMgr
from service import serviceAnnotation, serviceDataset, serviceUser, serviceTask, serviceRawdata
from service.cache import CacheMgr
import utils
from utils import DataPathProject
import config


working = {}
"""
key : project_id
value : 
    updated : 마지막 상태 변경 시간
    status : 
        - 미작업 : WorkStatus.Idle 또는 None  
        - 작업중 : WorkStatus.Working
        - 작업완료 : WorkStatus.Complete
"""

def isWorking(project_id) -> bool:
    
    projectStat = working.get(project_id)
    if projectStat is None:
        return False
    
    status = projectStat.get("status")
    updated = projectStat.get("updated")
    if status is None or status == WorkStatus.Idle:
        return False
    elif status == WorkStatus.Working:       
        return True
    else:
        return False        
    
def completeWork(project_id):
    working.pop(project_id, None)
    
    
def waitForWork(project_id):
    start = datetime.now()
    diff_seconds = config.MAX_WAIT_FOR_WORK
    while isWorking(project_id):
        time.sleep(5)
        
        at = datetime.now() - start  
        if at > diff_seconds:
            raise TimeoutError(f"timeout for sync data(project_id:{project_id})")
        
    #set work        
    projectStat = {
        "updated" : datetime.now(),
        "status" : WorkStatus.Working
    }
    working[project_id] = projectStat            


def parseProjectMemberStaticsFrom(project_id, resultQuery) -> StaticsProjectMember:
            
    # project_member_statics
    
    #
    task_count_total = resultQuery.pop("task_count_total")
    if task_count_total is None:
        raise ArgsException(f"Project({project_id}), task_count_total is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)    
    task_count_complete = resultQuery.pop("task_count_complete")
    
    if task_count_complete is None:
        raise ArgsException(f"Project({project_id}), task_count_complete is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    count_worker = resultQuery.pop("count_worker")
    if count_worker is None:
        raise ArgsException(f"Project({project_id}), count_worker is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    count_validator = resultQuery.pop("count_validator")
    if count_validator is None:
        raise ArgsException(f"Project({project_id}), count_validator is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    task_updated = resultQuery.pop("task_updated")  
    
    return StaticsProjectMember(task_count_total, task_count_complete, count_worker, count_validator, task_updated )

def getCountByAnnoType(project_id:int,anno_type:int):
    
    task_infos = serviceTask.getTasks(project_id)
    label_info_list = []
    for categories in task_infos[0].task_project.project_detail.project_categories:
        label_info_list.append({"category_id":categories.annotation_category_id,
                                        "category_name":categories.annotation_category_name,
                                        "labeled_instance_count":0})
    for task_info in task_infos:
        if int(task_info.task_status.task_status_step) == 2 and \
            int(task_info.task_status.task_status_progress) == 3:
            annoinfo = serviceAnnotation.findAnnotationBy(project_id, task_info.task_id, maxResults = 100)
            for anno in annoinfo.datas:
                if int(anno.annotation_type.annotation_type_id) == anno_type:
                    for i in range(len(label_info_list)):
                         if label_info_list[i]["category_id"] == anno.annotation_category.annotation_category_id : 
                             label_info_list[i]["labeled_instance_count"] +=1
                             
    return {"labeling_type": anno_type, "label_info":label_info_list}

def getCategoryAnnoCnt(project_id):
    """
    return data type : Dict
    example : 
    [	
        {
            "labeling_type": 1
            "label_info"   :
                {"category_id" : 0, "category_name" : "person" , "labeled_count" : 3},
                {"category_id" : 1, "category_name" : "bicycle" , "labeled_count" : 1}
        },
        {
            "labeling_type": 2
            "label_info"   :
                {"category_id" : 0, "category_name" : "person" , "labeled_count" : 1}
                {"category_id" : 1, "category_name" : "bicycle" , "labeled_count" : 0}
        }
    ]
    """    
    return [getCountByAnnoType(project_id,1),getCountByAnnoType(project_id,2)]

def paraseProjectFrom(resultQuery, hasDetail=True) -> Project:
    data = {}
    
    # project_id
    project_id = resultQuery.pop("project_id")
    data["project_id"] = project_id
    
    if project_id is None:
        return None
    
    # project_name
    data["project_name"] = resultQuery.pop("project_name")
    
    # project_desc
    data["project_desc"] = resultQuery.pop("project_desc")
    
    # project_status
    data["project_status"] = resultQuery.pop("project_status")
    
    # project_type
    project_type_id = resultQuery.pop("project_type_id")
    if project_type_id is None:
        raise ArgsException(f"Project({project_id}), project_type is null", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    project_type = getProjectType(project_type_id)
    if project_type is None:
        raise ArgsException(f"Project({project_id}), project_type_id({project_type_id}) is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    data["project_type"] = project_type    
    
    # project detail
    if hasDetail and project_type.isNeedProjectDetail(): 
        project_detail = getProjectDetail(project_id, project_type)        
        data["project_detail"] = project_detail
    
    # project manager 
    project_manager = None
    project_manager_id = resultQuery.pop("project_manager_id")
    if project_manager_id is not None:
        project_manager = serviceUser.getUser(project_manager_id)
        if project_manager is None:
            raise ArgsException(f"Project({project_id}), project_manager({project_manager_id}) is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    data["project_manager"] = project_manager

    # project members 
    members_list = []
    project_member_ids = resultQuery.pop("project_member_ids")
    if project_member_ids is not None:
        project_member_ids = project_member_ids.split(",")
        if len(project_member_ids) > 0:           
            for member in project_member_ids:
                project_member = serviceUser.getUser(member)
                if project_member is None:
                    raise ArgsException(f"Project({project_id}), project_member_ids({project_member}) is wrong", ExceptionCode.INTERNAL_SERVER_ERROR)
                members_list.append(project_member)
                
    elif project_member_ids is None :
        members_list.append(project_manager)
    
    data["project_members"] = members_list
     # project permission
    is_admin, is_project_manager, project_permission = PermissionMgr.get_permission_project(serviceUser.getCurrentUserID(), project_id)
    data["project_permission"] = project_permission
        
    # created
    data["created"] = resultQuery.pop("created")
    
    # updated
    data["updated"] = resultQuery.pop("updated")
                   
    #
    project:Project = Project.createFrom(data)    # type: ignore
    
    return project



def getProjectType(project_type_id) -> ProjectType:
    result = DatabaseMgr.selectOne("SELECT * from project_type where project_type_id=%s", project_type_id )
    if result is None:
        return None  # type: ignore
    
    return ProjectType.createFrom(result)  # type: ignore


def getProjectMemberStatcis(project_id, isClearCache=False) -> StaticsProjectMember:
    if isClearCache:        
        CacheMgr.updateProjectMemberStatics(project_id)
        
    projectMemberStatics = CacheMgr.getProjectMemeberStatics(project_id)
    if projectMemberStatics is not None:
        return projectMemberStatics
    
    
    table_project = Table("project")
    table_task = Table("task")
    query = Query.from_(table_project).left_join(table_task).on(table_task.project_id==table_project.project_id)
    query = query.where(table_project.project_id==project_id)
    
    querySelect = query.select(
        
        fn.Count(table_task.task_id).as_("task_count_total"), 
        fn.Count( Case()
                .when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1)
                .else_( None ) 
                ).as_( "task_count_complete" ),
        
        fn.Count( Case().when( table_task.task_worker_id.notnull(),1).else_(None) ).as_( "count_worker" ),
        fn.Count( Case().when( table_task.task_validator_id.notnull() ,1).else_(None) ).as_( "count_validator" ),
        fn.Max(table_task.updated).as_( "task_updated" )
    )

    result:dict = DatabaseMgr.selectOne(querySelect)  # type: ignore
    
    if result is None:
        return None  
    
    projectMemberStatics = parseProjectMemberStaticsFrom(project_id, result)    
    return CacheMgr.storeProjectMemberStatics(project_id, projectMemberStatics)
    

def getProject(project_id, isClearCache=False) -> Project:
    """프로젝트 가져오기_

    Args:
        project_id (_type_): _description_

    Returns:
        Project: _description_
    """
    logger.debug ( f" project_id type : {type(project_id)}")

    if isClearCache:        
        CacheMgr.updateProject(project_id)
        
    project = CacheMgr.getProject(project_id)
    if project is not None:
        project._project_member_statics = getProjectMemberStatcis(project_id)
        return project
        
    table_project = Table("project")
    table_task = Table("task")
    query = Query.from_(table_project).left_join(table_task).on(table_task.project_id==table_project.project_id)
    query = query.where(table_project.project_id==project_id)
    
    querySelect = query.select(
        table_project.project_id,
        table_project.project_name,
        table_project.project_desc,
        table_project.project_status,
        table_project.project_type_id,
        table_project.project_manager_id,
        table_project.project_member_ids,
        table_project.created,
        table_project.updated                
    )

    result:dict = DatabaseMgr.selectOne(querySelect)  # type: ignore
    
    if result is None:
        return None  

    project = paraseProjectFrom(result, hasDetail=True)
    if project is None:
        return None  
    
    project._project_member_statics = getProjectMemberStatcis(project_id)
    CacheMgr.storeProject(project)
    
    return project



def getProjectDetail(project_id, project_type:ProjectType) -> ProjectDetail:
    """_get_project_detail_

    Args:
        project_id (_type_): _description_
        project_type (ProjectType): _description_

    Returns:
        ProjectDetail: _description_
    """

     # 
    logger.info(f"====> get_project_detail : {project_id}, {project_type}")
    

    if project_type.getProjectDetailTypeClass() == ProjectDetailCollect:
        return getProjectDetailCollect(project_id=project_id, project_type=project_type)
    
    if project_type.getProjectDetailTypeClass() == ProjectDetailProcessing:
        return getProjectDetailProcessing(project_id=project_id, project_type=project_type)
    
    return None  # type: ignore
    
def getProjectDetailProcessing(project_id, project_type:ProjectType) -> ProjectDetailProcessing:
    
    logger.info(f"=====> get_project_detail_processing project_type.getProjectDetailTypeClass()  : {project_type.getProjectDetailTypeClass() }")

    # 
    categories = serviceAnnotation.getAnnotationCategories(project_id)
    if len(categories) > 0:
        project_categories = list(categories.values())        
    else:
        project_categories = []
        
    jsonData = {
        "project_categories" : project_categories
    }
    
    return ProjectDetailProcessing.createFrom(jsonData)  # type: ignore

        

def getProjectDetailCollect(project_id, project_type:ProjectType) -> ProjectDetailCollect:

    table = Table("project_detail")    
    query = Query.from_(table).select(
         "project_type_id", "item_name", "item_val", "item_val_int", "item_val_datetime"
        ).where(
            table.project_id == Parameter("%s")
        )
    query_data = (project_id)

    results = DatabaseMgr.select(query, query_data)
    if results is None or len(results) == 0:
        return None  # type: ignore
    
    logger.info(f"---> results : {results}")
    
    jsonData = {}
    for r in results:
        key = r.get("item_name")
        val = None
        
        if r.get("item_val") is not None:
            val = r.get("item_val")
        if r.get("item_val_int") is not None:
            val = r.get("item_val_int")
        if r.get("item_val_datetime") is not None:
            val = r.get("item_val_datetime")
            
            
        if val is None :
            raise ArgsException(f""" project_detail({project_id}), "{key}" is wrong """, ExceptionCode.INTERNAL_SERVER_ERROR)
        
        jsonData.update({
            key: val
        })
    
    logger.info(f" ------> jsonData : {jsonData}")
    
    return project_type.getProjectDetailTypeClass().createFrom(jsonData)          # type: ignore

    
def getPredefinedProcessing() -> str:
    
    annotationCategories = serviceAnnotation.getAnnotationCategoriesPredefined()
    if annotationCategories is None or len(annotationCategories) == 0:
        annotationCategories = []
    else:
        annotationCategories = list(annotationCategories.values())
        
    return json.dumps( { "project_categories" : annotationCategories }, cls=ModelBaseJSONEncoder, ensure_ascii=False)
        
def createProject(jsonData) -> Project:
    """프로젝트 생성 _

    Args:
        project (_type_): _description_

    Returns:
        Project: _description_
    """
    
    jsonData["project_id"] = None
    
    
    # project_manager
    project_manager = jsonData.get("project_manager")
    if project_manager is not None:
        project_manager_id = project_manager.get("user_id")
        
        if project_manager_id is None:
            raise ArgsException("project_manager is wrong")
        
        project_manager = serviceUser.getUser(project_manager_id)
        if project_manager is None:
            raise ArgsException("project_manager({project_manager_id}) is not exsist")
        
    if project_manager is None:
        project_manager = serviceUser.getCurrentUser()                  
    
    jsonData["project_manager"] = project_manager
    
    
    # project_type    
    project_type = jsonData.get("project_type")
    if project_type is None:
        raise ArgsException("project_type is missing")
    
    project_type_id =  utils.getOrDefault(project_type.get("project_type_id"))
    if project_type_id is None:
        raise ArgsException("project_type is wrong") 
    
    project_type = getProjectType(project_type_id)
    if project_type is None:
        raise ArgsException("project_type is wrong")
    
    jsonData["project_type"] = project_type
    
    
    # 
    project:Project = Project.createFrom(jsonData)          # type: ignore
    
    logger.info(f"----------> create_project : {project}")
    logger.info(f"----------> create_project project._project_detail : {project._project_detail}")
    
    # make query
    table = Table("project")    
    query = Query.into(table).columns("project_name", "project_desc", "project_type_id", "project_manager_id").select(
                Parameter("%s"), Parameter("%s"), Parameter("%s"),Parameter("%s")
             )  
    query_data = [project._project_name, project._project_desc, project._project_type._project_type_id, project_manager._user_id]
        
    with DatabaseMgr.openConnect() as connect:
        
        DatabaseMgr.updateWithConnect(connect, query, query_data)
        project_id = connect.insert_id()
                    
        if project._project_type.isNeedProjectDetail():                        
  
            # detail
            project._project_detail.insertWith(connect, project_id, project._project_type._project_type_id) 
            
        connect.commit()
            
    # project_type -  3 : 가공
    # ai model generate - 가공 프로젝트 생성시 AI 모델 설정 값 기본값으로 세팅
    if project._project_type._project_type_id == 3:
        table = Table("aimodel")    
        query = Query.into(table).columns("project_id").select(Parameter("%s"))  
        query_data = [project_id]
        DatabaseMgr.update(query = query,data=query_data)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        
    # data_type -  1:자체 제공 데이터셋      
    if isinstance(project._project_detail, ProjectDetailCollect):    
        if project._project_detail._data_type ==  DataTypes.SelfSupplied:  
            serviceTask.importTaskFromDataset(project_id, project._project_detail._dataset_ids)
                 
    # # data_type - 2: crawling
        elif project._project_detail.data_type == DataTypes.Crawling:
            serviceTask.importTaskFromCrawling(project_id = project_id, 
                                               crawling_channel_type = project._project_detail.crawling_channel_type,
                                               crawling_keywords = project._project_detail.crawling_keywords,
                                               crawling_period_type = project._project_detail.crawling_period_type,
                                               crawling_limit = project._project_detail.crawling_limit)
    # # data_type - 3: 사용자 업로드 데이터셋
        elif project._project_detail.data_type == DataTypes.Uploaded:
            pass

    # 상태 변경 - 완료
    
    query = """
    UPDATE project p
    SET
    p.updated=Now(),
    p.project_status=%s
    WHERE p.project_id=%s
    """        
    query_data = [2, project_id]
    
    DatabaseMgr.update(query, query_data)
                        
    return getProject(project_id, isClearCache=True)


def deleteProject(project_id) -> Project:
    """프로젝트 삭제 _

    Args:
        project (_type_): _description_

    Returns:
        Project: _description_
    """
    
    project = getProject(project_id)    
    if project is None:
        raise ArgsException(f"project({project_id}) is not exist")
    
    # delete
    
    with DatabaseMgr.openConnect() as connect:
    
        # task
        table = Table("task_detail")
        query = Query.from_(table).delete().where(table.project_id==project_id)        
        DatabaseMgr.updateWithConnect(connect, query)
        table = Table("task")
        query = Query.from_(table).delete().where(table.project_id==project_id)        
        DatabaseMgr.updateWithConnect(connect, query)
    
        # annotation_category_attribute
        table = Table("annotation_category_attribute")
        query = Query.from_(table).delete().where(table.project_id==project_id)        
        DatabaseMgr.updateWithConnect(connect, query)
        
        # annotation_category
        table = Table("annotation_category")
        query = Query.from_(table).delete().where(table.project_id==project_id)
        DatabaseMgr.updateWithConnect(connect, query)
        
        # project_detail
        table = Table("project_detail")
        query = Query.from_(table).delete().where(table.project_id==project_id)
        DatabaseMgr.updateWithConnect(connect, query)
        
        # project
        table = Table("project")
        query = Query.from_(table).delete().where(table.project_id==project_id)
        DatabaseMgr.updateWithConnect(connect, query)
        
        # files 
        DataPathProject.deleteDirForImage(project_id)
                
        connect.commit()
      
    CacheMgr.updateProject(project.get_id())
    
    return project

def updateProject(projectJson) -> Project:
    """프로젝트 갱신 _

    Args:
        project (_type_): _description_

    Returns:
        Project: _description_
    """
        
    project_id = projectJson.get("project_id")
    if project_id is None:
        raise ArgsException(f"project_id({project_id}) is missing")
    
    project = getProject( project_id )
    if project is None:
        raise ArgsException(f"Project({project_id}) is not exist")
    
    isUpdated = False
    
        
    # updateable 
    table = Table("project")
    query = Query.update(table).where(table.project_id==project_id)
    query_data = []
        
    # project_name    
    project_name = utils.getOrDefault(projectJson.get("project_name"))
    if project_name is not None:
        query = query.set(table.project_name, Parameter("%s"))
        query_data.append(project_name)
        isUpdated = True
        
    # project_desc
    project_desc = utils.getOrDefault(projectJson.get("project_desc"))
    if project_desc is not None:
        query = query.set(table.project_desc, Parameter("%s"))
        query_data.append(project_desc)
        isUpdated = True
        
    # project_manager
    project_manager:dict = utils.getOrDefault(projectJson.get("project_manager"))  # type: ignore
    if project_manager is not None:        
        user_id = project_manager.get("user_id")
        if user_id is not None:        
            project_manager_user:User = serviceUser.getUser(user_id)
            query = query.set(table.project_manager_id, Parameter("%s"))
            query_data.append(project_manager_user.get_id())
            isUpdated = True
                
    # update
    if isUpdated == False:
        raise ArgsException(f"Project({project_id}), update item is missing")
    
    # 
    query = query.set(table.updated, fn.Now() )
    
    DatabaseMgr.update(query=query, data=query_data)
                    
    return getProject(project_id, True)

def getLicenses(project_id) -> list[License]:
    
    table = Table("license")
    query = Query.from_(table).select(table.license_id, table.license_name, table.license_url, table.license_desc, table.created, table.updated)
        
    # todo - where project
    licenses:list[License] = []
    results = DatabaseMgr.select(query)
    for r in results:
        license = License.createFrom(r)
        licenses.append(license)
        
    return licenses
        

def findProjectsBy(project_name=None, project_type_id=None, created_start=None, created_end=None, task_count_min=None, 
                   task_count_max=None, startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER) -> list:
    """_프로젝트 리스트 조회_

    Args:
        project_name (_type_): _description_
        project_type_id (_type_): _description_
        created_start (_type_): _description_
        created_end (_type_): _description_
        task_count_min (_type_): _description_
        task_count_max (_type_): _description_

    Returns:
        Project[]: _description_
    """
    # make query
    table_project = Table("project")
    table_task = Table("task")
    query = Query.from_(table_project).left_join(table_task).on(table_task.project_id==table_project.project_id)    
    query = query.groupby(table_project.project_id)
    
    # where
    if project_name is not None:
        query = query.where(table_project.project_name.like(f"%{project_name}%") )
    if project_type_id is not None:
        query = query.where(table_project.project_type_id == project_type_id )
    if created_start is not None:
        query = query.where(table_project.created >= utils.toDateTimeFrom(created_start) )
    if created_end is not None:
        query = query.where(table_project.created <= utils.toDateTimeFrom(created_end) )
        
    # having
    if task_count_min is not None:
        query = query.having(fn.Count(table_task.task_id) >= task_count_min )
    if task_count_max is not None:
        query = query.having(fn.Count(table_task.task_id) <= task_count_max )
        
    # select
    querySelect = query.select(
        table_project.project_id,
        table_project.project_name,
        table_project.project_desc,
        table_project.project_status,
        table_project.project_type_id,
        table_project.project_manager_id,
        table_project.project_member_ids,
        table_project.created,
        table_project.updated,
        
        fn.Count(table_task.task_id).as_("task_count_total"), 
        fn.Count( Case()
                .when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1)
                .else_( None ) 
                ).as_( "task_count_complete" ),
        
        fn.Count( Case().when( table_task.task_worker_id.notnull(),1).else_(None) ).as_( "count_worker" ),
        fn.Count( Case().when( table_task.task_validator_id.notnull() ,1).else_(None) ).as_( "count_validator" ),
        fn.Max(table_task.updated).as_( "task_updated" )
    )
                  
    # count
    queryCount = Query.from_(querySelect).select( fn.Count("*").as_("totalResults") )
    countResult = DatabaseMgr.selectOne(queryCount)
    if countResult is None:
        totalResults = 0
    else :
        totalResults = DatabaseMgr.selectOne(queryCount).get("totalResults")
        
    # limit
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order) 
    
    itemList = []
    for r in DatabaseMgr.select(querySelect):         
        project = paraseProjectFrom(r, hasDetail=True)
        project._project_member_statics = parseProjectMemberStaticsFrom(project.get_id(), r)
        if project is None:
            continue 
        itemList.append(project)  
    
    
    return SearchResult.create(itemList, startAt=startAt,totalResults=totalResults, maxResults=maxResults)  # type: ignore

def serviceAddProjectMembers(project_id,project_member_id_list):
        
    table_project = Table("project")
    query = Query.update(table_project).where(table_project.project_id==project_id)
    # query_data = []
    
    query = query.set(table_project.project_member_ids, Parameter("%s"))
    # query_data.append(project_member_id_list)
    query = query.set(table_project.updated, fn.Now() )

    DatabaseMgr.update(query=query, data=",".join(project_member_id_list))

    return getProject(project_id, True)

def serviceDelProjectMembers(project_id,del_project_member_ids):

    current_project = getProject(project_id, True)
    
    cur_prj_memList = []
    for member_info in current_project._project_members:
        cur_prj_memList.append(member_info.user_id)

    for del_mem in del_project_member_ids:
        if del_mem in cur_prj_memList:
            cur_prj_memList.remove(del_mem)
        else:
            raise ArgsException(f"{del_mem} is not in project {project_id} member")
 
    table_project = Table("project")
    query = Query.update(table_project).where(table_project.project_id==project_id)
    # query_data = []
    
    if len(cur_prj_memList) == 0:
        query = query.set(table_project.project_member_ids,None)
        # query_data.append(project_member_id_list)
        query = query.set(table_project.updated, fn.Now() )
        DatabaseMgr.update(query=query)
    else:
        query = query.set(table_project.project_member_ids,"%s")
        query = query.set(table_project.updated, fn.Now() )
        q_data = ",".join(cur_prj_memList)
        query = f"UPDATE `project` SET `project_member_ids`='{q_data}',`updated`=NOW() WHERE `project_id`={project_id}"
        # DatabaseMgr.update(query=query, data=','.join(cur_prj_memList))
        DatabaseMgr.update(query=query)

    return getProject(project_id, True)