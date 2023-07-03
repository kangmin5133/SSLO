"""
#인증 & 사용자 
Version : 1
"""
    
import json
from functools import wraps
import inject
from flask import Flask, jsonify, request, Blueprint, session, make_response, redirect
from flask import current_app
from flask.wrappers import Response
# from flask_wtf.csrf import CSRFProtect, generate_csrf, CSRFError
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token, verify_jwt_in_request
)
from numpy import block
import traceback

import utils
from service import serviceUser
from service.permission import PermissionMgr
import config
from config import Config

from flask import Flask, request, Blueprint, send_file, render_template, render_template_string
from flask_mail import Message, Mail
import secrets
from log import logger
import requests
from model import User, UserRole
from exception import ArgsException, ExceptionCode
from config.oauth import Oauth


bp_auth = Blueprint('auth', __name__)


app = inject.instance(Flask)
jwt = inject.instance(JWTManager)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = Config.SSLO_EMAIL_ADDR
app.config['MAIL_PASSWORD'] = Config.SSLO_EMAIL_PSWD
app.config['TESTING'] = False
mail = Mail(app)

blockList = {}

# @app.errorhandler(CSRFError)
# def _handle_csrf_error(e):
#     raise ArgsException('The CSRF token is invalid', ExceptionCode.UNAUTHORIZED)

# 로그인 되어 있지 않은 사용자
@jwt.expired_token_loader
@jwt.invalid_token_loader
@jwt.unauthorized_loader
@jwt.user_lookup_error_loader
@jwt.revoked_token_loader
def jwt_error_loader(jwt_header = None, jwt_payload = None):
    
    traceback.print_stack(limit=2)    
        
    logger.info(f"jwt_error_loader -  jwt_header : {jwt_header}, jwt_payload : {jwt_payload}" )
    
    argEx:ArgsException = ArgsException('login_required', ExceptionCode.UNAUTHORIZED)
    return Response( response=str(argEx), status=int(argEx._error_code.value))
    
    

def checkLogin(optional: bool = False,
    fresh: bool = False,
    refresh: bool = False,
    verify_type: bool = True) -> bool:
    
    logger.info(f"checkLogin -  optional : {optional}, fresh : {fresh}, refresh: {refresh}, verify_type : {verify_type} " )
    
    try:
        verify_jwt_in_request(optional=optional, fresh=fresh, refresh=refresh, verify_type=verify_type)
    except:
        if config.isPassLoginRequired():
            return True
        raise            
        
    print(f" current id : {serviceUser.getCurrentUserID()} ")
        
    
    isBlock = blockList.get(serviceUser.getCurrentUserID(), False)
    
    print(f" isBlock : {isBlock} , {serviceUser.getCurrentUserID()} ")
    
    if isBlock:
        raise ArgsException(f"login required", ExceptionCode.UNAUTHORIZED)
    
    return True

# login_req
def login_required(optional: bool = False,
    fresh: bool = False,
    refresh: bool = False,
    verify_type: bool = True):   

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
                  
            checkLogin(optional=optional, fresh=fresh, refresh=refresh, verify_type=verify_type)
             
            return current_app.ensure_sync(fn)(*args, **kwargs)

        return decorator

    return wrapper

     




@bp_auth.route("/session", methods=["GET"])
#@csrf.exempt
def check_session():
    """
    ### 세션 체크

> GET /rest/api/1/auth/session

로그인 여부 체크
> 

Permissions : ****Anonymous access****

Methods : GET

- Request
- Response
    
    **Content type : application/json**
    
    | name | type |  | desc |
    | --- | --- | --- | --- |
    | login | boolean |  | 로그인 여부 true, false |
    
    ```python
    {
        "login": True
    }
    ```
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    """
    
    isLogin:bool = False    
    try:        
        isLogin = checkLogin()
    except:
        isLogin = False            

    return jsonify({"login": isLogin})


@bp_auth.route("/refresh", methods=["POST"])
@login_required(refresh=True)
def refresh():
    identity = serviceUser.getCurrentUserID()
    
    access_token = create_access_token( identity=identity)
    refresh_token = create_refresh_token( identity=identity)   
    
    info = {
        "access_token": access_token
        , "refresh_token": refresh_token
        }
    
    return Response( response=json.dumps(info),  headers=info )    

