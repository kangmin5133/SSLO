

import utils
from exception import ArgsException, ExceptionCode
from log import logger

from flask_jwt_extended import create_refresh_token,create_access_token
from model import SearchResult
from model import User, UserRole , Organization
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct
from service.database import IntegrityError
from service.permission import PermissionMgr
import config
from flask_jwt_extended import get_jwt_identity
from service.cache import CacheMgr
from service import serviceProject
import bcrypt 
import requests
from config import Config
import json
                   
def getCurrentUserID() -> str:
    """_현재 사용자의 id를 리턴_

    Returns:
        str: _description_
    """
    try:
        return get_jwt_identity()
    except:        
        if config.isPassLoginRequired():
            return "admin01"
        raise     
        
def getCurrentUser() -> User:
    """_get_current_user_

    Returns:
        User: _description_
    """
    return getUser(getCurrentUserID())
    
       
def getUserEmpty() -> User:
    
    return User("", "No User", None, None, None, None)

def getUser(user_id, isClearCache=False) -> User:
    """_사용자 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """

    if isClearCache:
        CacheMgr.updateUser(user_id)

    # user = CacheMgr.getUser(user_id)
    # if user is not None:
    #     print(f"\n\nuser_info by cache : {user}")
    #     print("\ncache returned!!!")
    #     return user

    r = DatabaseMgr.selectOne("SELECT * from user where user_id=%s", user_id)
    
    if r is None:
        return None  # type: ignore
    
    user:User = User.createFrom(r)  # type: ignore
    print(f"\n\nuser_info by query : {user}")

    CacheMgr.storeUser(user)

    return user


def createUser(jsonData) -> User:
    """_create user_

    Args:
        user (User): _description_

    Returns:
        _User_: _description_
    """
                            
    user:User = User.createFrom(jsonData)      # type: ignore
        
    findUser = getUser(user._user_id)
    if findUser is not None:
        raise ArgsException(f"User({user._user_id}) already exists.")
    
    if user._organization_id is None:
        raise ArgsException(f"User({user._user_id}) organization_id is missing")
    
    
     # make query
    table = Table('user')    
    query = Query.into(table).columns("user_id", "user_password", "user_display_name", "user_email","organization_id").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s')
             )  
    logger.info(f" ----> user : {user}")
    try:
        DatabaseMgr.update( query , [ user.get_id(), 
                                     bcrypt.hashpw(user._user_password.encode('utf-8'),bcrypt.gensalt()).decode()
                                     , user._user_display_name, user._user_email,user._organization_id ])
    except IntegrityError as e:        
        raise ArgsException(str(e))
    
    # make query
    table = Table('roles_globals')    
    query = Query.into(table).columns("user_id", "role_id").select(Parameter('%s'), Parameter('%s'))  
    logger.info(f" ----> user : {user}")
    try:
        DatabaseMgr.update( query , [user.get_id(),3])
    except IntegrityError as e:        
        raise ArgsException(str(e))
    
    user = getUser(user._user_id)
    if user is None:
        raise ArgsException(f"Fail to Create User({user._user_id})")
    
    return user

def updateUser(jsonData) -> User:
    
    user_id = jsonData.get('user_id')
    if user_id is None:
        raise ArgsException(f"user_id({user_id}) is missing.")
    
    findUser = getUser(user_id)
    if findUser is None:
        raise ArgsException(f"User({user_id}) is not exists.")
    
    user = findUser
    current_user_password = jsonData.get("current_user_password")
    if current_user_password is None:
        updateableColums = ["user_display_name", "user_email"]
    else:
        jsonData["user_password"] = jsonData["new_user_password_check"]
        updateableColums = ["user_display_name", "user_email", "user_password"]
            
    # make query
    table = Table('user')
    query = Query.update(table).where(table.user_id==user_id)
    
    # update item 
    updateCount = 0
    for col in updateableColums:
        item = jsonData.get(col)
        if item is not None:
            setattr(user, "_"+col, item)
            query = query.set(Field(col), getattr(user, "_"+col))                                    
            
            updateCount += 1
    
    query = query.set(Field('updated'), fn.Now())
    
    if updateCount <= 0:
        raise ArgsException(f"At least 1 item is required for the update.")
                            
    count = DatabaseMgr.update( query )
    
    user = getUser(user._user_id, True)
    if user is None:
        raise ArgsException(f"Fail to Update User({user._user_id})")
    
    return user


