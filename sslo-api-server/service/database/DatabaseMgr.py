from typing import Iterable
import pymysql
import json

import config
from log import logger_sql as logger





def openConnect() -> pymysql.Connection:
    info = config.getDatabaseInfo()
    return pymysql.connect( **info )

def openCursor(connect):    
    return connect.cursor(pymysql.cursors.DictCursor)  # type: ignore


def select(query, data=None) -> list:
    """_select_

    Args:
        query (_str_): _sql query for select_
        data (_object_): _data_

    Returns:
        list: _select results []_
    """
    
    info = config.getDatabaseInfo()        
    
    if isinstance(query, str) == False:
        query = str(query)
            
    logger.info(f" ---> query select : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ") 
        
    with pymysql.connect( **info ) as connect:    
        with connect.cursor(pymysql.cursors.DictCursor) as cursor:  # type: ignore
            cursor.execute(query, data)
            results = cursor.fetchall()
            logger.info(f" ---> query results : {results} ") 
            return results  # type: ignore
        
def selectOne(query, data=None) -> dict:
    """_select one_

    Args:
        query (_str_): _sql query for select_
        data (_object_): _data_

    Returns:
        tuple: _select result - row_
    """
    info = config.getDatabaseInfo()
    
    if isinstance(query, str) == False:
        query = str(query)
    
    logger.info(f" ---> query selectOne : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ") 
            
    with pymysql.connect( **info ) as connect:
    
        with connect.cursor(pymysql.cursors.DictCursor) as cursor:                  # type: ignore
            cursor.execute(query, data)
            result = cursor.fetchone()
            logger.info(f" ---> query result : {result} ") 
            return result  # type: ignore
            
def selectWithConnect(connect, query, data=None) -> list:
    """_select_

    Args:
        connect (_connect_): _cursor_
        query (_str_): _query query for select_
        data (_object_): _data_

    Returns:
        list: _select results []_
    """
    
    if isinstance(query, str) == False:
        query = str(query)
        
    logger.info(f" ---> query selectWithConnect : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ") 

    with connect.cursor(pymysql.cursors.DictCursor) as cursor:                  # type: ignore
        cursor.execute(query, data)
        result = cursor.fetchall()
        logger.info(f" ---> query result : {result} ") 
        return result

def selectOneWithConnect(connect, query, data=None):
    """_select_

    Args:
        connect (_connect_): _cursor_
        query (_str_): _sql query for select_
        data (_object_): _data_

    Returns:
        tuple|None: _select result - row_
    """
    
    if isinstance(query, str) == False:
        query = str(query)
        
    logger.info(f" ---> query selectOneWithConnect : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ") 
    
    with connect.cursor(pymysql.cursors.DictCursor) as cursor:                  # type: ignore
        cursor.execute(query, data)
        result = cursor.fetchone()
        logger.info(f" ---> query result : {result} ") 
        return result


def selectWithCursor(cursor, query, data=None) -> list:
    """_select_

    Args:
        cursor (_cursor_): _cursor_
        query (_str_): _query query for select_
        data (_object_): _data_

    Returns:
        list: _select results []_
    """
    
    if isinstance(query, str) == False:
        query = str(query)
        
    logger.info(f" ---> query selectWithCursor : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ") 

    result = cursor.execute(query, data)
    logger.info(f" ---> query result : {result} ") 
    return result

def selectOneWithCursor(cursor, query, data=None):
    """_select_

    Args:
        cursor (_cursor_): _cursor_
        query (_str_): _sql query for select_
        data (_object_): _data_

    Returns:
        tuple|None: _select result - row_
    """
    
    if isinstance(query, str) == False:
        query = str(query)
    
    logger.info(f" ---> query selectOneWithCursor : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ") 
    
    cursor.execute(query, data)
    result = cursor.fetchone()
    logger.info(f" ---> query result : {result} ") 
    return result
        

def updateWithCursor(cursor, query, data=None) -> int:
    """_query 후 commit 없이  리턴_
    Args:
        cursor (_type_): _description_
        query (_type_): _description_
        data (_type_, optional): _description_. Defaults to None.

    Returns:
        _result_: _query result_
    """
    
    if isinstance(query, str) == False:
        query = str(query)
    
    logger.info(f" ---> query update : {query} ") 
    if data is not None:
        logger.info(f"     data: {data} ")
    
    result = cursor.execute(query, data)
    logger.info(f" ---> query result : {result} ") 
    return result   

def updateWithConnect(connect, query, data=None) -> int:
    """_query 후 commit 없이  리턴_
    Args:
        cursor (_type_): _description_
        query (_type_): _description_
        data (_type_, optional): _description_. Defaults to None.

    Returns:
        _result_: _query result_
    """
    
    with openCursor(connect) as cursor:
        return updateWithCursor(cursor, query=query, data=data)        
                