@bp_auth.route("/login", methods=["POST"])
#@csrf.exempt
def login():
    """
    ### 로그인

> POST /rest/api/1/auth/login

로그인
https://github.com/tbell-dev/sample-login
> 

Permissions : ****Anonymous access****

Methods : **POST**

- Request
    
    **Content type : application/json**
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | user_id | 사용자 id | y | <User>.user_id 참조 |
    | user_password | 사용자 비밀번호 | y |  |
    
    ```jsx
    {
        "user_id" : "user01",
        "user_password" : "qwer1"
    }
    ```
    
- Response
    
    Header 
    
    | name | type |  | desc |
    | --- | --- | --- | --- |
    | X-CSRFToken | string |  | 인증토큰 |
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    """
    if request.is_json == False:
        raise ArgsException(f"request data form invalid!")     
    
    params = dict(request.get_json())  # type: ignore
       
    user_id = params.get("user_id")
    if user_id is None:
        raise ArgsException(f"user_id required!")
    
    user_password = params.get("user_password")
    if user_password is None:
        raise ArgsException(f"user_password required!")
    # get user 
    login_info = serviceUser.getUser(user_id)
    if login_info is None:
        raise ArgsException(f"user({user_id}) is not exist!")

    print(f" login_info : {login_info}")
        
    # login passwd check            
    if login_info.check_password(user_password) is False:
        raise ArgsException(f"password is wrong!")
    # add 0220 - check if login user is admin and didn't verify email account to activate own organization
    # admin 인 경우
    user_role = serviceUser.getRoleByuserId(user_id)
    if user_role is None:
        raise ArgsException(f"no user found")
    
    if user_role.get("role_id") == 1: 
        organization = serviceUser.getOrganizationByAdmin(user_id)[0]
        # 인증 안된 상태
        if organization._token == None and organization._organization_email_verification == "false":
            user_email = login_info._user_email
            verification_token = secrets.token_urlsafe(32)
            verification_link = request.url_root+"/rest/api/1/auth/" + 'email/verify?token=' + verification_token
            send_email_verification(user_email, user_id,verification_link)
            
            # organization token DB update
            organization = serviceUser.addToken(login_info._user_id,verification_token)

            return "Please check your email to verify your account."
        
        # 이메일 인증을 하지 않고 재 로그인 시도 시
        elif organization._token is not None and organization._organization_email_verification == "false":
            return "Please check your email to verify your account."

        # 인증된 상태
        elif organization._organization_email_verification == "true":
            access_token = create_access_token( identity=login_info.get_id())
            refresh_token = create_refresh_token( identity=login_info.get_id())   

            blockList.pop(login_info.get_id(), None)

            info = json.loads(str(login_info))
            info["access_token"] = access_token
            info["refresh_token"] = refresh_token

            res = Response( response=json.dumps(info, ensure_ascii=False), headers={
                "access_token": access_token
                , "refresh_token": refresh_token
                }
            )
            return res
    # 일반 user 인 경우
    elif user_role.get("role_id") == 3 or user_role.get("role_id") == 2:
        access_token = create_access_token( identity=login_info.get_id())
        refresh_token = create_refresh_token( identity=login_info.get_id())   

        blockList.pop(login_info.get_id(), None)

        info = json.loads(str(login_info))
        info["access_token"] = access_token
        info["refresh_token"] = refresh_token

        res = Response( response=json.dumps(info, ensure_ascii=False), headers={
            "access_token": access_token
            , "refresh_token": refresh_token
            }
        )
        return res


@bp_auth.route('/logout', methods=['GET'])
@login_required()
def logout():
    """
    ### 로그아웃

> POST /rest/api/1/auth/logout

로그아웃
> 

Permissions : LogginedUser

Methods : **POST**

- Request
    
    *There are no parameters for this request.*
    
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 401 | Unauthorized |
    """
    print(f" current_user : {serviceUser.getCurrentUserID()}")
   
    blockList.update({ f"{serviceUser.getCurrentUserID()}": True} )
    
    return Response("logout")


