"""
#프로젝트
Version : 1
"""
  
import inject
from flask import Flask, request, Blueprint
from flask.wrappers import Response
import utils

from api.api_auth import login_required
from service import serviceProject, serviceUser, serviceTask
from service.permission import PermissionMgr
from exception import ArgsException, ExceptionCode
import utils
import config

bp_project = Blueprint('project', __name__)


app = inject.instance(Flask)


@bp_project.route('', methods=['GET'], strict_slashes=False)
@login_required()
def project():
    """
    ### 프로젝트 조회

> GET /rest/api/1/project

프로젝트 정보를 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
- Response
    
    **Content type : application/json**
    
    Data : <Project>
    
    ```jsx
    {
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """        
    
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    # permission
    if PermissionMgr.check_permission_project_view( serviceUser.getCurrentUserID(), project_id ) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN) 
    
    project = serviceProject.getProject(project_id)
    if project is None:        
        raise ArgsException(f"project({project_id}) is not exist")
   
    
    return Response(response=str(project))

@bp_project.route('/labeling/status', methods=['GET'], strict_slashes=False)
@login_required()
def projectLabelStatus():
    """
    ### 프로젝트 라벨링 상태 조회

> GET /rest/api/1/project

프로젝트의 오토라벨링 활성화 조건  check에 사용된다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required |  |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
- Response
    
    **Content type : application/json**
    
    Data : <Project>
    
    ```jsx
    {
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """
    
    project_id = utils.getOrDefault(request.args.get('project_id', type=int))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    # permission
    if PermissionMgr.check_permission_project_view( serviceUser.getCurrentUserID(), project_id ) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN) 
    
    project = serviceProject.getProject(project_id)
    if project is None:
        raise ArgsException(f"project({project_id}) is not exist")
   
    labelStatus = serviceProject.getCategoryAnnoCnt(project_id)
    
    return Response(response=str(labelStatus))

@bp_project.route('/predefined/processing', methods=['GET'], strict_slashes=False)
@login_required()
def projectCreteInfoProcessing():
    """
    ### 프로젝트 생성 정보 조회 - 가공 (미구현)

> POST /rest/api/1/project/predefined/processing

프로젝트를 생성시 필요한 정보를 조회 한다
> 

Permissions : System Admin

Methods : GET

- Request
    
    
- Response
    
    **Content type : application/json**
    
    | name | type | length | desc |
    | --- | --- | --- | --- |
    | project_categories | <AnnotationCategory>[] |  | 프로젝트 내 클래스 정보 리스트 |
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """        
       
    
    # permission
    if PermissionMgr.check_permission_project_create( serviceUser.getCurrentUserID() ) == False:
        raise ArgsException(f"You do not have create permission.", ExceptionCode.FORBIDDEN) 
    
    result = serviceProject.getPredefinedProcessing()    
       
    return Response(response=str(result)) 

@bp_project.route('/create', methods=['POST'])
@login_required()
def projectCreate():
    """
    ### 프로젝트 생성

> POST /rest/api/1/project/create

프로젝트를 생성 한다
> 

Permissions : System Admin

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <Project>
    
    ```jsx
    {
    }
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <Project>
    
    ```jsx
    
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    | 405 | Method not allowed |
    """                
   
    if request.is_json == False:
        raise ArgsException(f" project data is missing!")
    
    params = request.get_json()
        
    # permission
    if PermissionMgr.check_permission_project_create( serviceUser.getCurrentUserID()) == False:
        raise ArgsException(f"You do not have create permission.", ExceptionCode.FORBIDDEN)
    
    project = serviceProject.createProject( params )
    
    return Response(response=str(project)) 

@bp_project.route('/delete', methods=['DELETE'])
@login_required()
def projectDelete():
    """
    ### 프로젝트 삭제

> DELETE /rest/api/1/project/delete

프로젝트를 삭제한다
> 

Permissions : System Admin

Methods : DELETE

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    
    project_id = utils.getOrDefault(request.args.get("project_id"))
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    # permission
    if PermissionMgr.check_permission_project_delete( serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have delete permission.", ExceptionCode.FORBIDDEN)    
    
    # delete    
    project = serviceProject.deleteProject(project_id)    
    
    return Response(response=str(project)) 

@bp_project.route('/update', methods=['POST'])
@login_required()
def projectUpdate():
    """
    ### 프로젝트 정보 변경

