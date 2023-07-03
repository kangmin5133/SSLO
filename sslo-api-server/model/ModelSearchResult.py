from .Base import ModelBase
from .ModelPageInfo import PageInfo

import config

class SearchResult(ModelBase):
    """
    ### SearchResult

 - 리스트 조회시 pageinfo를 포함

| name | type | length | desc |
| --- | --- | --- | --- |
| datas |  |  | data list |
| pageinfo | <PageInfo> |  | 페이지 정보 |
    """
    
    def __init__(self, datas, pageinfo = PageInfo() ):         
        self.datas = datas
        self.pageinfo = PageInfo.createFrom(pageinfo)
    
    
    @property
    def _pageinfo(self):
        return self.pageinfo
    @_pageinfo.setter
    def _user_name(self, pageinfo) -> None:
        self.pageinfo = pageinfo
        
    @property
    def _datas(self):
        return self.datas
    @_datas.setter
    def _datas(self, datas) -> None:
        self.datas = datas                    
    
    
    @classmethod
    def create(cls, datas:list, startAt:int=0, totalResults:int=0, maxResults:int=config.DEFAULT_PAGE_LIMIT ):
        
        pageinfo = PageInfo(startAt=startAt, hasNext=False, currentResults=0, totalResults=totalResults, maxResults=maxResults)            
        if datas is not None:
            pageinfo._currentResults = len(datas)    
            
        if pageinfo._currentResults > pageinfo._maxResults:
            pageinfo._currentResults -= 1
            pageinfo._hasNext = True
            datas = datas[:-1]
        
        return SearchResult(datas, pageinfo)
    