def deleteUser(user_id) -> User:
    """_delete_user_

    Args:
        user_id (_type_): _description_

    Returns:
        User: _description_
    """
    
    findUser = getUser(user_id)
    if findUser is None:
        raise ArgsException(f"User({user_id}) is not exists.")
    
    #cascade delete on project
    manager_member_ids = DatabaseMgr.select("SELECT project_id,project_manager_id,project_member_ids from project")
    for manager_member_id in manager_member_ids:
        if user_id == manager_member_id["project_manager_id"]:
            raise ArgsException(f"User({user_id}) is PM. you have to udpate project manager before delete account.")
        if manager_member_id["project_member_ids"] is not None:
            project_member_ids = manager_member_id["project_member_ids"].split(",")
            if user_id in project_member_ids:
                serviceProject.serviceDelProjectMembers(manager_member_id["project_id"],[user_id])

     # make query    
    count = DatabaseMgr.update("DELETE FROM user where user_id=%s", (user_id))
    
    CacheMgr.updateUser(findUser.get_id())
    
    return findUser
    
def getUserRole(user_id) ->  UserRole:
    """_사용자 역할 조회_

    Args:
        user (_type_): _description_

    Returns:
        _UserRole_: _description_
    """    
    
    sql = """
        SELECT ANY_VALUE(rg.role_id) as 'is_admin' , GROUP_CONCAT(p.project_id) as 'managed_projects'
        FROM user u
        LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
        LEFT JOIN project p ON p.project_manager_id = u.user_id 
        where u.user_id = %s
        GROUP  BY u.user_id 
        """
    result = DatabaseMgr.selectOne(sql, user_id)
    if result is None:
        raise ArgsException(f"User({user_id}) is not exists.")
    
    logger.info(f"result : {result}")
    
    if result["is_admin"] == 1:
        result["is_admin"] = True
        result["is_manager"] = False    
    elif result["is_admin"] == 2:
        result["is_admin"] = False
        result["is_manager"] = True
    else:
        result["is_admin"] = False
        result["is_manager"] = False

    userRole = UserRole.createFrom(result)         
    return userRole  # type: ignore
    

def findUsersBy(user_id=None, user_display_name=None, user_email=None, organization_id=None,role_id=None,
                user_display_name_or_user_email=None, startAt=0, maxResults=config.DEFAULT_PAGE_LIMIT, orderBy='created', order=config.DEFAULT_SORT_ORDER) -> SearchResult:
    """_사용자 리스트 조회_

    Args:
        user_id (_type_): _description_
        user_display_name (_type_): _description_
        user_email (_type_): _description_
        user_display_name_or_user_email (_type_): _description_

    Returns:
        User: _description_
    """    

    # make query
    table = Table('user')    
    query = Query.from_(table)
    
    # where
    if user_id is not None:
        query = query.where(table.user_id.like(f"%{user_id}%") )
    if user_display_name is not None:
        query = query.where(table.user_display_name.like(f"%{user_display_name}%") )
    if user_email is not None:
        query = query.where(table.user_email.like(f"%{user_email}%") )
    if organization_id is not None:
        query = query.where(table.organization_id.like(f"%{organization_id}%") )
    if role_id is not None:
        query = query.where(table.role_id.like(f"%{role_id}%") )
    if user_display_name_or_user_email is not None:
        query = query.where( table.user_display_name.like(f"%{user_display_name_or_user_email}%") | table.user_email.like(f"%{user_display_name_or_user_email}%") )
    
    # count
    queryCount = query.select( fn.Count(Distinct(table.user_id)).as_("totalResults") )
    countResult = DatabaseMgr.selectOne(queryCount)
    if countResult is None:
        totalResults = 0
    else :
        totalResults = DatabaseMgr.selectOne(queryCount).get("totalResults")
    
    # select
    querySelect = query.select("user_id", "user_password", "user_display_name", "user_email","organization_id","role_id", "created", "updated" )
    querySelect = utils.toQueryForSearch(querySelect, startAt, maxResults, orderBy, order)
        
    users = []
    for item in DatabaseMgr.select(querySelect):
        user = User.createFrom(item)
        users.append(user)  
            
    return SearchResult.create(users, startAt=startAt, totalResults=totalResults, maxResults=maxResults)
       
