"""
#데이터셋(Dataset)
Version : 1
"""
  
import inject
import json
import datetime
from flask import Flask, request, Blueprint
from flask.wrappers import Response

from api.api_auth import login_required

import utils
from log import logger
import config
from model import SearchResult, PageInfo
from exception import ArgsException, ExceptionCode
from service import serviceDataset, serviceRawdata, serviceUser
from service.permission import PermissionMgr


bp_dataset = Blueprint('dataset', __name__)


app = inject.instance(Flask)
# login_manager = inject.instance(LoginManager)
# csrf = inject.instance(CSRFProtect)    


@bp_dataset.route('', methods=['GET'], strict_slashes=False)
@login_required()
def dataset():
    """
    ### 데이터셋 조회

> GET /rest/api/1/dataset

데이터셋 정보를 가져온다
> 

Permissions : System Admin

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | dataset_id | dataset id | y | <Dataset>.dataset_id |
- Response
    
    **Content type : application/json**
    
    Data : <Dataset>
    
    ```jsx
    {
    }
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
        
    # permission
    if PermissionMgr.check_permission_dataset_view( serviceUser.getCurrentUserID(), dataset_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
           
    dataset = serviceDataset.getDataset(dataset_id)
    if dataset is None:        
        raise ArgsException(f"dataset({dataset_id}) is not exist")
   
    
    return Response(response=str(dataset)) 


@bp_dataset.route('/create', methods=['POST'])
@login_required()
def datasetCreate():
    """
    ### 데이터셋 생성

> POST /rest/api/1/dataset/create

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
    
    # permission
    if PermissionMgr.check_permission_dataset_create( serviceUser.getCurrentUserID()) == False:
        raise ArgsException(f"You do not have create permission.", ExceptionCode.FORBIDDEN)
    
    if request.is_json == False:
        raise ArgsException(f" dataset data is missing!")    
   
    params = request.get_json()
    datasets = serviceDataset.createDataset( params )
    
    return Response(response=str(datasets)) 

@bp_dataset.route('/update', methods=['POST'])
@login_required()
def datasetUpdate():
    """
    ### 데이터셋 정보 변경

> POST /rest/api/1/dataset/update

프로젝트 정보를 변경한다
> 

Permissions : System Admin

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <DataSet>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data : <DataSet>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    if request.is_json == False:
        raise ArgsException(f" dataset data is missing!")    
   
    params = request.get_json()
    datasets = serviceDataset.updateDataset( params )
    
    return Response(response=str(datasets))

@bp_dataset.route('/delete', methods=['DELETE'])
@login_required()
def datasetDelete():
    """
    ### 데이터셋 삭제

> DELETE /rest/api/1/dataset/delete

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
    
    # permission
    if PermissionMgr.check_permission_dataset_delete( serviceUser.getCurrentUserID(), dataset_id) == False:
        raise ArgsException(f"You do not have delete permission.", ExceptionCode.FORBIDDEN)
    
    datasets = serviceDataset.deleteDataset( dataset_id )
    
    return Response(response=str(datasets)) 

@bp_dataset.route('/search', methods=['GET'])
@login_required()
def datasetSearch():
    """
    ### 테이터셋 목록 조회

> GET /rest/api/1/dataset/search

테이터셋 리스트를 가져온다
> 

Permissions : System Admin

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | dataset_name | 데이터셋 name | n | Dataset.dataset_name |
- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Dataset>[]
    
    ```jsx
    {
    	"pageinfo": {
    		...
    	},
    	"datasets" : [
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
    
    # permission
    if PermissionMgr.check_permission_dataset_search( serviceUser.getCurrentUserID()) == False:
        raise ArgsException(f"You do not have search permission.", ExceptionCode.FORBIDDEN)
    
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='created')
    order = config.toSortOrder(request.args.get('order', default=config.DEFAULT_SORT_ORDER.value)) 
        
    dataset_name = utils.getOrDefault(request.args.get('dataset_name'))
    dataset_category = utils.getOrDefault(request.args.get('dataset_category'))
    dataset_sub_category = utils.getOrDefault(request.args.get('dataset_sub_category'))
    
    created_start = utils.getOrDefault(request.args.get('created_start', type=int))
    created_end = utils.getOrDefault(request.args.get('created_end', type=int))    
        
    searchResult = serviceDataset.findDatasetsBy(dataset_name, dataset_category, dataset_sub_category, created_start, created_end, startAt, maxResults, orderBy, order)
    return Response(response=str(searchResult) )


