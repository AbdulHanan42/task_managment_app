from fastapi import APIRouter, Depends, status, Request,BackgroundTasks
from sqlalchemy.orm import Session
from src.utils.db import get_db
from src.utils.helpers import is_authenticated
from src.user.dtos import UserSchema, UserResponseSchema, LoginSchema, UserUpdateSchema
from src.user.models import UserModel
from src.user import controller

user_routes = APIRouter(prefix="/user")

@user_routes.post("/register", response_model= UserResponseSchema, status_code = status.HTTP_201_CREATED)
async def register_user(body:UserSchema,bg_task: BackgroundTasks, db:Session = Depends(get_db)):
    return await controller.register(body,bg_task, db)

@user_routes.post("/login", status_code = status.HTTP_200_OK)
def login(body: LoginSchema, db:Session = Depends(get_db)):
    return controller.login_user(body, db)

@user_routes.get("/is_auth", status_code=status.HTTP_200_OK, response_model=UserResponseSchema)
def is_auth(request:Request, db:Session = Depends(get_db)):
    return controller.is_authenticated(request, db)


@user_routes.patch("/profile", response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def update_profile(
    body: UserUpdateSchema,
    db: Session = Depends(get_db),
    user: UserModel = Depends(is_authenticated),
):
    return controller.update_profile(body, db, user)
