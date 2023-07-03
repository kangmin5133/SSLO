import logging
import logging.config


# logging
logging.config.fileConfig('config/logging.conf')
logger = logging.getLogger('root')
logger_test = logging.getLogger('test')
logger_sql = logging.getLogger('sql')


from flask import has_request_context, request
from flask.logging import default_handler as sslo_handler
class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = ""
            record.remote_addr = ""

        return super().format(record)
    
formatter = RequestFormatter(
    '%(asctime)s [%(remote_addr)s] %(filename)s[%(lineno)d]: %(message)s'
)

for h in logger.handlers:
    h.setFormatter(formatter)