def update(query, data=None) -> int:
    """_update or insert, delete, create, alter_
        commit 필요한 query 
        한번에 여러 데이터를 변경, 추가 할 때
    Args:
        query (_type_): _description_
        data (_type_): _description_    
     Returns:
        updated count
    """
    
    info = config.getDatabaseInfo()
    
    if isinstance(query, str) == False:
        query = str(query)
    
    logger.info(f" ---> query updateMany : {query} ") 
    logger.info(f"     data: {data} ") 
            
    with pymysql.connect( **info ) as connect:
    
        with connect.cursor(pymysql.cursors.DictCursor) as cursor:                  # type: ignore
            count = cursor.execute(query, data)             
        connect.commit()
    
    logger.info(f" ---> query result : {count} ") 
    return count

def updateMany(query, dataList:list) -> int:
    """_update or insert, delete, create, alter_
        commit 필요한 query 
        한번에 여러 데이터를 변경, 추가 할 때
    Args:
        query (_type_): _description_
        datas (list): _description_
    Exeample:
        update_datas = [
                        [1, 'a'],            
                        [2,  'b'],      
                        [3,  'c']
                    ]
                        
        update_query = "UPDATE user SET id=%s WHERE name=%s"                      
        updateMany(update_query, update_datas)
    """
    
    info = config.getDatabaseInfo()
    
    if isinstance(query, str) == False:
        query = str(query)
    
    logger.info(f" ---> query updateMany : {query} ") 
    logger.info(f"     data: {dataList} ") 
            
    with pymysql.connect( **info ) as connect:
    
        with connect.cursor(pymysql.cursors.DictCursor) as cursor:                  # type: ignore
            count = cursor.executemany(query, dataList)            
        connect.commit()
        
    logger.info(f" ---> query result : {count} ") 
    return count  # type: ignore

def updateManyWithConnect(connect, query, dataList:list) -> int:
    """_update or insert, delete, create, alter_
        commit 필요한 query 
        한번에 여러 데이터를 변경, 추가 할 때
    Args:
        connect (_type_): _description_
        query (_type_): _description_
        datas (list): _description_
    Exeample:
        update_datas = [
                        [1, 'a'],            
                        [2,  'b'],      
                        [3,  'c']
                    ]
                        
        update_query = "UPDATE user SET id=%s WHERE name=%s"                      
        updateMany(update_query, update_datas)
    """
        
    if isinstance(query, str) == False:
        query = str(query)
    
    logger.info(f" ---> query updateMany : {query} ") 
    logger.info(f"     data: {dataList} ") 

    with connect.cursor(pymysql.cursors.DictCursor) as cursor:                  # type: ignore
        count = cursor.executemany(query, dataList)            
     
    logger.info(f" ---> query result : {count} ")    
    return count
                
                
def updateMulti(queryList:list, dataList:list=[]) -> list:
    """_update or insert, delete, create, alter_
        commit 필요한 query
        여러개를 query를 한 트랜잭션으로 처리
    Args:
        queryList (_list_): _query query for change_
        dataList (_list_): _data_
    """
    
    info = config.getDatabaseInfo()
    
    queryList = list(map(str,queryList))
    logger.info(f" ---> queryList updateMulti : {queryList} ")     
    if dataList is not None:
        logger.info(f"     dataList: {dataList} ") 
    
    logger.info(f"--------> len(queryList) : {len(queryList)}")    
    logger.info(f"range(0, len_query) : {range(0, len(queryList))}")
    
    resultList = []
    with pymysql.connect( **info ) as connect:
    
        with connect.cursor(pymysql.cursors.DictCursor) as cursor:   # type: ignore
            
            len_query = len(queryList)
            len_data = len(dataList)
            
            for index in range(0, len_query):  
                query = queryList[index]
                data = None
                if index < len_data:
                    data = dataList[index]
                
                if isinstance(query, str) == False:
                    query = str(query)
                
                logger.info(f"-----> query : {query}")
                logger.info(f"-----> data : {data}")
                result = cursor.execute(query, data)
                resultList.append(result)
            
            connect.commit()
        
    logger.info(f" ---> query result : {resultList} ") 
    return resultList

def updateMultiWtihConnect(connect, queryList:list, dataList:list=[]) -> list:
    """_summary_

       _update or insert, delete, create, alter_
        no commit
        close cursor
    Args:
        connect (_type_): _description_
        queryList (_list_): _sql query for change_
        dataList (_list_): _data_

    Returns:
        list: _description_
    """
   
    queryList = list(map(str,queryList))
    logger.info(f" ---> queryList updateMulti : {queryList} ") 
    if dataList is not None:
        logger.info(f"     data: {dataList} ") 
    else:
        dataList = []
    
    logger.info(f"--------> len(queryList) : {len(queryList)}")    
    logger.info(f"range(0, len_query) : {range(0, len(queryList))}")
    resultList = []
    
    
    with connect.cursor(pymysql.cursors.DictCursor) as cursor:   # type: ignore
        
        len_query = len(queryList)
        len_data = len(dataList)
        
        for index in range(0, len_query):  
            query = queryList[index]
            data = None
            if index < len_data:
                data = dataList[index]
            
            if isinstance(query, str) == False:
                query = str(query)
            
            logger.info(f"-----> query : {query}")
            logger.info(f"-----> data : {data}")
            result = cursor.execute(query, data)
            resultList.append(result)
            
    logger.info(f" ---> query result : {resultList} ") 
    return resultList