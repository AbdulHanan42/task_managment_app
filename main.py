from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.db import Base , engine
from src.utils.settings import settings
from src.tasks.models import TaskModel
from src.tasks.router import task_routes
from src.user.router import user_routes

Base.metadata.create_all(engine)


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.CORS_ORIGINS,
	allow_credentials=False,
	allow_methods=["*"],
	allow_headers=["*"],
)
app.include_router(task_routes)
app.include_router(user_routes)