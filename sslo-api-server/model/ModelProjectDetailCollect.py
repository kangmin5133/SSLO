from datetime import datetime

from exception import ArgsException
from .ModelProjectDetail import ProjectDetail
from service.database import DatabaseMgr, Query, Table, Field, Parameter, Criterion, Case
import config
import utils
from config.SSLOEnums import DataTypes



class ProjectDetailCollect(ProjectDetail):
    """
    ### ProjectDetailCollect

 - 프로젝트 유형 - 수집

| name | type | length | desc |
| --- | --- | --- | --- |
| data_type | integer |  | 데이터 유형 - 1:자체 제공 데이터셋, 2:크롤링 수집 데이터, 3:보유 데이터|
| dataset_ids | integer[] |  | 데이터셋 id 리스트 |
| crawling_channel_type | string |  | 크롤링 수집 채널 - naver, daum, google |
| crawling_keywords | string[] |  | 크롤링 키워드  |
| crawling_period_type | integer |  | 크롤링 기간 - 1:직접입력, 2: 일주일, 3:3개월, 4:1년 |
| crawling_period_start | integer |  | 크롤링 기간 직접입력시 시작일 |
| crawling_period_end | integer |  | 크롤링 기간 직접입력시 종료일 |
| crawling_limit | integer |  | 크롤링 최대 개수 |
    """
    
    def __init__(self, data_type, dataset_ids=None, crawling_channel_type=None, crawling_keywords=None, crawling_period_type=None, crawling_period_start=None, crawling_period_end=None, crawling_limit=None):
        
        #         
        print(f" data_type : {data_type}")
        self.data_type = DataTypes(int(data_type))
        
        
        print(f"-----> dataset_ids : {dataset_ids}" )
        print(f"-----> isinstance(dataset_ids, str) : {isinstance(dataset_ids, str)}" )
        
        if isinstance(dataset_ids, str) :
            dataset_ids = list(map(int, dataset_ids.split(",")))
            
        self.dataset_ids = dataset_ids
        
        print(f"-----> self.dataset_ids : {self.dataset_ids}" )
        self.crawling_channel_type = crawling_channel_type
        
        if isinstance(crawling_keywords, str) :
            crawling_keywords = list(map(str, crawling_keywords.split(config.SEPARATOR_CRAWLING_KEYWORD)))
            
        self.crawling_keywords = crawling_keywords        
        self.crawling_period_type = crawling_period_type
        
        if isinstance(crawling_period_start, datetime):
            crawling_period_start = utils.toMillisecondFrom(crawling_period_start)
        self.crawling_period_start = crawling_period_start        
        
        if isinstance(crawling_period_end, datetime):
            crawling_period_end = utils.toMillisecondFrom(crawling_period_end)
        self.crawling_period_end = crawling_period_end
        
        self.crawling_limit = crawling_limit                
    
    @property
    def _data_type(self) -> DataTypes:
        return self.data_type
    @_data_type.setter
    def _data_type(self, data_type) -> None:
        self.data_type = DataTypes(data_type)
        
    @property
    def _dataset_ids(self):
        return self.dataset_ids
    @_dataset_ids.setter
    def _dataset_ids(self, dataset_ids) -> None:
        self.dataset_ids = dataset_ids
        
    @property
    def _crawling_channel_type(self):
        return self.crawling_channel_type
    @_crawling_channel_type.setter
    def _crawling_channel_type(self, crawling_channel_type) -> None:
        self.crawling_channel_type = crawling_channel_type  
        
    @property
    def _crawling_period_type(self):
        return self.crawling_period_type
    @_crawling_period_type.setter
    def _crawling_period_type(self, crawling_period_type) -> None:
        self.crawling_period_type = crawling_period_type   
    
    @property
    def _crawling_keywords(self):
        return self.crawling_keywords
    @_crawling_keywords.setter
    def _crawling_keywords(self, crawling_keywords) -> None:
        self.crawling_keywords = crawling_keywords
                            
    @property
    def _crawling_period_start(self):
        return self.crawling_period_start
    @_crawling_period_start.setter
    def _crawling_period_start(self, crawling_period_start) -> None:
        self.crawling_period_start = crawling_period_start              

    @property
    def _crawling_period_end(self):
        return self.crawling_period_end
    @_crawling_period_end.setter
    def _crawling_period_end(self, crawling_period_end) -> None:
        self.crawling_period_end = crawling_period_end
        
    @property
    def _crawling_limit(self):
        return self.crawling_limit
    @_crawling_limit.setter
    def _crawling_limit(self, crawling_limit) -> None:
        self.crawling_limit = crawling_limit
                   
    
    def afterInsert(self, connect, project_id, project_type_id):
                        
        
        pass
    
        
    def insertWith(self, connect, project_id, project_type_id) -> int:
                                
        table = Table("project_detail")                        
        query =  Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val", "item_val_int", "item_val_datetime").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s'), Parameter('%s'),Parameter('%s')
                )
        
        query_datas = []
        
        # data_type
        query_data = [project_id, project_type_id, 'data_type', None, self.data_type.value, None ]
        query_datas.append(query_data)
        
        # data_type -  자체 제공 데이터셋         
        if self.data_type == DataTypes.SelfSupplied:                        
            
            # validate dataset ids
            if self.dataset_ids == None or len(self.dataset_ids) == 0:
                raise ArgsException("dataset is missing")
            
            dataset_ids = self.dataset_ids if isinstance(self.dataset_ids, list) == False else ','.join(map(str, self.dataset_ids))

                                
            query_dataset = f"SELECT count(*) as count FROM dataset ds WHERE ds.dataset_id in ({dataset_ids}) "   
            result = DatabaseMgr.selectOneWithConnect(connect, query_dataset)
            
            print(f"""len(self.dataset_ids) : {len(self.dataset_ids)}, result.get("count") : {result.get("count")} """)
            
            if len(self.dataset_ids) != result.get("count"):
                raise ArgsException("You specified a dataset that does not exist.")
            
            # 
            query_data = [project_id, project_type_id, 'dataset_ids', dataset_ids, None, None ]
            query_datas.append(query_data)
            
        # data_type - crawling
        elif self.data_type == DataTypes.Crawling:
            # crawling_channel_type
  
            query_data = [project_id, project_type_id, 'crawling_channel_type', self.crawling_channel_type, None, None ]            
            query_datas.append(query_data)
            
            # crawling_keywords
            if isinstance(self.crawling_keywords, list):
                query_data = [project_id, project_type_id, 'crawling_keywords', config.SEPARATOR_CRAWLING_KEYWORD.join(map(str, self.crawling_keywords)), None, None ]
            else: 
                query_data = [project_id, project_type_id, 'crawling_keywords', self.crawling_keywords, None, None ]
            query_datas.append(query_data)
            
            # crawling_period_type
            query_data = [project_id, project_type_id, 'crawling_period_type', None, self.crawling_period_type, None ]
            query_datas.append(query_data)
            
            if self.crawling_period_type == 1:
                # crawling_period_start
                query_data = [project_id, project_type_id, 'crawling_period_start', None, None, utils.toDateTimeFrom(self.crawling_period_start) ]
                query_datas.append(query_data)
                
                # crawling_period_end
                query_data = [project_id, project_type_id, 'crawling_period_end', None, None, utils.toDateTimeFrom(self.crawling_period_end) ]
                query_datas.append(query_data)                        
            
            # crawling_limit            
            query_data = [project_id, project_type_id, 'crawling_limit', None, self.crawling_limit, None ]
            query_datas.append(query_data)            
        
                                
        return DatabaseMgr.updateManyWithConnect(connect, query=query, dataList=query_datas)
        
    def make_query_insert(self, project_id, project_type_id) -> tuple:
        queryList = []
        queryDataList = []
        
        # data_type
        query_project_detail =  Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val_int").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )                        
        query_project_detail_data = [project_id, project_type_id, 'data_type', self.data_type.value ]
        
        
        queryList.append(query_project_detail)
        queryDataList.append(query_project_detail_data)
        
        table = Table("project_detail")
        
        # data_type -  1:자체 제공 데이터셋         
        if self.data_type == DataTypes.SelfSupplied:
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                ) 
                                    
            if isinstance(self.dataset_ids, list):                
                data = [project_id, project_type_id, 'dataset_ids', ','.join(map(str, self.dataset_ids)) ]
            else:
                data = [project_id, project_type_id, 'dataset_ids', self.dataset_ids ]
            
            queryList.append(query)
            queryDataList.append(data)
            
        if self.data_type == DataTypes.Crawling:
            # crawling_channel_type
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )    
            data = [project_id, project_type_id, 'crawling_channel_type', self.crawling_channel_type ]
            
            queryList.append(query)
            queryDataList.append(data)
            
            # crawling_keywords
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )    
            data = [project_id, project_type_id, 'crawling_keywords', self.crawling_keywords ]
            
            queryList.append(query)
            queryDataList.append(data)
            
            # crawling_period_type
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val_int").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )    
            data = [project_id, project_type_id, 'crawling_period_type', self.crawling_period_type ]
            
            queryList.append(query)
            queryDataList.append(data)
            
            # crawling_period_start
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val_int").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )    
            data = [project_id, project_type_id, 'crawling_period_start', utils.toDateTimeFrom(self.crawling_period_start) ]
            
            queryList.append(query)
            queryDataList.append(data)
            
            # crawling_period_end
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val_int").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )    
            data = [project_id, project_type_id, 'crawling_period_end', utils.toDateTimeFrom(self.crawling_period_end) ]
            
            queryList.append(query)
            queryDataList.append(data)
            
            # crawling_limit
            query = Query.into(table).columns("project_id", "project_type_id", "item_name", "item_val_int").select(
                Parameter('%s'), Parameter('%s'), Parameter('%s'),Parameter('%s')
                )    
            data = [project_id, project_type_id, 'crawling_limit', self.crawling_limit ]
            
            queryList.append(query)
            queryDataList.append(data)
            
        return queryList, queryDataList