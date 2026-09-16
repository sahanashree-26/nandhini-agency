from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from app.database.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    tamil_name = Column(String(100), nullable=True)
    description = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )