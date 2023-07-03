from .Config import Config

class TestingConfig(Config): 
                                                       
    TESTING=True  
    DEBUG=True
    
    HOST="0.0.0.0"
    PORT=8828  
    
    DATABASE = {
        "user" : "sslo_user", 
        "password" : "tbell0518", 
        "host" : "localhost",
        "port" : 1306, 
        "db" : "sslo_db", 
        "charset" : "utf8mb4"
    }
        
    # cors
    CORS_RESOURCES={r"*": {"origins": ["*"]}}
    
    # 
    JSON_AS_ASCII=False

    # data dir            
    BASE_DIR="../sslo-data-ai"
    AI_BASE_DIR="../sslo-data-ai"
    
    # gpu server adress
    GPU_SERVER_1 = "192.168.0.2" 
    GPU_SERVER_2 = "192.168.0.3"
    
    # ai core dir
    AI_CORE_DIR = "/solution_ai_model"

    # trained ai model repository
    AI_TRAINED_MODEL_REPO = AI_CORE_DIR +"/models_trained"

    # servable ai model repository
    AI_SERVABLE_MODEL_REPO = AI_CORE_DIR +"/models_servable"
    
    