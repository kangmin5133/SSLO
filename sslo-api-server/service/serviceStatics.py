

import utils
from utils import DataPathProject, DataPathDataset
from exception import ArgsException, ExceptionCode
import config
from log import logger

from config.SSLOEnums import TaskStep, TaskProgress, CreatedOrUpdated
from model import StaticsTaskProgress, StaticsTaskStep, StaticsTask, StaticsTaskByDay, StaticsTaskByUser, StaticsProjectCategory
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Order
from service.permission import PermissionMgr
from service import serviceAnnotation, serviceDataset, serviceUser, serviceTask, serviceRawdata
from service.cache import CacheMgr

def getColumnNameTaskStepCount(taskStep:TaskStep):
    return f"count_step_{taskStep.value}"

def getColumnNameTaskStepCompleteCount(taskStep:TaskStep):
    return f"count_step_complete_{taskStep.value}"


def getColumnNameTaskProgressCount(taskStep:TaskStep, taskProgress:TaskProgress):
    return f"count_step_{taskStep.value}_{taskProgress.name}"

def parseStaticsTaskStep(result:dict, taskStep:TaskStep) -> StaticsTaskProgress:
    
    data = {}
    
    data["task_status_step"] = taskStep.value
    
    complete_count = result.get(getColumnNameTaskStepCompleteCount(taskStep))
    data["task_status_complete_count"] = complete_count
    
    count = result.get(getColumnNameTaskStepCount(taskStep))
    data["count"] = count
    
    progressList = []
    for progress in TaskProgress:
    
        key = getColumnNameTaskProgressCount(taskStep, progress)
        countProgress = result.get(key)
        if countProgress is None:
            raise ArgsException(f" staticsTaskProgress - progress({progress}), '{key}' is required")
        
        taskProgress = StaticsTaskProgress( id=progress.value, name=progress.name, count=countProgress )
        progressList.append(taskProgress)
                
    data["task_status_progress"] = progressList
    
    
    return StaticsTaskStep.createFrom(data)


def parseStaticsTask(project_id, result:dict) -> StaticsTask:
    
    data = {}
    
    # count
    count = result.get("count")
    if count is None:
        ArgsException(" parseStaticsTask - 'count' is required", ExceptionCode.INTERNAL_SERVER_ERROR)
    data["count"] = count
          
    # task_last_updated
    data["task_last_updated"] = result.get("task_last_updated")
            
    # statics_status_steps
    statics_status_steps = []
    
    for step in TaskStep:
        newTaskStep = parseStaticsTaskStep(result, step)
        statics_status_steps.append(newTaskStep)    
    
    data["statics_status_steps"] = statics_status_steps
    
    return StaticsTask.createFrom(data)
          
        
def getStaticsProjectTask(project_id, start, end, createdOrUpdated:CreatedOrUpdated, isMy=False) -> StaticsTask:
    """_statics project task_

    Args:
        project_id (_type_): _description_
        start (_type_): _description_
        end (_type_): _description_
        createdOrUpdated (_type_): _description_

    Returns:
        StaticsTask: _description_
    """
    logger.debug ( f" getStaticsProjectTask : {type(project_id)}")


    # 전체 작업 진행형황
    
    # make query
    table_project = Table('project')    
    table_task = Table('task')
    query = Query.from_(table_task)
    query = query.left_join(table_project).on(table_project.project_id==table_task.project_id)
    
    
    # where
    if project_id is not None:
        query = query.where(table_task.project_id==project_id )
    if start is not None:
        query = query.where( fn.Date( table_task.field(createdOrUpdated.name) ) >= utils.toDateFrom(start) )
    if end is not None:
        query = query.where( fn.Date( table_task.field(createdOrUpdated.name) ) <= utils.toDateFrom(end) )

    # where my    
    if isMy:
        user_id = serviceUser.getCurrentUserID()
        query = query.where( (table_task.task_validator_id == user_id) | (table_task.task_worker_id == user_id) )
  

    queryCount = query.select(        
        fn.Count("*").as_("count"), 
        fn.Max(table_task.updated).as_("task_last_updated"),
        fn.Count( Case().when( table_task.task_status_step==TaskStep.Work.value,1).else_(None) ).as_(getColumnNameTaskStepCount(TaskStep.Work)),
        fn.Count( Case()
                .when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Complete.value]),1)
                .when( table_task.task_status_step==TaskStep.Validate.value, 1 )
                .else_(None) 
                ).as_( getColumnNameTaskStepCompleteCount(TaskStep.Work) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.NotYet.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.NotYet ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Working.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Working ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Complete ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Reject.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Reject ) ),
        
        fn.Count( Case().when( table_task.task_status_step==TaskStep.Validate.value,1).else_(None) ).as_(getColumnNameTaskStepCount(TaskStep.Validate)),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None)  ).as_( getColumnNameTaskStepCompleteCount(TaskStep.Validate) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.NotYet.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.NotYet ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Working.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Working ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Complete ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Reject.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Reject ) ),
    )
    
    
    result = DatabaseMgr.selectOne(queryCount)
    
    return parseStaticsTask(project_id, result)
    

