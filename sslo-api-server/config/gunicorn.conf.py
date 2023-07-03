from doctest import FAIL_FAST
from genericpath import exists
import multiprocessing
import time

workers = 1
threads = multiprocessing.cpu_count() * 2 + 1


bind = '0.0.0.0:8829'
timeout = 60 * 60   # 단위는 초, 1분 = 60

errorlog = 'logs/error.log'
accesslog = 'logs/access.log'
capture_output = True
loglevel='debug'

MODE='PRODUCTION'

def on_starting(server):
    server.log.info("Starting time: %s ms" % int(time.time() * 1000))

def on_exit(server):
    server.log.info("Exit time: %s ms" % int(time.time() * 1000))