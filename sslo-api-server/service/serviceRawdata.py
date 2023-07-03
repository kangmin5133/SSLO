
from werkzeug.datastructures import FileStorage

import utils
from utils import DataPathDataset
from exception import ArgsException, ExceptionCode
import config
from log import logger

from model import PageInfo, SearchResult
from model import User, UserRole
from model import ImageDetail
from model import Dataset, Rawdata
from service.database import DatabaseMgr, ErrorNo, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct
from service.permission import PermissionMgr
from service import serviceUser, serviceDataset


def parserRawdataFrom(resultQuery) -> Rawdata:
    
    data = {}
    
    dataset_name = resultQuery.get("dataset_name")
    if dataset_name is not None:
        dataset = serviceDataset.parserDatasetFrom(resultQuery)
        data["rawdata_dataset"] = dataset
        
        dataset_id = dataset._dataset_id
        rawdata_name = resultQuery.get("rawdata_name")
        rawdata_fortmat = resultQuery.pop("rawdata_fortmat", None)
        rawdata_filename = resultQuery.pop("rawdata_filename", None)
        rawdata_license_id = resultQuery.pop("rawdata_license_id", None)
        rawdata_md5 = resultQuery.pop("rawdata_md5", None)
        imageDetail = ImageDetail.createFromImage( DataPathDataset, dataset_id, rawdata_name, rawdata_fortmat, rawdata_filename, rawdata_license_id, rawdata_md5 )
        data["rawdata_detail"] = imageDetail
                    
                    
    # rawdata_id
    rawdata_id = resultQuery.pop("rawdata_id", None)
    if rawdata_id is not None:
        data["rawdata_id"] = rawdata_id
    
    # rawdata_name
    rawdata_name = resultQuery.pop("rawdata_name", None)
    if rawdata_name is not None:
        data["rawdata_name"] = rawdata_name
           
    # rawdata_created or created 
    rawdata_created = resultQuery.pop("rawdata_created", None)
    if rawdata_created is not None:
        data["created"] = rawdata_created
    else:
        created = resultQuery.pop("created", None)
        if created is not None:
            data["created"] = created
        
    # rawdata_update or updated
    rawdata_update = resultQuery.pop("rawdata_update", None)
    if rawdata_update is not None:
        data["updated"] = rawdata_update
    else:
        updated = resultQuery.pop("updated", None)
        if updated is not None:
            data["updated"] = updated
            
            
    # rawdata_detail
    rawdata_detail = resultQuery.pop("rawdata_detail", None)
    if rawdata_detail is not None:        
        if isinstance(rawdata_detail, ImageDetail) == False:
            data["rawdata_detail"] = ImageDetail.createFrom(rawdata_detail)
        else:
            data["rawdata_detail"] = rawdata_detail
               
    # rawdata_dataset
    rawdata_dataset = resultQuery.pop("rawdata_dataset", None)
    if rawdata_dataset is not None:
        if isinstance(rawdata_dataset, Dataset) == False:
            data["rawdata_dataset"] = serviceDataset.parserDatasetFrom(rawdata_dataset)
        else:
            data["rawdata_dataset"] = rawdata_dataset
    else:
        dataset_id = resultQuery.pop("dataset_id", None)
        if dataset_id is not None:
            data["rawdata_dataset"] = serviceDataset.getDataset(dataset_id)
            
    return Rawdata.createFrom(data)   # type: ignore

def get_rawdata(dataset_id, rawdata_id) -> Rawdata:
    """Rawdata 가져오기_

    Args:
        dataset_id (_type_): _description_

    Returns:
        Dataset: _description_
    """
    
    query = """
        SELECT 
        r.rawdata_id, r.rawdata_name, r.rawdata_fortmat, r.rawdata_filename, r.rawdata_size, r.rawdata_md5, r.created, r.updated
        , d.dataset_id, d.dataset_name, d.dataset_desc, d.dataset_category, d.dataset_sub_category, d.dataset_items_count, d.dataset_items_size, d.created as dataset_created, d.updated as dataset_updated
        from rawdata r 
        left join dataset d on d.dataset_id = r.dataset_id
        where r.dataset_id = %s and r.rawdata_id = %s
    """

    result = DatabaseMgr.selectOne(query, (dataset_id,rawdata_id)  )
    
    if result is None:
        return None  # type: ignore
        
    #
    
    return parserRawdataFrom(result)