@bp_auth.route('/user', methods=['GET'])
@login_required()
def user():
    """
    ### 사용자 조회

> GET /rest/api/1/auth/user

사용자 정보를 가져온다
> 

Permissions : LogginedUser

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | user_id | 사용자 id | n | User.user_id |
- Response
    
    **Content type : application/json**
    
    Data : <User>
    """    
    
    user_id = utils.getOrDefault(request.args.get('user_id'))
          
    if user_id is None:
        # user_id = serviceUser.getCurrentUserID()
        return Response(response="") 
      
    # permission
    if PermissionMgr.check_permission_user_view( serviceUser.getCurrentUserID(), user_id) == False:
        raise ArgsException(f"You do not have view permission.", ExceptionCode.FORBIDDEN)
     
    user = serviceUser.getUser(user_id)
    print(f"\n\n user_info : {user}")

    return Response(response=str(user))
        
@bp_auth.route('/user/role', methods=['GET'])
@login_required()
def userRole():
    """
    ### 사용자 역할 조회

> GET /rest/api/1/auth/user/role

사용자 역할  정보를 가져온다
> 

Permissions : LogginedUser

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | user_id | 사용자 id | n | User.user_id |
- Response
    
    **Content type : application/json**
    
    Data : <UserRole>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |

    """    
    
    user_id = utils.getOrDefault(request.args.get('user_id'))
    if user_id is None:
        raise ArgsException(f"user_id is missing.")

    userRole = serviceUser.getUserRole(user_id)        
    print(f" ---> userRole : {userRole}")
    print(f" ---> userRole type  : { type( userRole )}")
    return Response( response=str(userRole)) 


@bp_auth.route('/user/create', methods=['POST'])
@login_required()
def userCreate():
    """
    ### 사용자 생성

> POST /rest/api/1/auth/user/create

사용자를 생성 한다
> 

Permissions : System Admin

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <User>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <User>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    # permission
    if PermissionMgr.check_permission_user_create( serviceUser.getCurrentUserID() ) == False:
        raise ArgsException(f"You do not have create permission.", ExceptionCode.FORBIDDEN)
    
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
            
    params = request.get_json()
    
    createdUser = serviceUser.createUser(params)
    
    return Response(response=str(createdUser)) 

@bp_auth.route('/user/update', methods=['POST'])
@login_required()
def userUpdate():
    """
    ### 사용자 정보 변경(비밀번호 재설정)

> POST /rest/api/1/auth/user/update

사용자를 생성 한다
> 

Permissions : System Admin

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <User>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <User>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """    
    
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
    params = request.get_json()
    
    user_id = params.get('user_id')
    if user_id is None:
        raise ArgsException(f"user_id({user_id}) is missing.")
    

    # permission
    if PermissionMgr.check_permission_user_edit( serviceUser.getCurrentUserID(), user_id) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)
    
    login_info = serviceUser.getUser(user_id)
    current_user_password = params.get('current_user_password')
    if current_user_password is None:
        new_user_password_password = None
        new_user_password_check_check = None

    elif current_user_password is not None:
        if login_info.check_password(current_user_password) is False:
            raise ArgsException("current password is wrong")

        new_user_password_password = params.get('new_user_password')
        new_user_password_check_check = params.get('new_user_password_check')

        if new_user_password_password != new_user_password_check_check:
            raise ArgsException("new password is different")       
    
    createdUser = serviceUser.updateUser(params)
    
    return Response(response=str(createdUser)) 

@bp_auth.route('/user/delete', methods=['DELETE'])
@login_required()
def userDelete():
    """
    ### 사용자 삭제

> DELETE /rest/api/1/auth/user/delete

사용자를 삭제한다
> 

Permissions : System Admin

Methods : DELETE

- Request
    
    ****QUERY PARAMETERS****
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | user_id | 사용자 id | y | <User>.user_id 참조 |
- Response
    
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 200 | Success |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """        
            
    user_id = utils.getOrDefault(request.args.get('user_id'))
    if user_id is None:
        raise ArgsException(f"user_id is missing")
    
    # permission
    if PermissionMgr.check_permission_user_delete( serviceUser.getCurrentUserID(), user_id) == False:
        raise ArgsException(f"You do not have delete permission.", ExceptionCode.FORBIDDEN)
        
    # delete
    deletedUser = serviceUser.deleteUser(user_id)
                        
    return Response(response=str(deletedUser)) 


@bp_auth.route('/user/search', methods=['GET'])
@login_required()
def userSearch():

    """
    ### 사용자 목록 조회

> GET /rest/api/1/auth/user/search