def getAllOrganization() -> Organization:
    """_등록된 조직 내역 전체 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from organization")
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        organization:Organization = Organization.createFrom(r)  # type: ignore

    return organization

def getOrganizationByAdmin(admin_id) -> Organization:
    """_등록된 조직 내역을 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from organization where admin_id=%s",admin_id)
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        organization:Organization = Organization.createFrom(r)  # type: ignore

    return organization

def getOrganizationById(organization_id) -> Organization:
    """_등록된 조직 내역을 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from organization where organization_id=%s",organization_id)
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        organization:Organization = Organization.createFrom(r)[0]  # type: ignore

    return organization

def getOrganizationMemberById(organization_id) -> Organization:
    """_조직id를 통해 해당 user_id를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from user where organization_id=%s",organization_id)
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        user:User = User.createFrom(r)  # type: ignore

    return user

def find_missing_or_next(lst):
    # 정렬된 리스트를 생성합니다.
    sorted_lst = sorted(lst)
    
    # 리스트에 1이 포함되어 있는지 확인합니다.
    if 1 not in sorted_lst:
        return 1
    
    # 리스트에서 누락된 숫자를 찾습니다.
    for i in range(len(sorted_lst) - 1):
        if sorted_lst[i+1] - sorted_lst[i] > 1:
            return sorted_lst[i] + 1
    
    # 리스트에서 누락된 숫자가 없는 경우, 다음 숫자를 반환합니다.
    return sorted_lst[-1] + 1

def getOrganizationIds() -> Organization:
    """_전체 조직id를 가져온다_

    Args:

    Returns:
        User: _description_
    """
    return DatabaseMgr.select("SELECT organization_id from organization")

