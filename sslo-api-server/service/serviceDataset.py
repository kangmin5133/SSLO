
from werkzeug.datastructures import FileStorage

import utils
from utils import DataPathDataset
from exception import ArgsException, ExceptionCode
import config
from log import logger

from model import PageInfo, SearchResult
from model import User, UserRole
from model import Dataset, Rawdata, Dataset
from service.database import DatabaseMgr, ErrorNo, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct
from service.permission import PermissionMgr
from service import serviceUser



def parserDatasetFrom(resultQuery) -> Dataset:
    
    data = {}
                    
    # dataset_id
    dataset_id = resultQuery.pop("dataset_id", None)
    if dataset_id is not None:
        data["dataset_id"] = dataset_id
    
    # dataset_name
    dataset_name = resultQuery.pop("dataset_name", None)
    if dataset_name is not None:
        data["dataset_name"] = dataset_name
        
    # dataset_desc
    dataset_desc = resultQuery.pop("dataset_desc", None)
    if dataset_desc is not None:
        data["dataset_desc"] = dataset_desc
        
    # dataset_category
    dataset_category = resultQuery.pop("dataset_category", None)
    if dataset_category is not None:
        data["dataset_category"] = dataset_category
        
    # dataset_sub_category
    dataset_sub_category = resultQuery.pop("dataset_sub_category", None)
    if dataset_sub_category is not None:
        data["dataset_sub_category"] = dataset_sub_category
        
    # dataset_items_count
    dataset_items_count = resultQuery.pop("dataset_items_count", None)
    if dataset_items_count is not None:
        data["dataset_items_count"] = dataset_items_count
        
    # dataset_items_size
    dataset_items_size = resultQuery.get("dataset_items_size", None)
    if dataset_items_size is not None:
        data["dataset_items_size"] = dataset_items_size
        
    # dataset_created or created 
    dataset_created = resultQuery.pop("dataset_created", None)
    if dataset_created is not None:
        data["created"] = dataset_created
    else:
        created = resultQuery.pop("created", None)
        if created is not None:
            data["created"] = created
        
    # dataset_update or updated
    dataset_update = resultQuery.pop("dataset_update", None)
    if dataset_update is not None:
        data["updated"] = dataset_update
    else:
        updated = resultQuery.pop("updated", None)
        if updated is not None:
            data["updated"] = updated
            
    return Dataset.createFrom(data)   # type: ignore
    

def recalculationDataset(dataset_id) -> int:

    query = """
        UPDATE dataset d, (SELECT COUNT(rawdata_id) as total_count, IFNULL(SUM(rawdata_size), 0) as total_size 
        FROM rawdata r 
        WHERE r.dataset_id = %s) s
        SET 
        d.dataset_items_count = s.total_count
        , d.dataset_items_size = s.total_size
        WHERE d.dataset_id = %s
;
    """
    return DatabaseMgr.update(query, (dataset_id, dataset_id))
    
    


def getDataset(dataset_id) -> Dataset:
    """테이터셋 가져오기_

    Args:
        dataset_id (_type_): _description_

    Returns:
        Dataset: _description_
    """
    logger.debug ( f" dataset_id type : {type(dataset_id)}")

    result = DatabaseMgr.selectOne("SELECT * from dataset where dataset_id=%s", dataset_id )
    
    if result is None:
        return None  # type: ignore
        
    #
    return parserDatasetFrom(result)  



def createDataset(jsonData) -> Dataset:
    """테이터셋 생성 _

    Args:
        dataset (_type_): _description_

    Returns:
        Dataset: _description_
    """
    
    # dataset_name
    dataset_name= utils.getOrDefault(jsonData.get("dataset_name"))
    if dataset_name is None:
        raise ArgsException(f"dataset_name is missing")
    
    # dataset_desc
    dataset_desc=utils.getOrDefault(jsonData.get("dataset_desc"))
    
    # dataset_category
    dataset_category=utils.getOrDefault(jsonData.get("dataset_category"))
    if dataset_category is None:
        raise ArgsException(f"dataset_category is missing")
    
    # dataset_sub_category
    dataset_sub_category=utils.getOrDefault(jsonData.get("dataset_sub_category"))

    # 
    dataset = Dataset(
                        dataset_id=None
                      , dataset_name=dataset_name
                      , dataset_desc=dataset_desc
                      , dataset_category=dataset_category
                      , dataset_sub_category=dataset_sub_category
                      )        
    # make query
    table = Table("dataset")
    query = Query.into(table).columns("dataset_name", "dataset_desc", "dataset_category", "dataset_sub_category").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
             )  
    query_data = [dataset._dataset_name, dataset._dataset_desc, dataset._dataset_category, dataset._dataset_sub_category]
        
    with DatabaseMgr.openConnect() as connect:
        try:
            DatabaseMgr.updateWithConnect(connect, query, query_data)
            dataset_id = connect.insert_id()
        except Exception as e:
            errorno = e.args[0]
            if errorno ==  ErrorNo.Duplicate:
                raise ArgsException("Duplicate dataset_name.")                        
            raise
            
            
        connect.commit()
                    
    return getDataset(dataset_id)


