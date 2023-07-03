from datetime import timedelta
import secrets

class Config(object):
    TESTING = False
    DEBUG=False
    PASS_LOGIN_REQUIRED = False
    
    HOST="0.0.0.0"
    PORT=8859     
    DATABASE = {
        "user" : "sslo_user", 
        "password" : "tbell0518", 
        "host" : "localhost",
        "port" : 1306, 
        "db" : "sslo_db", 
        "charset" : "utf8mb4"
    }
    
    AI_BASE_URL = "http://192.168.0.3:8838"
    CRAWLING_BASE_URL = "http://192.168.0.3:8831"
            
    # jwt  
    JWT_SECRET_KEY=secrets.token_hex(16) + "sslo"
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=8)
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=30)
    JWT_COOKIE_CSRF_PROTECT=False
    
    # cors
    CORS_RESOURCES={r"*": {"origins": ["*"]}}
    
    # 
    JSON_AS_ASCII=False

    # data dir            
    BASE_DIR="../sslo-data"
    AI_BASE_DIR="../sslo-data-ai"

    #email account
    SSLO_EMAIL_ADDR = "tbell.sslo.ai@gmail.com"
    SSLO_EMAIL_PSWD = "ggknsqxbetudkfoo"
    
    #register page URL
    SSLO_HOME_URL = "http://sslo.ai"
    SSLO_REGISTER_URL = SSLO_HOME_URL+"/signup"

    # naver social login config
    NAVER_CLIENT_ID = "KCYwwc3glcbSt6RX0FiB"
    NAVER_CLIENT_SECRET = 'sKdfdMH0at'
    NAVER_AUTHORIZATION_BASE_URL = 'https://nid.naver.com/oauth2.0/authorize'
    NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token'
    NAVER_REDIRECT_URI = 'http://210.113.122.196:8829/rest/api/1/auth/social/naver/callback'

    #kakao social login config
    KAKAO_CLIENT_ID = "1e7c360ba53c6ab9846e4d2bb9a88032"
    KAKAO_CLIENT_SECRET = "aN31VIp7OrqWwWdrPETEKlOo2xVJVueh"
    KAKAO_REDIRECT_URI = "http://210.113.122.196:8829/rest/api/1/auth/social/kakao/callback"

    #google social login config
    GOOGLE_CLIENT_ID = "103076304765-nsp967ds5vi6a34gbrqfb9g3uf8hn1j2.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "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"
    GOOGLE_REDIRECT_URI = "http://sslo.ai/rest/api/1/auth/social/google/callback"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
    GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

    # predefined ai model name list
    MODEL_NAME_PREDEFINED = [
        "R_50_C4_1x",
        "R_50_C4_3x",
        "R_50_DC5_1x",
        "R_50_DC5_3x",
        "R_50_FPN_1x",
        "R_50_FPN_3x",
        "R_101_C4_3x",
        "R_101_DC5_3x",
        "R_101_FPN_3x",
        "X_101_32x8d_FPN_3x"
        ]