def getRoleByuserId(user_id) -> Organization:
    """_등록된 관리자 내역을 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT user_id,role_id from roles_globals where user_id=%s",user_id)[0]
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        return r
    
def createAdmin(jsonData) -> User:
    """_create user_

    Args:
        user (User): _description_

    Returns:
        _User_: _description_
    """
    newJsonData = {}
    for key, item in jsonData.items():
        if key != "organization_name":
            newJsonData[key] = item

    user:User = User.createFrom(newJsonData)      # type: ignore
        
    findUser = getUser(user._user_id)
    if findUser is not None:
        raise ArgsException(f"User({user._user_id}) already exists.")
    
    
    # make query for add admin info to user table
    table = Table('user')    
    query = Query.into(table).columns("user_id", "user_password", "user_display_name", "user_email").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
             )  
    try:
        DatabaseMgr.update( query , [ user.get_id(), 
                                     bcrypt.hashpw(user._user_password.encode('utf-8'),bcrypt.gensalt()).decode()
                                     , user._user_display_name, user._user_email ])
    except IntegrityError as e:        
        raise ArgsException(str(e))
    
    user = getUser(user._user_id)
    if user is None:
        raise ArgsException(f"Fail to Create User({user._user_id})")
    
    # make query for add admin to roles_globals table
    table = Table('roles_globals')    
    query = Query.into(table).columns("user_id", "role_id").select(
                Parameter('%s'), Parameter('%s')
    )
    logger.info(f" ----> admin : {user}")
    try:
        adminRoleId = DatabaseMgr.select("SELECT role_id from roles WHERE role_name = %s","Administrator")[0]
        DatabaseMgr.update( query , [ user.get_id(),int(adminRoleId['role_id'])])
    except IntegrityError as e:
        raise ArgsException(str(e))
    
    # make query for add admin to organization table & user table
    try:
        organizationJsonData = {}
        organization_ids = getOrganizationIds()
        org_id_list = []
        [org_id_list.append(organization_id["organization_id"]) for organization_id in organization_ids]
        if getAllOrganization() == None:
            organizationJsonData["organization_id"] = 1
        else :organizationJsonData["organization_id"] = find_missing_or_next(org_id_list)
        organizationJsonData["organization_name"] = jsonData["organization_name"]


        table = Table('organization')    
        query = Query.into(table).columns("organization_id", "organization_name","admin_id","organization_email").select(
                    Parameter('%s'), Parameter('%s'),Parameter('%s'), Parameter('%s')
        )
        DatabaseMgr.update( query , [ organizationJsonData["organization_id"],organizationJsonData["organization_name"],user.get_id(),user._user_email])

        # also update user table organization_id
        table = Table('user')    
        query = Query.update(table).where(table.user_id==user.get_id())
        query = query.set(Field("organization_id"),organizationJsonData["organization_id"])
        query = query.set(Field('updated'), fn.Now())
        count = DatabaseMgr.update( query )

         # also update user table role_id
        table = Table('user')    
        query = Query.update(table).where(table.user_id==user.get_id())
        query = query.set(Field("role_id"),1)
        query = query.set(Field('updated'), fn.Now())
        count = DatabaseMgr.update( query )

    except IntegrityError as e:
        raise ArgsException(str(e))

    return user

def addToken(admin_id,token) -> Organization:
    """_조직에 등록된 관리자의 토큰을 업데이트 한다_

    Args:
        token (str): _description_

    Returns:
        Organization: _description_
    """
    r = DatabaseMgr.update("UPDATE organization set token=%s WHERE admin_id=%s",[token,admin_id])
    organization = getOrganizationByAdmin(admin_id)
    return organization

def isValidToken(token):
    """_등록된 조직의 토큰을 가져온다_

    Args:
        token (str): _description_

    Returns:
        query: _description_
    """
    r = DatabaseMgr.select("SELECT token from organization where token=%s",token)
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        return r

def emailVerified(token):
    """_토큰이 일치함을 확인 한 후 인증여부를 업데이트한다_

    Args:
        token (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.update("UPDATE organization set organization_email_verification=%s WHERE token=%s",['true',token])
    admin_id = DatabaseMgr.select("SELECT admin_id from organization where token=%s",token)[0]
    organization = getOrganizationByAdmin(admin_id["admin_id"])
    return organization

def findUserId(user_email):
    """_user_id 가 있는지 확인함_

    Args:
        token (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from user where user_email=%s",user_email)[0]
    
    if r is None or type(r) == tuple and len(r) == 0:
        raise ArgsException("no matched user")
    else:  
        user:User = User.createFrom(r)
    
    return user._user_id

def reviseUserPw(user_id,user_email,temp_password):
    """_user_password 재설정(임시 비밀번호로 재설정)_

    Args:
        token (str): _description_

    Returns:
        User: _description_
    """
    # make query
    table = Table('user')    
    query = Query.update(table).where((table.user_id==user_id) & (table.user_email==user_email))
    
    # update item 
    query = query.set(Field("user_password"), bcrypt.hashpw(temp_password.encode('utf-8'),bcrypt.gensalt()).decode())    
    query = query.set(Field('updated'), fn.Now())                            
    count = DatabaseMgr.update( query )

    r = DatabaseMgr.select("SELECT * from user where user_id=%s",user_id)[0]
    
    if r is None or type(r) == tuple and len(r) == 0:
        raise ArgsException("no matched user")
    else:  
        user:User = User.createFrom(r)
    
    return user
# social login
def googleGetTokenData(google_token_api, code):
    client_id = Config.GOOGLE_CLIENT_ID
    client_secret = Config.GOOGLE_CLIENT_SECRET
    code = code
    grant_type = 'authorization_code'
    redirection_uri = Config.GOOGLE_REDIRECT_URI
    state = "random_string"
    
    google_token_api += \
        f"?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type={grant_type}&redirect_uri={redirection_uri}&state={state}"
    
    token_response = requests.post(google_token_api)
    
    token_data = token_response.json()
    
    return token_data

def googleGetUserInfo(access_token):
    user_info_response = requests.get(Config.GOOGLE_USER_INFO_URL,
        params={
            'access_token': access_token
        }
    )
    user_info = user_info_response.json()
    
    return user_info

def socialLogin(loginFrom,profile_data,token_data,organization_id=None):

    if loginFrom == "naver":
        response = profile_data.get("response")
        email = response.get("email")
        name = response.get("name")
        user_id = email.split("@")[0]
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    elif loginFrom == "kakao":
        response = profile_data.get("kakao_account")
        email = response.get("email")
        name = response.get("profile").get("nickname")
        user_id = email.split("@")[0]
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    elif loginFrom == "google":
        email = profile_data.get("username")
        name = profile_data.get("name")
        user_id = email.split("@")[0]
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)
    
    r = DatabaseMgr.select("SELECT * from user where user_email=%s",email)

    if r is None or type(r) == tuple and len(r) == 0:
         raise ArgsException("no match user found")

    organization_id = r[0].get("organization_id")
    if organization_id is None:
        raise ArgsException("organization_id is missing")
    
    if r is None or type(r) == tuple and len(r) == 0:
        # make query
        table = Table('user')    
        query = Query.into(table).columns("user_id", "user_display_name", "user_email","organization_id").select(
                    Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s')
                )  
        try:
            DatabaseMgr.update( query , [user_id,name,email,organization_id])
        except IntegrityError as e:        
            raise ArgsException(str(e))
        
        r = DatabaseMgr.select("SELECT * from user where user_email=%s",email)[0]
        user:User = User.createFrom(r)
    else:  
        user:User = User.createFrom(r[0])

    logger.info(f" ----> user : {user}")
    if refresh_token is None : 
        refresh_token = create_refresh_token( identity=user.get_id())

    info = json.loads(str(user))
    info["access_token"] = create_access_token(identity=user.get_id())
    info["refresh_token"] = refresh_token
    return info

def updateUserPermission(jsonData):

    user_id = jsonData.get('user_id')
    user = getUser(user_id)
    if user is None:
        raise ArgsException(f"User({user_id}) is not exists.")
    
    role_id = jsonData.get('role_id')
    if role_id not in [1,2,3]:
        raise ArgsException(f"role_id must be (1: Admin, 2: Project Manager, 3: Member) input {role_id} is not in a option")
    if role_id == 1:
        raise ArgsException(f"role_id (1: Admin) cannot be updated by user")
    # make query
    table = Table('user')    
    query = Query.update(table).where((table.user_id==user_id))
    
    # update item 
    query = query.set(Field("role_id"), role_id)    
    query = query.set(Field('updated'), fn.Now())                            
    count = DatabaseMgr.update( query )

    # make query
    user_ids = DatabaseMgr.select("SELECT user_id from roles_globals")
    table = Table('roles_globals')  
    if user_id in [user["user_id"] for user in user_ids]:
        # make query
        query = Query.update(table).where((table.user_id==user_id))
        
        # update item 
        query = query.set(Field("role_id"), role_id)                               
        count = DatabaseMgr.update( query )

    else:   
        query = Query.into(table).columns("user_id", "role_id").select(Parameter('%s'), Parameter('%s'))  
        logger.info(f" ----> user : {user}")
        try:
            DatabaseMgr.update( query , [user_id,role_id])
        except IntegrityError as e:        
            raise ArgsException(str(e))

    r = DatabaseMgr.select("SELECT * from user where user_id=%s",user_id)[0]
    
    if r is None or type(r) == tuple and len(r) == 0:
        raise ArgsException("no matched user")
    else:  
        user:User = User.createFrom(r)
    
    return user

def udpateOrganizationName(jsonData):
    organization_id = jsonData.get('organization_id')
    organization_name = jsonData.get('organization_name')

     # make query
    table = Table('organization')    
    query = Query.update(table).where((table.organization_id==organization_id))
    
    # update item 
    query = query.set(Field("organization_name"), organization_name)    
    query = query.set(Field('updated'), fn.Now())                            
    count = DatabaseMgr.update( query )

    organization = getOrganizationById(organization_id)
    return organization