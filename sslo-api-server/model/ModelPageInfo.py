from .Base import ModelBase

import config


class PageInfo(ModelBase):
    """
    ### PageInfo

 - 리스트 조회시 pageinfo

| name | type | length | desc |
| --- | --- | --- | --- |
| startAt | integer |  | 요청한 offset |
| currentResults | integer |  | 현재 조회된 item 개수 |
| hasNext | boolean |  | 조회 요소가 남아 있는지 여부 |
| maxResults | integer |  | 요청한 maxResults |
| totalCount | integer |  | 전체 개수 |
    """
    
    
    
    def __init__(self, startAt:int=0, currentResults:int=0, totalResults:int=0, hasNext = False, maxResults:int=config.DEFAULT_PAGE_LIMIT):        
        self.startAt = startAt
        self.currentResults = currentResults
        self.totalResults = totalResults  
        self.hasNext = hasNext
        self.maxResults = maxResults 

    @property
    def _startAt(self) -> int:
        return self.startAt
    @_startAt.setter
    def _startAt(self, startAt:int) -> None:
        if startAt is None:            
            self.startAt = 0
        else:            
            self.startAt = startAt
        
    @property
    def _currentResults(self) -> int:
        return self.currentResults
    @_currentResults.setter
    def _currentResults(self, currentResults:int) -> None:
        if currentResults is None:            
            self.currentResults = 0
        else:            
            self.currentResults = currentResults
    
    
    @property
    def _totalResults(self) -> int:
        return self.totalResults
    @_totalResults.setter
    def _totalResults(self, totalResults:int) -> None:
        if totalResults is None:            
            self.totalResults = 0
        else:            
            self.totalResults = totalResults
    
    @property
    def _hasNext(self) -> bool:
        return self.hasNext
    @_hasNext.setter
    def _hasNext(self, hasNext:bool):
        self.hasNext = hasNext
        
    @property
    def _maxResults(self) -> int:
        return self.maxResults
    @_maxResults.setter
    def _maxResults(self, maxResults:int):
        if maxResults is None:
            self.maxResults = config.DEFAULT_PAGE_LIMIT
        else:
            self.maxResults = maxResults
    