def getStaticsProjectTaskByDay(project_id, startBeforeDays, createdOrUpdated:CreatedOrUpdated, isMy=False) -> list[StaticsTaskByDay]:
    """_statics project task by day_

    Args:
        project_id (_type_): _description_
        startBeforeDays (_type_): _description_
        createdOrUpdated (_type_): _description_

    Returns:
        list[StaticsTaskByDay]: _description_
    """
    logger.debug ( f" --> getStaticsProjectTaskByCreatedDay : {type(project_id)}")


    # 전체 작업 진행형황
    # 작업단계 / 완료 파일 개수 / 전체 개수 대비 비율
    
    # make query
    table_project = Table('project')    
    table_task = Table('task')
    query = Query.from_(table_task)
    query = query.left_join(table_project).on(table_project.project_id==table_task.project_id)
        
    # where
    if project_id is not None:
        query = query.where(table_task.project_id==project_id )
    if startBeforeDays is not None:
        startBeforeDays = utils.toDeltaDay(utils.now(), startBeforeDays)
        query = query.where( fn.Date( table_task.field(createdOrUpdated.name) ) >= utils.toDateFrom(startBeforeDays) )
         
    # where my    
    if isMy:
        user_id = serviceUser.getCurrentUserID()
        query = query.where( (table_task.task_validator_id == user_id) | (table_task.task_worker_id == user_id) )
      
    queryCount = query.select(
        fn.Date( table_task.field(createdOrUpdated.name) ).as_("day"),
        
        fn.Count("*").as_("count"),
        fn.Count( Case().when( table_task.task_status_step==TaskStep.Work.value,1).else_(None) ).as_(getColumnNameTaskStepCount(TaskStep.Work)),
        fn.Count( Case()
                .when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Complete.value]),1)
                .when( table_task.task_status_step==TaskStep.Validate.value, 1 )
                .else_(None) 
                ).as_( getColumnNameTaskStepCompleteCount(TaskStep.Work) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.NotYet.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.NotYet ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Working.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Working ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Complete ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Reject.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Reject ) ),
        
        fn.Count( Case().when( table_task.task_status_step==TaskStep.Validate.value,1).else_(None) ).as_(getColumnNameTaskStepCount(TaskStep.Validate)),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None)  ).as_( getColumnNameTaskStepCompleteCount(TaskStep.Validate) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.NotYet.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.NotYet ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Working.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Working ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Complete ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Reject.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Reject ) ),
    )
    queryCount = queryCount.groupby(fn.Date( table_task.field(createdOrUpdated.name) ) )
    queryCount = queryCount.orderby(fn.Date( table_task.field(createdOrUpdated.name) ), order=Order.asc)
    
    
    result = DatabaseMgr.select(queryCount)
            
    statics = []
    for r in result:
        day = r.get("day")
        statics_tasks = parseStaticsTask(project_id, r)        
        staticByDay = StaticsTaskByDay(day, statics_tasks)
        
        statics.append(staticByDay)
            
    return statics      
    
    
