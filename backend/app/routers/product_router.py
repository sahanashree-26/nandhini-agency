from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from app.services import product_service


router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
):
    return product_service.create_product(
        db,
        product_data,
    )


@router.get(
    "",
    response_model=list[ProductResponse],
)
def get_all_products(
    db: Session = Depends(get_db),
):
    return product_service.get_all_products(db)


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db),
):
    return product_service.get_product_by_id(
        db,
        product_id,
    )


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
):
    return product_service.update_product(
        db,
        product_id,
        product_data,
    )


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product_service.delete_product(
        db,
        product_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )