from pydantic import BaseModel, ConfigDict
from typing import Literal

TaskPriority = Literal["most_important", "important", "normal", "regular"]

class TaskSchema(BaseModel):
    
    title : str
    description: str 
    is_completed: bool = False
    priority: TaskPriority = "regular"

class TaskResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title : str
    description: str 
    is_completed: bool
    priority: TaskPriority
    user_id: int | None = 0