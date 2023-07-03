
from exception import ArgsException
from .Base import ModelBase
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case, fn
from log import logger

class Partnership(ModelBase):
    """
    ### 제휴 문의

 - 제휴 문의
 
| name | type | length | desc |
| --- | --- | --- | --- |
| partnership_inquiry_id | int |  | 제휴 문의 사항 id | PK
| user_id | `model.User` |  | 제휴 문의 사용자 id |
| partnership_inquiry_type | string |  | 제휴 문의 유형 | 기술,판매,광고,사업,기타
| partnership_inquiry_title | string |  | 제휴 문의 제목 | 
| partnership_inquiry_contents | string|  | 제휴 문의 내용 |
| partnership_inquiry_proposal | string |  | 제휴 문의 제안서 |
| partnership_inquiry_company_classification | string |  | 제휴 문의 회사구분 | 공공,대기업,중견,중소,스타트업,소상공인
| partnership_inquiry_company_name | string |  | 제휴 문의 회사 이름 | 
| partnership_inquiry_company_number | string |  | 제휴 문의 회사 연락처 |
| partnership_inquiry_company_email | string |  | 제휴 문의 회사 이메일 |
| partnership_inquiry_company_website_url | string |  | 제휴 문의 회사 사이트 |
| partnership_inquiry_company_introduction | string |  | 제휴 문의 회사 소개서 |
| created | <Time> |  | 생성시간 |
| updated | <Time> |  | 변경시간 |
    """
    
    def __init__(self, partnership_inquiry_id,partnership_inquiry_creator_name,partnership_inquiry_type,partnership_inquiry_title,
    partnership_inquiry_contents,partnership_inquiry_proposal,partnership_inquiry_company_classification,partnership_inquiry_company_name,
    partnership_inquiry_company_number,partnership_inquiry_company_email,partnership_inquiry_company_website_url,partnership_inquiry_company_introduction,
     user_id=None,partnership_inquiry_status=None,created=None, updated=None):

        self.partnership_inquiry_id = partnership_inquiry_id
        self.user_id = user_id
        self.partnership_inquiry_creator_name = partnership_inquiry_creator_name
        self.partnership_inquiry_type = partnership_inquiry_type
        self.partnership_inquiry_title = partnership_inquiry_title
        self.partnership_inquiry_contents = partnership_inquiry_contents
        self.partnership_inquiry_proposal = partnership_inquiry_proposal
        self.partnership_inquiry_company_classification = partnership_inquiry_company_classification
        self.partnership_inquiry_company_name = partnership_inquiry_company_name
        self.partnership_inquiry_company_number = partnership_inquiry_company_number
        self.partnership_inquiry_company_email = partnership_inquiry_company_email
        self.partnership_inquiry_company_website_url = partnership_inquiry_company_website_url
        self.partnership_inquiry_company_introduction = partnership_inquiry_company_introduction
        self.partnership_inquiry_status = partnership_inquiry_status

        
        super().__init__(created, updated)    
    
    @property
    def _partnership_inquiry_id(self):
        return self.partnership_inquiry_id

    @property
    def _user_id(self):
        return self.user_id
    
    @property
    def _partnership_inquiry_creator_name(self):
        return self.partnership_inquiry_creator_name
    @_partnership_inquiry_creator_name.setter
    def _partnership_inquiry_creator_name(self, partnership_inquiry_creator_name) -> None:
        self.partnership_inquiry_creator_name = partnership_inquiry_creator_name
    
    @property
    def _partnership_inquiry_type(self):
        return self.partnership_inquiry_type
    @_partnership_inquiry_type.setter
    def _partnership_inquiry_type(self, partnership_inquiry_type) -> None:
        self.partnership_inquiry_type = partnership_inquiry_type
    
    @property
    def _partnership_inquiry_title(self):
        return self.partnership_inquiry_title
    @_partnership_inquiry_title.setter
    def _comment_creator(self, partnership_inquiry_title) -> None:
        self.partnership_inquiry_title = partnership_inquiry_title   
    
    @property
    def _partnership_inquiry_contents(self):
        return self.partnership_inquiry_contents
    @_partnership_inquiry_contents.setter
    def _partnership_inquiry_contents(self, partnership_inquiry_contents) -> None:
        self.partnership_inquiry_contents = partnership_inquiry_contents   
    
    @property
    def _partnership_inquiry_proposal(self):
        return self.partnership_inquiry_proposal
    @_partnership_inquiry_proposal.setter
    def _partnership_inquiry_proposal(self, partnership_inquiry_proposal) -> None:
        self.partnership_inquiry_proposal = partnership_inquiry_proposal   
    
    @property
    def _partnership_inquiry_company_classification(self):
        return self.partnership_inquiry_company_classification
    @_partnership_inquiry_company_classification.setter
    def _partnership_inquiry_company_classification(self, partnership_inquiry_company_classification) -> None:
        self.partnership_inquiry_company_classification = partnership_inquiry_company_classification   
    
    @property
    def _partnership_inquiry_company_name(self):
        return self.partnership_inquiry_company_name
    @_partnership_inquiry_company_name.setter
    def _partnership_inquiry_company_name(self, partnership_inquiry_company_name) -> None:
        self.partnership_inquiry_company_name = partnership_inquiry_company_name
    
    @property
    def _partnership_inquiry_company_number(self):
        return self.partnership_inquiry_company_number
    @_partnership_inquiry_company_number.setter
    def _partnership_inquiry_company_number(self, partnership_inquiry_company_number) -> None:
        self.partnership_inquiry_company_number = partnership_inquiry_company_number 
    
    @property
    def _partnership_inquiry_company_email(self):
        return self.partnership_inquiry_company_email
    @_partnership_inquiry_company_email.setter
    def _partnership_inquiry_company_email(self, partnership_inquiry_company_email) -> None:
        self.partnership_inquiry_company_email = partnership_inquiry_company_email 
    
    @property
    def _partnership_inquiry_company_website_url(self):
        return self.partnership_inquiry_company_website_url
    @_partnership_inquiry_company_website_url.setter
    def _partnership_inquiry_company_website_url(self, partnership_inquiry_company_website_url) -> None:
        self.partnership_inquiry_company_website_url = partnership_inquiry_company_website_url
    
    @property
    def _partnership_inquiry_company_introduction(self):
        return self.partnership_inquiry_company_introduction
    @_partnership_inquiry_company_introduction.setter
    def _partnership_inquiry_company_introduction(self, partnership_inquiry_company_introduction) -> None:
        self.partnership_inquiry_company_introduction = partnership_inquiry_company_introduction 
    
    @property
    def _partnership_inquiry_status(self):
        return self.partnership_inquiry_status
    @_partnership_inquiry_status.setter
    def _partnership_inquiry_status(self, partnership_inquiry_status) -> None:
        self.partnership_inquiry_status = partnership_inquiry_status  
    
    @classmethod
    def createIdInsertWith(cls, connect, partnership_inquiry_id,user_id,partnership_inquiry_type,partnership_inquiry_title,
    partnership_inquiry_contents,partnership_inquiry_proposal,partnership_inquiry_company_classification,
    partnership_inquiry_company_name,partnership_inquiry_company_number,partnership_inquiry_company_email,
    partnership_inquiry_company_website_url,partnership_inquiry_company_introduction) -> int:  
        
        table = Table("partnership_inquiry")
        query = Query.into(table).columns('partnership_inquiry_id',
                                            'user_id',
                                            'partnership_inquiry_type',
                                            'partnership_inquiry_title',
                                            'partnership_inquiry_contents',
                                            'partnership_inquiry_proposal',
                                            'partnership_inquiry_company_classification',
                                            'partnership_inquiry_company_name',
                                            'partnership_inquiry_company_number',
                                            'partnership_inquiry_company_email',
                                            'partnership_inquiry_company_website_url',
                                            'partnership_inquiry_company_introduction')
        
        query = query.select(Parameter("%s"), Parameter("%s"),Parameter("%s"), Parameter("%s"),Parameter("%s"), Parameter("%s"),
        Parameter("%s"), Parameter("%s"),Parameter("%s"), Parameter("%s"),Parameter("%s"), Parameter("%s"))
        
        query_data = [partnership_inquiry_id,user_id,partnership_inquiry_type,partnership_inquiry_title,
        partnership_inquiry_contents,partnership_inquiry_proposal,partnership_inquiry_company_classification,
        partnership_inquiry_company_name,partnership_inquiry_company_number,partnership_inquiry_company_email,
        partnership_inquiry_company_website_url,partnership_inquiry_company_introduction]
        
        DatabaseMgr.updateWithConnect(connect, query, query_data)
        
        _id = connect.insert_id()
        
        return _id    
        
    @classmethod
    def updateWith(cls, connect, partnership_inquiry_id,partnership_inquiry_type,partnership_inquiry_title,
        partnership_inquiry_contents,partnership_inquiry_proposal,partnership_inquiry_company_classification,
        partnership_inquiry_company_name,partnership_inquiry_company_number,partnership_inquiry_company_email,
        partnership_inquiry_company_website_url,partnership_inquiry_company_introduction) -> int:  
        
        table = Table("partnership_inquiry")
        query = Query.update(table).set(
            "partnership_inquiry_type",  Parameter("%s")
        ).set(
            "partnership_inquiry_title", Parameter("%s")
        ).set(
            "partnership_inquiry_contents", Parameter("%s")
        ).set(
            "partnership_inquiry_proposal", Parameter("%s")
        ).set(
            "partnership_inquiry_company_classification", Parameter("%s")
        ).set(
            "partnership_inquiry_company_name", Parameter("%s")
        ).set(
            "partnership_inquiry_company_number", Parameter("%s")
        ).set(
            "partnership_inquiry_company_email", Parameter("%s")
        ).set(
            "partnership_inquiry_company_website_url", Parameter("%s")
        ).set(
            "partnership_inquiry_company_introduction", Parameter("%s")
        ).set(
            "updated", fn.Now()
        ).where(
            table.partnership_inquiry_id==partnership_inquiry_id
        )
                            
        query_data = [partnership_inquiry_type,partnership_inquiry_title,
        partnership_inquiry_contents,partnership_inquiry_proposal,partnership_inquiry_company_classification,
        partnership_inquiry_company_name,partnership_inquiry_company_number,partnership_inquiry_company_email,
        partnership_inquiry_company_website_url,partnership_inquiry_company_introduction]
        
        count = DatabaseMgr.updateWithConnect(connect, query, query_data)

        return partnership_inquiry_id        
        