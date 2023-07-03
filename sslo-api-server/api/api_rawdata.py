"""
#데이터셋(Dataset)
Version : 1
"""
  
import inject
import json
import datetime
from flask import Flask, request, Blueprint
from flask.wrappers import Response
from werkzeug.datastructures import FileStorage

from api.api_auth import login_required

import utils
import config
from model import SearchResult, PageInfo
from exception import ArgsException, ExceptionCode
from service import serviceRawdata, serviceUser
from service.permission import PermissionMgr
from log import logger


bp_rawdata = Blueprint('data', __name__)

app = inject.instance(Flask)

@bp_rawdata.route('', methods=['GET'], strict_slashes=False)
@login_required()
def rawdata():
    """
    ### 데이터셋 Rawdata 조회

> GET /rest/api/1/dataset/data

데이터셋 Rawdata 정보를 가져온다
> 

Permissions : System Admin

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | dataset_id | dataset id | y | <Dataset>.dataset_id |
    | rawdata_id | rawdata id | y | <Rawdata>.rawdata_id |
- Response
    
    **Content type : application/json**
    
    Data : <Rawdata>
    
    ```jsx
    
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    """    
    
    dataset_id = utils.getOrDefault(request.args.get('dataset_id', type=int))
    if dataset_id is None:
        raise ArgsException(f"dataset_id is missing")
    
    rawdata_id = utils.getOrDefault(request.args.get('rawdata_id', type=int))
    if rawdata_id is None:
        raise ArgsException(f"rawdata_id is missing")
    
    # permission
    if PermissionMgr.check_permission_rawdata_view( serviceUser.getCurrentUserID(), dataset_id, rawdata_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
           
    rawdata = serviceRawdata.get_rawdata(dataset_id, rawdata_id)
    if rawdata is None:        
        raise ArgsException(f"rawdata({rawdata_id}) is not exist")
   
    
    return Response(response=str(rawdata)) 


@bp_rawdata.route('/create', methods=['POST'])
@login_required()
def datasetCreate():
    """
    ### 데이터셋 생성

> POST /rest/api/1/dataset/data/create

데이터셋을 생성 한다
> 

Permissions : System Admin

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <Dataset>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <Dataset> 
    
    ```jsx
    
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    dataset_id = utils.getOrDefault(request.args.get('dataset_id', type=int))
    if dataset_id is None:
        raise ArgsException(f"dataset_id is missing")
    
    # permission
    if PermissionMgr.check_permission_rawdata_create( serviceUser.getCurrentUserID(), dataset_id) == False:
        raise ArgsException(f"You do not have create permission.", ExceptionCode.FORBIDDEN)
        
    if request.files is None or len(request.files.keys()) == 0:
        raise ArgsException(f"file is missing") 
                        
    files = request.files.getlist("image")
    if files is None or len(files) == 0:
        raise ArgsException(f"file(image) is missing")
    
        
    # permission    
    
    
    rawdata = serviceRawdata.create_rawdata(dataset_id,  files )
    
    return Response(response=str(rawdata)) 


@bp_rawdata.route('/delete', methods=['DELETE'])
@login_required()
def datasetDelete():
    """
    ### 데이터셋 삭제

> DELETE /rest/api/1/dataset/data/delete

dataset을 삭제한다
> 

Permissions : System Admin

Methods : DELETE

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | dataset_id | 데이터셋 id | y | DataSet.dataset_id |
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    dataset_id = utils.getOrDefault(request.args.get('dataset_id', type=int))
    if dataset_id is None:
        raise ArgsException(f"dataset_id is missing")    
    
    rawdata_id = utils.getOrDefault(request.args.get('rawdata_id', type=int))
    if rawdata_id is None:
        raise ArgsException(f"rawdata_id is missing")
    
    # permission
    if PermissionMgr.check_permission_rawdata_delete( serviceUser.getCurrentUserID(), dataset_id, rawdata_id) == False:
        raise ArgsException(f"You do not have delete permission.", ExceptionCode.FORBIDDEN)
    
    rawdata = serviceRawdata.delete_rawdata(dataset_id, rawdata_id)
    
    return Response(response=str(rawdata)) 


@bp_rawdata.route('/search', methods=['GET'])
@login_required()
def rawdataSearch():
    """
    ### 데이터셋 Rawdata 목록 조회

> GET /rest/api/1/dataset/data/search

데이터셋 내에 Rawdata 리스트 조회
> 

Permissions : System Admin

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | dataset_id |  | y | Dataset.dataset_id |
    | rawdata_name | name | n | Rawdata.rawdata_name |
- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Rawdata>[]
    
    ```jsx
    {
    	"pageinfo": {
    		...
    	},
    	"datas" : [
    		{
    			...
    		}
    	]
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
        
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='created')
    order = config.toSortOrder(request.args.get('order', default=config.DEFAULT_SORT_ORDER.value))

    dataset_id = utils.getOrDefault(request.args.get('dataset_id'))
    dataset_name = utils.getOrDefault(request.args.get('dataset_name'))
    dataset_category = utils.getOrDefault(request.args.get('dataset_category'))
    dataset_sub_category = utils.getOrDefault(request.args.get('dataset_sub_category'))
    rawdata_name = utils.getOrDefault(request.args.get('rawdata_name'))
    
    # permission
    if PermissionMgr.check_permission_rawdata_search( serviceUser.getCurrentUserID(), dataset_id) == False:
        raise ArgsException(f"You do not have search permission.", ExceptionCode.FORBIDDEN)
    
    searchResult = serviceRawdata.find_rawdatas_by(dataset_id, dataset_name, dataset_category, dataset_sub_category, rawdata_name, startAt, maxResults, orderBy, order )   
    return Response(response=str(searchResult) )