def create_rawdata(dataset_id, fileStorageList:list) -> list:
    """Rawdata 생성 _

    Args:
        dataset (_type_): _description_

    Returns:
        Dataset: _description_
    """        
    
    if len(fileStorageList) > config.MAX_IMAGE_COUNT:
        raise ArgsException(f"Exceeded number of uploaded images")
    
    # file check    
    for fileStorage in fileStorageList:
        
        if fileStorage is None or len(fileStorage.mimetype) == 0:
            raise ArgsException(f"image is wrong(0 byte")
        
        if DataPathDataset.isAllowImageMineType(fileStorage.mimetype) == False:
            raise ArgsException(f"This is an unacceptable file format.({fileStorage.filename})")
        
    #
    dataset = serviceDataset.getDataset(dataset_id)
    if dataset is None:
        raise ArgsException(f"Datset({dataset_id}) is not exist")
    
    # init dir
    DataPathDataset.createDirForImage(dataset_id)
        
    radataIdList = []
    for fileStorage in fileStorageList:
               
        #
        rawdata_id = Rawdata.createIdWithInsert(dataset_id, fileStorage)                
        radataIdList.append(rawdata_id)
    
    # size update
    serviceDataset.recalculationDataset(dataset_id)
    
    return radataIdList


def delete_rawdata(dataset_id, rawdata_id) -> Rawdata:
    """Rawdata 삭제 _

    Args:
        dataset (_type_): _description_

    Returns:
        Dataset: _description_
    """
    
    rawdata = get_rawdata(dataset_id, rawdata_id)    
    if rawdata is None:
        raise ArgsException(f"Rawdata({rawdata_id}) is not exist")
    
    # delete
    
    with DatabaseMgr.openConnect() as connect:
            
        # images
        DataPathDataset.deleteImage(dataset_id, rawdata._rawdata_detail._image_file)
                
        # rawdata
        query = "DELETE FROM rawdata where dataset_id = %s and rawdata_id = %s"
        DatabaseMgr.updateWithConnect(connect, query, [dataset_id, rawdata_id])
               
        connect.commit()
        
    # size update
    serviceDataset.recalculationDataset(dataset_id)
    
    return rawdata


def find_rawdatas_by(dataset_id=None, dataset_name=None, dataset_category=None, dataset_sub_category=None, rawdata_name=None, startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER) -> SearchResult:
    """_Rawdata 리스트 조회_

    Args:
        dataset_id (_type_): _description_
        dataset_name (_type_): _description_
        dataset_category (_type_): _description_
        dataset_sub_category (_type_): _description_
        rawdata_name (_type_): _description_
        startAt (_type_): _description_
        maxResults (_type_): _description_
        orderBy (_type_): _description_
        order (_type_): _description_

    Returns:
        SearchResult: _description_
    """
    
    logger.info("===> find_rawdatas_by")
    
    
    # make query
    table_dataset = Table("dataset") 
    table_rawdata = Table('rawdata')    
    query = Query.from_(table_rawdata).left_join(table_dataset).on(
        table_dataset.dataset_id == table_rawdata.dataset_id
    )
    
     # where
    print(f"===> dataset_id : {dataset_id}")
    if dataset_id is not None:
        query = query.where(table_dataset.dataset_id==dataset_id )
    if dataset_name is not None:
        query = query.where(table_dataset.dataset_name.like(f"%{dataset_name}%") )
    if dataset_category is not None:
        query = query.where(table_dataset.dataset_category.like(f"%{dataset_category}%") )
    if dataset_sub_category is not None:
        query = query.where(table_dataset.dataset_sub_category.like(f"%{dataset_sub_category}%") )
    if rawdata_name is not None:
        query = query.where(table_rawdata.rawdata_name.like(f"%{rawdata_name}%") ) 
                
    # select
    querySelect = query.select(
        table_rawdata.rawdata_id, table_rawdata.rawdata_name, table_rawdata.rawdata_fortmat, table_rawdata.rawdata_filename, table_rawdata.rawdata_size, table_rawdata.created.as_("rawdata_created"), table_rawdata.updated.as_("rawdata_updated") 
        , table_dataset.dataset_id, table_dataset.dataset_name, table_dataset.dataset_desc, table_dataset.dataset_items_count
        , table_dataset.dataset_items_size, table_dataset.dataset_category, table_dataset.dataset_sub_category, table_dataset.created, table_dataset.updated
        )
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order)

    # count
    queryCount = query.select( fn.Count(Distinct(table_rawdata.rawdata_id)).as_("totalResults") )
    countResult = DatabaseMgr.selectOne(queryCount)
    if countResult is None:
        totalResults = 0
    else :
        totalResults = DatabaseMgr.selectOne(queryCount).get("totalResults")

    #
    itemList = []        
    results = DatabaseMgr.select(querySelect)
    for r in results:        
        item = parserRawdataFrom(r)
        itemList.append(item)    
        
    
    
    return SearchResult.create(itemList, startAt=startAt, totalResults=totalResults, maxResults=maxResults)