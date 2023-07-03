import logging
import logging.config


# logging
logging.config.fileConfig('config/logging.conf')
logger = logging.getLogger('root')
logger_sql = logging.getLogger('sql')