from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, Integer, String
from src.utils.db import Base

class TaskModel(Base):
    __tablename__ = "user_tasks"
    __table_args__ = (
        CheckConstraint(
            "priority IN ('most_important', 'important', 'normal', 'regular')",
            name="ck_user_tasks_priority",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    is_completed = Column(Boolean, default=False)
    priority = Column(String(32), nullable=False, default="regular", server_default="regular")

    user_id = Column(Integer, ForeignKey("users_table.id", ondelete="CASCADE"))