사용자 리스트를 가져온다
> 

Permissions : Project Owner

Methods : **GET**

- Request
    
    ****QUERY PARAMETERS****
    
    검색 조건
    
    | Item | Desc | Required | max length |
    | --- | --- | --- | --- |
    | user_id | 사용자 id | n | User.user_id |
    | user_name | 사용자 name | n | User.user_name |
    | user_email | 사용자 email | n | User.user_email |
- Response
    
    **Content type : application/json**
    
    Data: <PageInfo>, <User>[]
    
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
    if PermissionMgr.check_permission_user_search( serviceUser.getCurrentUserID()) == False:
        raise ArgsException(f"You do not have search permission.", ExceptionCode.FORBIDDEN)
    
    startAt = request.args.get('startAt', default=0, type=int)
    maxResults = request.args.get('maxResults', default=config.DEFAULT_PAGE_LIMIT, type=int)
    orderBy = request.args.get('orderBy', default='user_id')
    order = config.toSortOrder(request.args.get('order', default=config.DEFAULT_SORT_ORDER.value))
    
    
    user_id = utils.getOrDefault(request.args.get('user_id'))
    user_display_name = utils.getOrDefault(request.args.get('user_display_name'))
    user_email = utils.getOrDefault(request.args.get('user_email'))
    organization_id = utils.getOrDefault(request.args.get('organization_id'))
    role_id = utils.getOrDefault(request.args.get('role_id'))
    user_display_name_or_user_email = utils.getOrDefault(request.args.get('user_display_name_or_user_email'))
        
    SearchResult = serviceUser.findUsersBy(user_id, user_display_name, user_email,organization_id,role_id, 
                                           user_display_name_or_user_email, startAt, maxResults, orderBy, order)
    return Response(response= str(SearchResult) )

@bp_auth.route('/admin/create', methods=['POST'])
def adminCreate():
    """
    ### 관리자 생성(for 조직 설정)

> POST /rest/api/1/auth/admin/create

관리자를 생성 한다
> 

Permissions : System Admin

Methods : POST

- Request
    
    **Content type : application/json**
    
    Data: <User>
    
    ```jsx
    
    ```
    
- Response
    
    **Content type : application/json**
    
    Data: <User>
    
    | 이름 | HTTP응답상태 |
    | --- | --- |
    | 201 | Created |
    | 400 | Bad Request |
    | 401 | Unauthorized |
    | 403 | Forbidden |
    """
    
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
            
    params = request.get_json()
    createdAdmin= serviceUser.createAdmin(params)
    
    return Response(response=str(createdAdmin))

def send_email_verification(email,user_id,verification_link):
    msg = Message('Verify your email address',sender = Config.SSLO_EMAIL_ADDR,recipients=[email])
    # msg.body = f'Please click the following link to verify your email address: {verification_link}'
    # mail.send(msg)
    html = render_template("email_verification.html",user_id = user_id,verification_link = verification_link)
    msg.html = html
    mail.send(msg)

def send_email_invitation(invitor,email, invitation_link):
    msg = Message(f'{invitor} has sent invitation link to SSLO',sender = Config.SSLO_EMAIL_ADDR,recipients=[email])
    html = render_template("email_invitation.html",admin_id=invitor,user_email = email,invitation_link = invitation_link)
    print(f"Config.SSLO_EMAIL_ADDR : {Config.SSLO_EMAIL_ADDR}, email : {email},invitation_link :{invitation_link}")
    # msg.body = f'Please click below link to join our service!\n link : {verification_link}'
    msg.html = html
    mail.send(msg)

def createTempPass(length = 8):
    return secrets.token_urlsafe(length)

def send_email_temp_password(email, user_id,temp_password):
    msg = Message('change your password',sender = Config.SSLO_EMAIL_ADDR,recipients=[email])
    html = render_template("email_temp_password.html",user_id=user_id,temp_password=temp_password)
    # msg.body = f'Please click below link to join our service!\n link : {verification_link}'
    msg.html = html
    mail.send(msg)

def send_email_find_id(email, response):
    msg = Message('change your password',sender = Config.SSLO_EMAIL_ADDR,recipients=[email])
    html = render_template("email_find_id.html",user_email = email,user_id=response)
    # msg.body = f'Please click below link to join our service!\n link : {verification_link}'
    msg.html = html
    mail.send(msg)

