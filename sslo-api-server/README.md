# sslo-api-server

## 주석도구 - Pdoc

 [Pdoc](https://pypi.org/project/pdoc3/)  선정 이유

```bash
- 적용이 매우 간단 (가장 주요한 선택 이유)
  기준 프로젝트에도 추가적인 코드 없이도 쉽게 문서 생성 가능

- markdown 사용가능
 주석에 markdown이 사용가능해서 쉽게 문서 형식화 가능

- 내용을 메뉴얼로 작성해야 하지만 swagger 스키마 작성보다는 편하다고 판단
```

### 사용

```bash
pip install pdoc

# project로 이동 후 
pdoc -h 0.0.0.0 -p 8886 api model
```

다른 설정 및 사용법

- `pdoc --help` 또는 [https://pdoc.dev/](https://pdoc.dev/)

## API Server - 환경

환경 구성 - Database
docker-compose 1.25 이상
config/makeEnv 확인

```bash
cd config/makeEnv
mkdir -p mysql_master_data
mkdir -p mysql_slave_data

docker-compose -f docker-mysql.yml up -d

docker exec -i db-server-1 mysql -uroot -p'tbell05' < createSSLODatabaseUser.sql
docker exec -i db-server-1 mysql -uroot -p'tbell05' sslo_db  < createSSLOTables.sql
docker exec -i db-server-1 mysql -uroot -p'tbell05' sslo_db  < createTestUsers.sql

```

```bash
python 3.10

python package

  flask 
  flask_cors
  flask_jwt_extended
  pdoc
  bcrypt
  inject
  Pillow
  pymysql
  cryptography
  pypika
  pandas
  numpy
  requests
  gunicorn
```

패키지 설치

```bash
pip install -r requirements.txt
mkdir -p ../sslo-data
mkdir -p logs

```

### 서버 실행

**테스트 버전**
config/TestingConfig

```bash
MODE='TESTING' FLASK_RUN_PORT=8829 python app.py
```

또는

(ulimit는 이미지나 task 최대 수에 따라서 조정한다)

workers 는 반드시 1로 지정하고 thread수는 적당히 조정한다

```bash
ulimit -n 65535
gunicorn --bind 0.0.0.0:8829 --reload --workers=1 --threads=8 --env MODE='TESTING' app:app 
```

**프로덕션 버전**
config/ProductionConfig

openfile 개수설정
(/etc/security/limit.conf)

soft 및 hard를 (nofile, nproc) MAX_IMAGE_COUNT (config) 이상으로 설정

```bash
# example
tbelldev        soft    nofile  65535
tbelldev        hard    nofile  65535
tbelldev        soft    nproc   65535
tbelldev        hard    nproc   65535
```

```bash
gunicorn app:app &
```

또는 nginx와 함께

```bash
gunicorn --bind unix:/tmp/gunicorn_sslo_api.sock app:app &

```

ngix 설정시

```shell
http {
    server {
        ...

        location / {
            ...
            proxy_pass http://unix:/tmp/gunicorn_sslo_api.sock;
            ...
        }
    }
}


```

## Config

### MODE

| name | source |  desc |
| --- | --- | --- |
| TESTING | config.TestingConfig |  | 테스트 모드  |
| PRODUCTION | config.ProductionConfig |  | 일반 모드  |

#### Config Values

| name |  default/sub name | desc | example |
| --- | --- | --- | --- |
| **TESTING** | True | 테스트 환경 |  TESTING=True |
| **DEBUG** | True | 디버그 | DEBUG=True  |
| **PASS_LOGIN_REQUIRED** | True | 인증(로그인) login_require 무시 | PASS_LOGIN_REQUIRED=True  |
||  ||
| **HOST** | "0.0.0.0" | 서버 대기 host | HOST="0.0.0.0"  |
| **PORT** | 8829 | 서버 대기 port | PORT=8829  |
||  ||
| **DATABASE** |  | 데이터베이스 접속 정보 | {        "user" : "sslo_user",         "password" : tbell0518",         "host" : "localhost",        "port" : 1306,         "db" : "sslo_db",         "charset" : "utf8mb4"    }  |
| **AI** |  ||
||  ||
| **AI_BASE_URL** |  | ai 접속 URL |  "http://sslo.ai:8858"  |
|**JWT** |  ||
||  ||
| **JWT_SECRET_KEY** | secrets.token_hex(16) + "sslo" | 인증키 | JWT_SECRET_KEY=secrets.token_hex(16) + "sslo"  |
| **JWT_ACCESS_TOKEN_EXPIRES** | 120 | 인증 토큰의 유효시간 - 초 | JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=60)  |
| **JWT_REFRESH_TOKEN_EXPIRES** | 1800 | 갱신 토큰의 유효시간 - 초 | JWT_REFRESH_TOKEN_EXPIRES=timedelta(hours=8)  |
||  ||
| **CORS_RESOURCES** | {r"*": {"origins": "*"}} | CORS 설정 | CORS_RESOURCES={r"*": {"origins": "*"}}  |
||  ||
||  ||
| **JSON_AS_ASCII** | False | 서버 한글 설정 - False일 경우 한글 가능 | JSON_AS_ASCII=False  |
||  ||
| **BASE_DIR** | "../sslo-data" | Data Dir (상태경로 - 서버 아래의 경로) | BASE_DIR="../sslo-data"  |
||  ||
| **Cache** |  |  |   |
||  ||
| **isUseCache** | True | cache 사용 여부 |   |
| **isExpireCache** | True | cache expire 옵션 사용 여부 |   |
| **LIMIT_EXPIRE_CACHE** | timedelta(minutes=60) | cache expire 옵션 True로 설정시 cache 최대 유지 시간 |   |
| **export** |  |  |   |
||  ||
| **MAX_EXPORT_TASK_COUNT** | 5 | export 할 수 있는 최대 개수 |   |
| **annotation** |  |  |   |
| **ANNOTATION_FILENAME** | "annotation.json" | annnotation json 파일명 |   |
| **ANNOTATION_DATA_DIR** | "images" | ANNOTATION_FILENAME 파일에서 이미지가 저장되는 경로 - 현재는 export했을 때만 사용  |   |
||  ||
| **MAX_WAIT_FOR_WORK** | timedelta(minutes=10) | 작업 최대 대기시간(timeout) | timedelta(minutes=10)  |
