"""
#help
Version : 1
"""

import json
import ast
import os
import inject
from flask import Flask, request, Blueprint, send_file, render_template, render_template_string
from flask_mail import Message, Mail
# import secrets
from flask.wrappers import Response

from api.api_auth import login_required

from exception import ArgsException, ExceptionCode

from model import Notice, Inquiry, Partnership
from service import serviceAI, serviceUser, serviceTask, serviceProject, serviceAnnotation, serviceHelp
from service.permission import PermissionMgr

import config
from config import Config

import utils
from utils import DataPathPartnership

bp_help = Blueprint('help', __name__)

app = inject.instance(Flask)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = Config.SSLO_EMAIL_ADDR
app.config['MAIL_PASSWORD'] = Config.SSLO_EMAIL_PSWD
app.config['TESTING'] = False
mail = Mail(app)

@bp_help.route('/inquiry/create', methods=['POST'])
def createInquiry():
    # user_id = request.args.get('user_id', type=str)  
    params = request.get_json()
    key_list = []
    for k,v in params.items():key_list.append(k)
    if "user_id" not in key_list:
        params["user_id"] = "none"
    else:
        if params["user_id"] == "":
            params["user_id"] = "none"
    
    params["inquiry_status"] = "false"
    response = serviceHelp.createInquiry(params)
          
    return Response(response=str(response)) 

@bp_help.route('/inquiry/search', methods=['GET'])
@login_required()
def searchInquiry():

    user_id = request.args.get('user_id', type=str)                     
    if user_id is None:
        raise ArgsException(f"user_id is missing")
    
    response = serviceHelp.getInquiry(user_id)
    if response is None:        
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
       
    return Response(response=str(response))

@bp_help.route('/inquiry/update', methods=['POST'])
@login_required()
def updateInquiry():
    
    params = request.get_json()

    response = serviceHelp.updateInquiry(params)
    if response is None:
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    return Response(response=str(response)) 

@bp_help.route('/inquiry/delete', methods=['DELETE'])
@login_required()
def deleteInquiry():

    user_id = request.args.get('user_id', type=str)                     
    if user_id is None:
        raise ArgsException(f"user_id is missing")
    
    inquiry_id = request.args.get('inquiry_id', type=int)                     
    if inquiry_id is None:
        raise ArgsException(f"inquiry_id is missing")
    
    response = serviceHelp.deleteInquiry(user_id = user_id, inquiry_id = inquiry_id)
    return Response(response=str(response)) 

@bp_help.route('/notice/create', methods=['POST'])
@login_required()
def createNotice():

    params = request.get_json()
    key_list = []
    if params["notice_type"] =="faq":
        for k,v in params.items():key_list.append(k)
        if "if_faq_type" not in key_list:
            raise ArgsException("if_faq_type missing")
        else:
            if params["if_faq_type"] == "" or params["if_faq_type"] == None:
                raise ArgsException("if_faq_type missing")
    else:
        params["if_faq_type"] = None


    response = serviceHelp.createNotice(params)
    if response is None:
        raise ArgsException(f"statics error", ExceptionCode.INTERNAL_SERVER_ERROR)
    
    return Response(response=str(response))  
    

@bp_help.route('/notice/search', methods=['GET'])
@login_required()
def searchNotice():
    notice_id = request.args.get('notice_id', type=int)                     
    if notice_id is None:
        response = serviceHelp.getAllNotice()
    else:
        response = serviceHelp.getNotice(notice_id)
    return Response(response=str(response))