def getStaticsProjectTaskByUser(project_id, start, end, createdOrUpdated:CreatedOrUpdated, user_id, isMy=False) -> list[StaticsTaskByUser]:
    """_statics project task by user_

    Args:
        project_id (_type_): _description_
        start (_type_): _description_
        end (_type_): _description_
        createdOrUpdated (_type_): _description_        

    Raises:
        ArgsException: _description_

    Returns:
        list[StaticsTaskByUser]: _description_
    """
    logger.debug ( f" --> getStaticsProjectTaskByUser : {type(project_id)}")


    # make query
    tabel_user = Table('user') 
    table_project = Table('project')    
    table_task = Table('task')
    query = Query.from_(table_task)
    query = query.left_join(table_project).on(table_project.project_id==table_task.project_id)
    query = query.left_join(tabel_user).on((tabel_user.user_id==table_task.task_worker_id | tabel_user.user_id==table_task.task_validator_id ))
        
    # where
    if project_id is not None:
        query = query.where(table_task.project_id==project_id )
    if start is not None:
        query = query.where( fn.Date( table_task.field(createdOrUpdated.name) ) >= utils.toDateFrom(start) )
    if end is not None:
        query = query.where( fn.Date( table_task.field(createdOrUpdated.name) ) <= utils.toDateFrom(end) )            
        
    # where my    
    if isMy:
        current_user_id = serviceUser.getCurrentUserID()
        query = query.where( (table_task.task_validator_id == current_user_id) | (table_task.task_worker_id == current_user_id) )
    
    queryCount = query.select(
        tabel_user.user_id,
        
        fn.Count("*").as_("count"), 
        fn.Max(table_task.updated).as_("task_last_updated"),
        fn.Count( Case().when( table_task.task_status_step==TaskStep.Work.value,1).else_(None) ).as_(getColumnNameTaskStepCount(TaskStep.Work)),
        fn.Count( Case()
                .when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Complete.value]),1)
                .when( table_task.task_status_step==TaskStep.Validate.value, 1 )
                .else_(None) 
                ).as_( getColumnNameTaskStepCompleteCount(TaskStep.Work) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.NotYet.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.NotYet ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Working.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Working ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Complete ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Work.value,table_task.task_status_progress==TaskProgress.Reject.value]),1).else_(None) ).as_( getColumnNameTaskProgressCount(TaskStep.Work, TaskProgress.Reject ) ),
        
        fn.Count( Case().when( table_task.task_status_step==TaskStep.Validate.value,1).else_(None) ).as_(getColumnNameTaskStepCount(TaskStep.Validate)),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None)  ).as_( getColumnNameTaskStepCompleteCount(TaskStep.Validate) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.NotYet.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.NotYet ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Working.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Working ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Complete.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Complete ) ),
        fn.Count( Case().when( Criterion.all([table_task.task_status_step==TaskStep.Validate.value,table_task.task_status_progress==TaskProgress.Reject.value]),1).else_(None)  ).as_( getColumnNameTaskProgressCount(TaskStep.Validate, TaskProgress.Reject ) ),
    )
    queryCount = queryCount.groupby(tabel_user.user_id)
    if user_id:
        queryCount = queryCount.having(tabel_user.user_id==user_id)

    result = DatabaseMgr.select(queryCount)
            
    statics = []
    for r in result:
        user_id = r.get("user_id")
        if user_id is None:
            user = serviceUser.getUserEmpty()
        else:
            user = serviceUser.getUser(user_id)
        statics_tasks = parseStaticsTask(project_id, r)        
        staticByUser = StaticsTaskByUser(user, statics_tasks)
        
        statics.append(staticByUser)
            
    return statics 


def getStaticsProjectCategory(project_id) -> list[StaticsProjectCategory]:
    """_statics project category_

    Args:
        project_id (_type_): _description_

    Returns:
        list[StaticsProjectCategory]: _description_
    """
    logger.debug ( f" --> getStaticsProjectCategory - project_id : {project_id}")


    # make query
    table_annotation = Table("annotation")
    table_annotation_category = Table("annotation_category")

    query = Query.from_(table_annotation_category)
    query = query.left_join(table_annotation).on((table_annotation.annotation_category_id==table_annotation_category.annotation_category_id) & 
                                                 (table_annotation.project_id==table_annotation_category.project_id))
        
    # where
    query = query.where(table_annotation_category.project_id==project_id)
      
    queryCount = query.select(
        table_annotation_category.annotation_category_id,        
        fn.Count(table_annotation.annotation_id).as_("count")        
    )
    queryCount = queryCount.groupby(table_annotation_category.annotation_category_id)
   

    result = DatabaseMgr.select(queryCount)
            
    statics = []
    for r in result:
        annotation_category_id = r.get("annotation_category_id")
        if annotation_category_id is None:
            raise ArgsException(f" System Error. Check Database( project_id :{project_id} ) ", ExceptionCode.INTERNAL_SERVER_ERROR)
        else:
            annotation_category = serviceAnnotation.getAnnotationCategory(project_id, annotation_category_id)
        count = r.get("count")
        if count is None:
            count = 0
        
        staticProjectCategory = StaticsProjectCategory(annotation_category, count)
        
        statics.append(staticProjectCategory)
            
    return statics 
    

