import utils
import os
from utils import DataPathPartnership
from werkzeug.datastructures import FileStorage
from exception import ArgsException, ExceptionCode
from log import logger

from model import SearchResult
from model import User, Inquiry, Notice, Partnership
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn, GroupConcat, CustomFunction, QueryBuilder, Distinct
from service.database import IntegrityError
from service.permission import PermissionMgr
import config
from flask_jwt_extended import get_jwt_identity
from service.cache import CacheMgr
from service import serviceUser
import bcrypt 
import secrets

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


def getAllNotice() -> Notice:
    """_문의 내역 전체 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from notice")
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:
        notice:Notice = Notice.createFrom(r)  # type: ignore

    return notice

def getNotice(notice_id):

    r = DatabaseMgr.select("SELECT * from notice where notice_id=%s",notice_id)
    
    if r is None:
        return None  # type: ignore
    
    notice:Notice = Notice.createFrom(r)  # type: ignore

    return notice

def createNotice(jsonData) -> Notice:
    """_create notice_

    Args:
        notice (Notice): _description_

    Returns:
        _Notice_: _description_
    """
    notices = getAllNotice()
    notice_id_list = []
    [notice_id_list.append(notice.notice_id) for notice in notice_id_list]

    if notices == None:
        jsonData["notice_id"] = 1
    else : jsonData["notice_id"] = find_missing_or_next(notice_id_list)

    notice:Notice = Notice.createFrom(jsonData)      # type: ignore    
    
     # make query
     # params = notice_id,user_id, inquiry_type, inquiry_title, inquiry_user_display_name,inquiry_user_number,inquiry_user_email,inquiry_contents
    if notice._notice_type not in ["service","work","faq"]:
        raise ArgsException("inquiry_type must be one of service, work, faq")
    
    if notice._notice_type == "faq":
        if notice._if_faq_type not in ["member", "service", "price", "solution", "error" , "etc"]:
            raise ArgsException("if_faq_type must be one of member, service, price, solution, error, etc")

    table = Table('notice')    
    query = Query.into(table).columns("notice_id","notice_title","notice_type", "if_faq_type", "notice_contents").select(
                Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s'),Parameter('%s')
             )  
    logger.info(f" ----> notice : {notice}")
    try:
        DatabaseMgr.update( query , [ notice._notice_id,notice._notice_title ,notice._notice_type,notice._if_faq_type, notice._notice_contents])
    except IntegrityError as e:        
        raise ArgsException(str(e))
    
    notice = getNotice(notice._notice_id)
    if notice is None:
        raise ArgsException(f"Fail to Create notice({notice._notice_id})")
    
    return notice


def getInquiry(user_id, inquiry_id = None,isClearCache=False) -> Inquiry:
    """_문의 내역 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    if inquiry_id:
        r = DatabaseMgr.select("SELECT * from inquiry where user_id=%s AND inquiry_id=%s", [user_id,inquiry_id])
    else:
        r = DatabaseMgr.select("SELECT * from inquiry where user_id=%s", user_id)
    
    if r is None:
        return None  # type: ignore
    
    inquiry:Inquiry = Inquiry.createFrom(r)  # type: ignore

    # CacheMgr.storeUser(user)

    return inquiry