def deleteDataset(dataset_id) -> Dataset:
    """테이터셋 삭제 _

    Args:
        dataset (_type_): _description_

    Returns:
        Dataset: _description_
    """
    
    dataset = getDataset(dataset_id)    
    if dataset is None:
        raise ArgsException(f"dataset({dataset_id}) is not exist")
    
    # delete
    
    with DatabaseMgr.openConnect() as connect:
            
        # images
        DataPathDataset.deleteDirForImage(dataset_id)
                
        # rawdata
        query = "DELETE FROM rawdata where dataset_id = %s"
        DatabaseMgr.updateWithConnect(connect, query, [dataset_id])
        
        # dataset
        query = "DELETE FROM dataset where dataset_id = %s"
        DatabaseMgr.updateWithConnect(connect, query, [dataset_id])
       
        connect.commit()
        
    
    return dataset

def updateDataset(datasetJson) -> Dataset:
    """테이터셋 갱신 _

    Args:
        dataset (_type_): _description_

    Returns:
        Dataset: _description_
    """
        
    dataset_id = datasetJson.get("dataset_id")
    if dataset_id is None:
        raise ArgsException(f'dataset_id({dataset_id}) is missing')
    
    dataset = getDataset( dataset_id )
    if dataset is None:
        raise ArgsException(f'Dataset({dataset_id}) is not exist')
        
    
    # updateable 
    table = Table("dataset")
    query = Query.update(table).where(table.dataset_id==dataset_id)
    query_data = []
        
    updateCount = 0
        
    # dataset_name    
    dataset_name = utils.getOrDefault(datasetJson.get("dataset_name"))
    if dataset_name is not None:
        query = query.set(table.dataset_name, Parameter('%s'))
        query_data.append(dataset_name)
        updateCount += 1
        
    # dataset_desc
    dataset_desc = utils.getOrDefault(datasetJson.get("dataset_desc"))
    if dataset_desc is not None:
        query = query.set(table.dataset_desc, Parameter('%s'))
        query_data.append(dataset_desc)
        updateCount += 1
        
    # dataset_category
    dataset_category = utils.getOrDefault(datasetJson.get("dataset_category"))
    if dataset_category is not None:
        query = query.set(table.dataset_category, Parameter('%s'))
        query_data.append(dataset_category)
        updateCount += 1
        
    # dataset_sub_category
    dataset_sub_category = utils.getOrDefault(datasetJson.get("dataset_sub_category"))
    if dataset_sub_category is not None:
        query = query.set(table.dataset_sub_category, Parameter('%s'))
        query_data.append(dataset_sub_category)
        updateCount += 1
    
    # update
    if updateCount <= 0:
        raise ArgsException(f"At least 1 item is required for the update.")
    
    # 
    query = query.set(table.updated, fn.Now() )
    try:        
        DatabaseMgr.update(query=query, data=query_data)
    except Exception as e:
        errorno = e.args[0]
        if errorno ==  ErrorNo.Duplicate:
            raise ArgsException("Duplicate dataset_name.")                        
        raise
                
    return getDataset(dataset_id=dataset_id)

def findDatasetsBy(dataset_name=None, dataset_category=None, dataset_sub_category=None, created_start=None, created_end=None, startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER) -> SearchResult:
    """_테이터셋 리스트 조회_

    Args:
        dataset_name (_type_): _description_
        dataset_type_id (_type_): _description_
        created_start (_type_): _description_
        created_end (_type_): _description_

    Returns:
        Dataset[]: _description_
    """
    
    logger.info("===> find_datasets_by")
    
    
    # make query
    table = Table('dataset')    
    query = Query.from_(table)
        
    # where
    if dataset_name is not None:
        query = query.where(table.dataset_name.like(f"%{dataset_name}%") )
    if dataset_category is not None:
        query = query.where(table.dataset_category.like(f"%{dataset_category}%") )
    if dataset_sub_category is not None:
        query = query.where(table.dataset_sub_category.like(f"%{dataset_sub_category}%") )
    if created_start is not None:
        query = query.where(table.created >= utils.toDateTimeFrom(created_start) )
    if created_end is not None:
        query = query.where(table.created <= utils.toDateTimeFrom(created_end) )
    
    itemList = []
    
    # count
    queryCount = query.select( fn.Count(Distinct(table.dataset_id)).as_("totalResults") )
    countResult = DatabaseMgr.selectOne(queryCount)
    if countResult is None:
        totalResults = 0
    else :
        totalResults = DatabaseMgr.selectOne(queryCount).get("totalResults")
    
    # select
    querySelect = query.select("*" )
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order)        
    
    
    results = DatabaseMgr.select(querySelect)
    for r in results:
        item = Dataset.createFrom(r)
        itemList.append(item)    
    
    return SearchResult.create(itemList, startAt=startAt, totalResults=totalResults, maxResults=maxResults)