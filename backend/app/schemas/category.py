from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    tamil_name: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=300)
    image_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    tamil_name: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=300)
    image_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)