def getAllInquiry() -> Inquiry:
    """_문의 내역 전체 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from inquiry")
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        inquiry:Inquiry = Inquiry.createFrom(r)  # type: ignore

    return inquiry

def createInquiry(jsonData) -> Inquiry:
    """_create inquiry_

    Args:
        user (User): _description_

    Returns:
        _User_: _description_
    """
    inquirys = getAllInquiry()
    inquiry_id_list = []
    [inquiry_id_list.append(inquiry.inquiry_id) for inquiry in inquirys]
    if inquirys == None:
        jsonData["inquiry_id"] = 1
    else : jsonData["inquiry_id"] = find_missing_or_next(inquiry_id_list)
    if jsonData["user_id"] is None:
        jsonData["user_id"] = ""

    inquiry:Inquiry = Inquiry.createFrom(jsonData)      # type: ignore    
    
     # make query
     # params = user_id, inquiry_type, inquiry_title, inquiry_user_display_name,inquiry_user_number,inquiry_user_email,inquiry_contents
    if inquiry._inquiry_type not in ["website","account","solution","etc"]:
        raise ArgsException("inquiry_type must be one of website, solution, account, etc")

    table = Table('inquiry')    
    query = Query.into(table).columns("inquiry_id","user_id", "inquiry_type", "inquiry_title", "inquiry_user_display_name","inquiry_user_number",
                                      "inquiry_user_email","inquiry_contents","inquiry_status").select(
                 Parameter('%s'),Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s')
             )  
    logger.info(f" ----> inquiry : {inquiry}")
    try:
        DatabaseMgr.update( query , [ inquiry._inquiry_id ,inquiry._user_id, 
                                     inquiry._inquiry_type, inquiry._inquiry_title,inquiry.inquiry_user_display_name,inquiry.inquiry_user_number,
                                     inquiry.inquiry_user_email,inquiry.inquiry_contents,inquiry.inquiry_status])
    except IntegrityError as e:        
        raise ArgsException(str(e))
    
    inquiry = getInquiry(inquiry._user_id,inquiry._inquiry_id)
    if inquiry is None:
        raise ArgsException(f"Fail to Create Inquiry({inquiry._user_id})")
    
    return inquiry

def updateInquiry(jsonData) -> Inquiry:
    user_id = jsonData.get('user_id')
    if user_id is None:
        raise ArgsException(f"user_id({user_id}) is missing.")
    
    inquiry_id = jsonData.get('inquiry_id')
    if inquiry_id is None:
        raise ArgsException(f"inquiry_id({inquiry_id}) is missing.")

    # make query
    table = Table('inquiry')    
    query = Query.update(table).where(table.inquiry_id==inquiry_id)

    imquiry = getInquiry(user_id,inquiry_id)[0]

    # print("imquiry_From_update : ",imquiry)

    updateableColums = ["inquiry_type", "inquiry_title", "inquiry_user_number","inquiry_contents"]
    updateCount = 0
    for col in updateableColums:
        item = jsonData.get(col)
        if item is not None:
            setattr(imquiry, "_"+col, item)
            query = query.set(Field(col), getattr(imquiry, "_"+col))                              
            
            updateCount += 1
    
    query = query.set(Field('updated'), fn.Now())
    
    if updateCount <= 0:
        raise ArgsException(f"At least 1 item is required for the update.")
                            
    count = DatabaseMgr.update( query )

    imquiry = getInquiry(user_id,inquiry_id)[0]
    if imquiry is None:
        raise ArgsException(f"Fail to Update imquiry({imquiry._user_id})")
    
    return imquiry

def deleteInquiry(user_id,inquiry_id) -> Inquiry:
    """_delete_user_

    Args:
        user_id (_type_): _description_

    Returns:
        User: _description_
    """

    inquiry = getInquiry(user_id,inquiry_id)[0]
    # make query    
    count = DatabaseMgr.update("DELETE FROM inquiry where inquiry_id=%s", (inquiry_id))

    return inquiry

def getAllPartnership():
    """_문의 내역 전체 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from partnership_inquiry")
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        partnership_inquiry:Partnership = Partnership.createFrom(r)  # type: ignore

    return partnership_inquiry