@bp_auth.route('/email/verification', methods=['POST'])
@login_required()
def sendEmailVerificationLink():

    user_email = request.args.get('user_email', type=str)
    user_id = request.args.get('user_id', type=str)
    verification_token = secrets.token_urlsafe(32)
    verification_link = request.url_root+"/rest/api/1/auth/" + 'email/verify?token=' + verification_token
    send_email_verification(email = user_email, user_id = user_id ,verification_link = verification_link)

    return "Please check your email to verify your account."

@bp_auth.route('/email/verify', methods=['GET'])
def isMailVerified():
    token = request.args.get('token')
    # ... lookup the user record by the verification token ...
    result = serviceUser.isValidToken(token)
    if result:
        response = serviceUser.emailVerified(token)
        return redirect(Config.SSLO_HOME_URL+"/login/complete/email")
    else :
        # try again
        # response = "token value invalid please try again"
        return redirect(Config.SSLO_HOME_URL+"/login/fail/email")

    # return Response(response=str(response))

@bp_auth.route('/email/invite', methods=['POST'])
@login_required()
def sendEmailInvitationLink():

    admin_id = request.args.get('admin_id', type=str)
    user_email = request.args.get('user_email', type=str)
    organization_id = request.args.get('organization_id', type=int)
    
    invitation_link = Config.SSLO_REGISTER_URL+"?organization_id="+str(organization_id)+"&user_email="+str(user_email)
    send_email_invitation(invitor = admin_id,email = user_email,invitation_link = invitation_link)

    return "Please check your email"

@bp_auth.route('/organization/search', methods=['GET'])
@login_required()
def getOrganizationInfo():
    organization_id = request.args.get('organization_id', type=int)
    if organization_id is None:
        raise ArgsException("organization_id is missing")

    response = serviceUser.getOrganizationById(organization_id)

    return Response(response=str(response))

@bp_auth.route('/organization/member', methods=['GET'])
@login_required()
def getOrganizationMemberInfo():
    organization_id = request.args.get('organization_id', type=int)
    if organization_id is None:
        raise ArgsException("organization_id is missing")

    response = serviceUser.getOrganizationMemberById(organization_id)

    return Response(response=str(response))


@bp_auth.route('/user/find/id', methods=['GET'])
def searchUserId():
    user_email = request.args.get('user_email', type=str)
    if user_email is None:
        raise ArgsException("user_email is missing")
    
    response = serviceUser.findUserId(user_email)
    # send_email_find_id(user_email,response)

    return Response(response=str(response))

@bp_auth.route('/user/find/passwd', methods=['GET'])
def reviseUserPw():
    user_id = request.args.get('user_id', type=str)
    if user_id is None:
        raise ArgsException("user_id is missing")
    
    user_email = request.args.get('user_email', type=str)
    if user_email is None:
        raise ArgsException("user_email is missing")
    temp_password = createTempPass() 
    send_email_temp_password(user_email,user_id,temp_password)
    
    response = serviceUser.reviseUserPw(user_id,user_email,temp_password)
    return Response(response=str(response))

@bp_auth.route('/social/naver', methods=['GET'])
def naverSocialLogin():
    url = f"https://nid.naver.com/oauth2.0/authorize?client_id={Config.NAVER_CLIENT_ID}&redirect_uri={Config.NAVER_REDIRECT_URI}&response_type=code"
    print("url : ",url)
    return redirect(url)

@bp_auth.route('/social/naver/callback', methods=['GET'])
def naverSocialLoginCallback():
    params = request.args.to_dict()
    code = params.get("code")

    token_request = requests.get(f"https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id={Config.NAVER_CLIENT_ID}&client_secret={Config.NAVER_CLIENT_SECRET}&code={code}")
    token_json = token_request.json()

    access_token = token_json.get("access_token")
    profile_request = requests.get("https://openapi.naver.com/v1/nid/me", headers={"Authorization" : f"Bearer {access_token}"},)
    profile_data = profile_request.json()

    print(f"profile_data : {profile_data} , token_data : {token_json}")

    response = serviceUser.socialLogin(loginFrom="naver",profile_data = profile_data,token_data = token_json)
    if response.get("access_token") is None:
        return Response("Invalid Access") 
    else:
        res = Response( response=json.dumps(response, ensure_ascii=False), headers={
            "access_token": response.get("access_token"),
            "refresh_token": response.get("refresh_token")
            }
        )
        return res

