from src.tasks.dtos import TaskSchema

def create_task(body: TaskSchema):
    print(body.model_dump())
    return {"status": "Task Created Successfully"}