def getPartnership(partnership_inquiry_id):
    """_문의 내역 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from partnership_inquiry where partnership_inquiry_id=%s",partnership_inquiry_id)
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        partnership_inquiry:Partnership = Partnership.createFrom(r)  # type: ignore

    return partnership_inquiry

def getPartnershipByUser(user_id):
    """_문의 내역 정보를 가져온다_

    Args:
        user_id (str): _description_

    Returns:
        User: _description_
    """
    r = DatabaseMgr.select("SELECT * from partnership_inquiry where user_id=%s",user_id)
    
    if r is None or type(r) == tuple and len(r) == 0:
        return None  # type: ignore
    else:  
        partnership_inquiry:Partnership = Partnership.createFrom(r)  # type: ignore

    return partnership_inquiry

def save_files(user_id,fileStorageList:list):

    DataPathPartnership.createDirForFile(user_id)

    root_path = "/".join(os.getcwd().split("/")[:-1])
    middle_path = DataPathPartnership.getDirForFile(user_id).strip("..")
    file_format = ".pdf"

    for i in range(len(fileStorageList)):
        if DataPathPartnership.isAllowImageMineType(fileStorageList[i].mimetype) == False:
                    raise ArgsException(f"This is an unacceptable file format.({fileStorageList[i].filename})")

        total_len, _ = utils.checkFileSize(fileStorageList[i])      
        if utils.isFreeSpace(total_len) == False:
            raise ArgsException("Service Disk is Full, Check Disk", ExceptionCode.INTERNAL_SERVER_ERROR)
        
        fileStorageList[i].save(root_path+"/"+middle_path+"/"+fileStorageList[i].filename)


def creaetePartnership(jsonData) -> Partnership:

    partberships = getAllPartnership()
    partbership_id_list = []
    [partbership_id_list.append(partbership.partnership_inquiry_id) for partbership in partberships]

    if partberships == None:
        jsonData["partnership_inquiry_id"] = 1
    else : jsonData["partnership_inquiry_id"] = find_missing_or_next(partbership_id_list)

    partbership_inquiry:Partnership = Partnership.createFrom(jsonData)      # type: ignore

    if partbership_inquiry.partnership_inquiry_type not in ["technology","sales","advertisement","business","etc"]: # 기술,판매,광고,사업,기타
        raise ArgsException("inquiry_type must be one of (technology, sales, advertisement, business, etc)")
    
    if partbership_inquiry.partnership_inquiry_company_classification not in ["public","large corporation","medium-sized enterprise","SME","Startup","SMB"]: # 공공,대기업,중견,중소,스타트업,소상공인
        raise ArgsException("partnership_inquiry_company_classification must be one of (public, large corporation, medium-sized enterprise, SME, Startup, SMB)")

    table = Table('partnership_inquiry')    
    query = Query.into(table).columns('partnership_inquiry_id',
                                            'user_id',
                                            'partnership_inquiry_creator_name',
                                            'partnership_inquiry_type',
                                            'partnership_inquiry_title',
                                            'partnership_inquiry_contents',
                                            'partnership_inquiry_proposal',
                                            'partnership_inquiry_company_classification',
                                            'partnership_inquiry_company_name',
                                            'partnership_inquiry_company_number',
                                            'partnership_inquiry_company_email',
                                            'partnership_inquiry_company_website_url',
                                            'partnership_inquiry_company_introduction',
                                            'partnership_inquiry_status',).select(
                 Parameter('%s'),Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s'), Parameter('%s'),Parameter('%s'),
                 Parameter('%s'),Parameter('%s'), Parameter('%s'),Parameter('%s'),Parameter('%s'),Parameter('%s')
             )
    logger.info(f" ----> partbership_inquiry : {partbership_inquiry}")
    try:
        DatabaseMgr.update( query ,[partbership_inquiry._partnership_inquiry_id,str(partbership_inquiry._user_id),partbership_inquiry._partnership_inquiry_creator_name,partbership_inquiry._partnership_inquiry_type,partbership_inquiry._partnership_inquiry_title,
        partbership_inquiry._partnership_inquiry_contents,str(partbership_inquiry._partnership_inquiry_proposal),partbership_inquiry._partnership_inquiry_company_classification,
        partbership_inquiry._partnership_inquiry_company_name,partbership_inquiry._partnership_inquiry_company_number,partbership_inquiry._partnership_inquiry_company_email,
        partbership_inquiry._partnership_inquiry_company_website_url,str(partbership_inquiry._partnership_inquiry_company_introduction),
        str(partbership_inquiry._partnership_inquiry_status)])
    except IntegrityError as e:
        raise ArgsException(str(e))
    
    partbership_inquiry = getPartnership(partbership_inquiry._partnership_inquiry_id)
    if partbership_inquiry is None:
        raise ArgsException(f"Fail to Create partbership inquiry({partbership_inquiry._partnership_inquiry_id})")
    
    return partbership_inquiry

def replyInquiry(jsonData):
    if jsonData["inquiry_class"] == "inquiry":
        r = DatabaseMgr.select("SELECT * from inquiry where inquiry_id=%s",jsonData["inquiry_id"])
        inquiry:Inquiry = Inquiry.createFrom(r)[0]
        email = inquiry._inquiry_user_email

        table = Table('inquiry') 
        query = Query.update(table).where(table.inquiry_id==jsonData["inquiry_id"])
        query = query.set(Field("inquiry_status"),"true")
        query = query.set(Field('updated'), fn.Now())
        count = DatabaseMgr.update( query )

        r = DatabaseMgr.select("SELECT * from inquiry where inquiry_id=%s",jsonData["inquiry_id"])
        inquiry:Inquiry = Inquiry.createFrom(r)
        return inquiry,email            
        
    elif jsonData["inquiry_class"] == "partnership_inquiry":
        r = DatabaseMgr.select("SELECT * from partnership_inquiry where partnership_inquiry_id=%s",jsonData["inquiry_id"])
        partnership_inquiry:Partnership = Partnership.createFrom(r)[0]
        email = partnership_inquiry._partnership_inquiry_company_email

        table = Table('partnership_inquiry')
        query = Query.update(table).where(table.partnership_inquiry_id==jsonData["inquiry_id"])
        query = query.set(Field("partnership_inquiry_status"),"true")
        query = query.set(Field('updated'), fn.Now())
        count = DatabaseMgr.update( query )

        r = DatabaseMgr.select("SELECT * from partnership_inquiry where partnership_inquiry_id=%s",jsonData["inquiry_id"])
        partnership_inquiry:Partnership = Partnership.createFrom(r)

        return partnership_inquiry ,email

