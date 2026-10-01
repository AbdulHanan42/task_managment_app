from pydantic import BaseModel, ConfigDict, Field, field_validator

class UserSchema(BaseModel):
    name: str
    username: str
    password: str
    email: str

class UserResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    username: str
    email: str
    id: int

class LoginSchema(BaseModel):
    username: str
    password: str


class UserUpdateSchema(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    username: str | None = Field(default=None, min_length=1)
    email: str | None = Field(default=None, min_length=1)

    @field_validator("name", "username", "email")
    @classmethod
    def reject_blank_values(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("This field cannot be blank")
        return value.strip() if value is not None else None