> POST /rest/api/1/project/update

프로젝트 정보를 변경한다
> 

Permissions : Project Owner

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <Project>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data : <Project>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    if request.is_json == False:
        raise ArgsException(f" project data is missing!")    
   
    params = request.get_json()
    
    project_id = params.get("project_id")
    if project_id is None:
        raise ArgsException(f"project_id({project_id}) is missing")
    
    # permission
    if PermissionMgr.check_permission_project_edit( serviceUser.getCurrentUserID(), project_id) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)
    
    project_manager = params.get("project_manager")
    if project_manager is None:
        raise ArgsException("project_manager is missing!")
    manager_id = project_manager.get("user_id")
    if manager_id is None:
        raise ArgsException("project_manager must have user_id field!")

    manager_info = serviceUser.getUser(manager_id)
    if manager_info is None:
        raise ArgsException(f"there is no user, has user_id({manager_id})")
    elif manager_info.role_id == 3:
        raise ArgsException(f"input user_id({manager_id}) is Member.", ExceptionCode.FORBIDDEN)
    
    project = serviceProject.updateProject( params )
    
    return Response(response=str(project)) 


@bp_project.route('/search', methods=['GET'])
@login_required()
def projectSearch():
    """
    ### 프로젝트 목록 조회

> GET /rest/api/1/project/search

프로젝트 리스트를 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_name | 프로젝트 이름 | n | Project.project_name |
    | project_type_id | 프로젝트 유형 이름 id | n | ProjectType.project_type_id |
    | created_start | 프로젝트 생성 날짜 start  | n | integer |
    | created_end | 프로젝트 생성 날짜 end (default: 현재  날짜) | n | integer |
- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Project>[]
    
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
    
    # permission
    if PermissionMgr.check_permission_project_search( serviceUser.getCurrentUserID()) == False:
        raise ArgsException(f"You do not have search permission.", ExceptionCode.FORBIDDEN)
    
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='created')
    order = config.toSortOrder(request.args.get('order', default=config.DEFAULT_SORT_ORDER.value))    
    
    project_name = utils.getOrDefault(request.args.get('project_name'))
    project_type_id = utils.getOrDefault(request.args.get('project_type_id'))
    created_start = utils.getOrDefault(request.args.get('created_start', type=int))
    created_end = utils.getOrDefault(request.args.get('created_end', type=int))
    task_count_min = utils.getOrDefault(request.args.get('task_count_min', type=int))
    task_count_max = utils.getOrDefault(request.args.get('task_count_max', type=int))
 
    searchResult = serviceProject.findProjectsBy(project_name, project_type_id, created_start, created_end, task_count_min, task_count_max, startAt, maxResults, orderBy, order)
    return Response(response= str(searchResult) )

@bp_project.route('/member/add', methods=['POST'])
@login_required()
def projectAddMember():
    """
    ### 프로젝트 멤버 추가

> GET /rest/api/1/project/member/add

프로젝트에 user_id 리스트를 추가한다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | project_member_ids | 프로젝트에 추가할 멤버 리스트 | y | ProjectType.project_member_ids |

- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Project>[]
    
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
    param = request.get_json()
    project_id = param.get("project_id")
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    project_member_ids = param.get("project_member_ids")
    if project_member_ids is None:
        raise ArgsException(f"project_member_ids is missing")
    
    resonse = serviceProject.serviceAddProjectMembers(project_id,project_member_ids)

    return Response(response=str(resonse))

@bp_project.route('/member/del', methods=['POST'])
@login_required()
def projectDelMember():
    """
    ### 프로젝트 멤버 삭제

> GET /rest/api/1/project/member/del

프로젝트에 선택된 user_id 리스트를 제거한다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | type |
    | --- | --- | --- | --- |
    | project_id | 프로젝트 id | y | Project.project_id |
    | project_member_ids | 프로젝트에 추가할 멤버 리스트 | y | ProjectType.project_member_ids |

- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <Project>[]
    
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
    param = request.get_json()
    project_id = param.get("project_id")
    if project_id is None:
        raise ArgsException(f"project_id is missing")
    
    del_project_member_ids = param.get("del_project_member_ids")
    if del_project_member_ids is None:
        raise ArgsException(f"del_project_member_ids is missing")
    
    resonse = serviceProject.serviceDelProjectMembers(project_id,del_project_member_ids)

    return Response(response=str(resonse))