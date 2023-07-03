
# Mysql Replication

## MASTER

1.my.cnf(설정값)

```mysql.cnf
# replication - master
server-id=1
log-bin=mysql-bin
replicate-do-db='sslo_db'
max_allowed_packet=1000M
sync_binlog = 1
expire-logs-days= 7
```

2.Replication계정 생성

```mysql
DROP USER IF EXISTS 'repl';
CREATE USER 'repl'@'%' IDENTIFIED BY 'tbell0518' PASSWORD EXPIRE NEVER;
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
```

flush privileges;

3.마스터 로그 리셋

```mysql
RESET MASTER;
```

4.마스터 테이블 락

```mysql
FLUSH TABLES WITH READ LOCK;
```

5.마스터 상태 확인

```mysql
SHOW MASTER STATUS;
```

```bash
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000001 |      157 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.01 sec)
```

6.DB 백업

```bash
mkdir -p backup
mysqldump -h 0.0.0.0 -P 1306 -u root -p sslo_db > backup/master.sql
```

7.백업완료 후 테이블 락 해제

```bash
# mysqldump -h 0.0.0.0 -P 1306 -u root -p sslo_db -e "UNLOCK TABLES;"
```

## Slave

1.my.cnf(설정)

```mysql.cnf
# replication - slave
server-id=2
log-bin=mysql-bin
replicate-do-db='sslo_db'
max_allowed_packet=1000M
sync_binlog = 1
expire-logs-days= 7
read_only = 1
```

2.데이블 생성 및 백업 복원 (master.sql)

```bash
mysql -h 0.0.0.0 -P 2306 -uroot -p -e "CREATE DATABASE sslo_db;"
mysqldump -h 0.0.0.0 -P 2306 -uroot -p sslo_db < backup/master.sql
```

```mysql
CREATE DATABASE sslo_db;
use sslo_db;
source backup/master.sql;
```

3.Master에 연결

```mysql
RESET SLAVE;
CHANGE MASTER TO
MASTER_HOST='db-server-1',
MASTER_PORT=3306,
MASTER_USER='repl',
MASTER_PASSWORD='tbell0518',
MASTER_LOG_FILE='mysql-bin.000001', 
MASTER_LOG_POS=157;
```

4.Slave 시작

```mysql
START REPLICA;
```

5.Slave 상태 확인

```mysql
SHOW SLAVE STATUS\G;
```

Slave_SQL_Running_State 상태 체크

```bash
mysql> show slave status\G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for source to send event
                  Master_Host: db-server-1
                  Master_User: repl
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 7119
               Relay_Log_File: 1b5f1ac164e6-relay-bin.000002
                Relay_Log_Pos: 7288
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB: sslo_db
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 7119
              Relay_Log_Space: 7505
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 6f4c99ea-388f-11ed-9ac4-0242ac140003
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set:
            Executed_Gtid_Set:
                Auto_Position: 0
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
       Master_public_key_path:
        Get_master_public_key: 0
            Network_Namespace:
1 row in set, 1 warning (0.02 sec)
```
