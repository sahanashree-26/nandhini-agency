from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductImageBase(BaseModel):
    image_url: str = Field(min_length=1, max_length=500)
    display_order: int = Field(default=1, ge=1)


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageResponse(ProductImageBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductVariantBase(BaseModel):
    colour: str = Field(min_length=1, max_length=50)
    size: str = Field(min_length=1, max_length=50)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    sku: str | None = Field(default=None, max_length=100)


class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantResponse(ProductVariantBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    category_id: int = Field(gt=0)
    name: str = Field(min_length=2, max_length=150)
    tamil_name: str | None = Field(default=None, max_length=150)
    description: str | None = None
    brand: str | None = Field(default=None, max_length=100)
    material: str | None = Field(default=None, max_length=100)
    is_active: bool = True


class ProductCreate(ProductBase):
    images: list[ProductImageCreate] = Field(min_length=1)
    variants: list[ProductVariantCreate] = Field(min_length=1)


class ProductUpdate(BaseModel):
    category_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=2, max_length=150)
    tamil_name: str | None = Field(default=None, max_length=150)
    description: str | None = None
    brand: str | None = Field(default=None, max_length=100)
    material: str | None = Field(default=None, max_length=100)
    is_active: bool | None = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: list[ProductImageResponse]
    variants: list[ProductVariantResponse]

    model_config = ConfigDict(from_attributes=True)