from celery import Celery
from .app import generate_t2v, generate_i2v

celery = Celery('tasks', broker='redis://localhost:6379')