@bp_auth.route('/social/kakao', methods=['GET'])
def kakaoSocialLogin():
    kakao_oauth_url=f"https://kauth.kakao.com/oauth/authorize?client_id={Config.KAKAO_CLIENT_ID}&redirect_uri={Config.KAKAO_REDIRECT_URI}&response_type=code"
    return redirect(kakao_oauth_url)

@bp_auth.route('/social/kakao/callback', methods=['GET'])
def kakaoSocialLoginCallback():
    code = str(request.args.get('code'))
    oauth = Oauth()
    auth_info = oauth.auth(code)
    access_token = auth_info['access_token']
    profile_data = oauth.userinfo("Bearer " + auth_info['access_token'])

    print(f"profile_data : {profile_data} , token_data : {auth_info}")
    response = serviceUser.socialLogin(loginFrom="kakao",profile_data = profile_data,token_data = auth_info)
    if response.get("access_token") is None:
        return Response("Invalid Access") 
    else:
        res = Response( response=json.dumps(response, ensure_ascii=False), headers={
            "access_token": response.get("access_token"),
            "refresh_token": response.get("refresh_token")
            }
        )
        return res

@bp_auth.route('/social/google', methods=['GET'])
def googleSocialLogin():
    app_key = Config.GOOGLE_CLIENT_ID
    scope = "https://www.googleapis.com/auth/userinfo.email " + \
            "https://www.googleapis.com/auth/userinfo.profile"
    
    redirect_uri = Config.GOOGLE_REDIRECT_URI
    google_auth_api = "https://accounts.google.com/o/oauth2/v2/auth"
    
    google_auth_url = f"{google_auth_api}?client_id={app_key}&response_type=code&redirect_uri={redirect_uri}&scope={scope}"
    
    return redirect(google_auth_url)

@bp_auth.route('/social/google/callback', methods=['GET'])
def googleSocialLoginCallback():
    code = request.args.get('code')
    google_token_api = "https://oauth2.googleapis.com/token"
    
    token_data = serviceUser.googleGetTokenData(google_token_api, code)
    user_data = serviceUser.googleGetUserInfo(access_token=token_data.get("access_token"))
    
    profile_data = {
        'username': user_data['email'],
        'first_name': user_data.get('given_name', ''),
        'last_name': user_data.get('family_name', ''),
        'nickname': user_data.get('nickname', ''),
        'name': user_data.get('name', ''),
        'image': user_data.get('picture', None),
        'path': "google",
    }

    print(f"profile_data : {profile_data} , token_data : {token_data}")
    response = serviceUser.socialLogin(loginFrom="google",profile_data = profile_data,token_data = token_data)
    if response.get("access_token") is None:
        return Response("Invalid Access") 
    else:
        res = Response( response=json.dumps(response, ensure_ascii=False), headers={
            "access_token": response.get("access_token"),
            "refresh_token": response.get("refresh_token")
            }
        )
        return res
    
# permission update
@bp_auth.route('/user/update/permission', methods=['POST'])
@login_required()
def updatePermission():
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
    params = request.get_json()

    user_id = params.get('user_id')
    if user_id is None:
        raise ArgsException(f"user_id({user_id}) is missing.")
    
    role_id = params.get('role_id')
    if role_id is None:
        raise ArgsException(f"user_id({role_id}) is missing.")
    
    # permission
    if PermissionMgr.check_permission_user_edit( serviceUser.getCurrentUserID(), user_id) == False:
        raise ArgsException(f"You do not have edit permission.", ExceptionCode.FORBIDDEN)

    response = serviceUser.updateUserPermission(params)
    return Response(response=str(response))

@bp_auth.route('/organization/update', methods=['POST'])
@login_required()
def updateOrganization():
    if request.is_json == False:
        raise ArgsException(f" data is missing!")
    params = request.get_json()

    organization_id = params.get('organization_id')
    if organization_id is None:
        raise ArgsException(f"organization_id is missing.")
    
    organization_name = params.get('organization_name')
    if organization_name is None:
        raise ArgsException(f"organization_name is missing.")
    
    response = serviceUser.udpateOrganizationName(params)
    return Response(response=str(response))