@bp_help.route('/partnership/create', methods=['POST'])
def createPartnership():
    jsonData = {}

    user_id = request.form.get("user_id")
    creator_name = request.form.get("partnership_inquiry_creator_name")

    if creator_name is None:
        raise ArgsException("creator_name is missing!")
    
    if user_id == None or user_id == "":
        DataPathPartnership.createDirForFile(creator_name)
        root_path = "/".join(os.getcwd().split("/")[:-1])+"/"
        middle_path = DataPathPartnership.getDirForFile(creator_name).strip("..")+"/"
        save_path = root_path + middle_path
    else : 
        DataPathPartnership.createDirForFile(user_id)
        root_path = "/".join(os.getcwd().split("/")[:-1])+"/"
        middle_path = DataPathPartnership.getDirForFile(user_id).strip("..")+"/"
        save_path = root_path + middle_path
    
    for key, item in request.form.items():
        jsonData[key] = item

    fileStorageList = [request.files.get("partnership_inquiry_proposal"), request.files.get("partnership_inquiry_company_introduction")]

    for i in range(len(fileStorageList)):
        if fileStorageList[i] == None or fileStorageList[i].content_length == 0:
            if i == 0: jsonData["partnership_inquiry_proposal"] = None
            if i == 1: jsonData["partnership_inquiry_company_introduction"] = None
        else :
            if DataPathPartnership.isAllowImageMineType(fileStorageList[i].mimetype) == False:
                raise ArgsException(f"This is an unacceptable file format.({fileStorageList[i].filename})")      
            # if utils.isFreeSpace(utils.checkFileSize(fileStorageList[i])[0]) == False:
            #     raise ArgsException("Service Disk is Full, Check Disk", ExceptionCode.INTERNAL_SERVER_ERROR)

            fileStorageList[i].save(save_path+fileStorageList[i].filename)
            if i == 0: jsonData["partnership_inquiry_proposal"] = str(fileStorageList[i].filename)
            if i == 1: jsonData["partnership_inquiry_company_introduction"] = str(fileStorageList[i].filename)
    
    jsonData["partnership_inquiry_status"] = "false"
    response = serviceHelp.creaetePartnership(jsonData)
    return Response(response=str(response))

@bp_help.route('/partnership/search', methods=['GET'])
@login_required()
def searchPartnership():
    user_id = request.args.get('user_id', type=str)
    if user_id is None:
        raise ArgsException(f"user_id is missing")

    response = serviceHelp.getPartnershipByUser(user_id)
    return Response(response=str(response))

def send_email_reply(email, reply):
    msg = Message(f'system admin has sent reply to your inquiry',sender = Config.SSLO_EMAIL_ADDR,recipients=[email])
    msg.body = f'{reply}'
    mail.send(msg)

@bp_help.route('/reply', methods=['POST'])
@login_required()
def sendReplyViaEmail():
    params = request.get_json()

    if params["inquiry_class"] is None:
        raise ArgsException("inquiry_class is missing, please input either (inquiry, inquiry_partnership)")
    
    if params["inquiry_id"] is None:
        raise ArgsException("inquiry_id is missing")
    
    if params["reply_content"] is None:
        raise ArgsException("reply_content is missing")

    response,email = serviceHelp.replyInquiry(params)

    send_email_reply(email,params["reply_content"])

    return Response(response=str(response))


# @bp_help.route('/email/verification', methods=['GET'])
# def sendEmail():
#     user_email = request.args.get('user_email', type=str)

#     verification_code = serviceHelp.generateVerificationCode()
#     expiration_time = 10  # in minutes

#     template = serviceHelp.tempVerifyTemplate(verification_code,expiration_time)
#     # rendered_template = render_template_string(template, verification_code=verification_code, expiration_time=expiration_time)

#     msg = Message('Email Verification', sender = Config.SSLO_EMAIL_ADDR ,recipients=[user_email])
#     msg.html = render_template_string(template,
#                                verification_code=verification_code,
#                                expiration_time=expiration_time)

#     mail.send(msg)
#     return f'Verification message has been sent to {user_email}'
# def send_email_verification(email, verification_link):
#     msg = Message('Verify your email address',sender = Config.SSLO_EMAIL_ADDR,recipients=[email])
#     msg.body = f'Please click the following link to verify your email address: {verification_link}'
#     mail.send(msg)

# @bp_help.route('/email/verification', methods=['POST'])
# @login_required()
# def sendEmailVerificationLink():
#     global TOKEN
#     user_email = request.args.get('user_email', type=str)
#     verification_token = secrets.token_urlsafe(32)
#     TOKEN = verification_token
#     verification_link = request.url_root+"/rest/api/1/help/" + 'email/verify?token=' + verification_token
#     send_email_verification(user_email, verification_link)

#     return "Please check your email to verify your account."

# @bp_help.route('/email/verify', methods=['GET'])
# def isMailVerified():
#     global TOKEN
#     token = request.args.get('token')

#     # ... lookup the user record by the verification token ...
#     if token == TOKEN:
#         print("Your email address has been verified.")

#     # verify the user's email address
#     # ... mark the email as verified in the user record ...

#     return 'Your email address has been verified.'