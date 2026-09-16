from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories import category_repository, product_repository
from app.schemas.product import ProductCreate, ProductUpdate


def create_product(
    db: Session,
    product_data: ProductCreate,
) -> Product:
    category = category_repository.get_category_by_id(
        db,
        product_data.category_id,
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    existing_product = product_repository.get_product_by_name(
        db,
        product_data.name,
    )

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A product with this name already exists.",
        )

    if not product_data.images:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one product image is required.",
        )

    if not product_data.variants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one product variant is required.",
        )

    sku_values = [
        variant.sku
        for variant in product_data.variants
        if variant.sku
    ]

    if len(sku_values) != len(set(sku_values)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate SKU values are not allowed.",
        )

    for sku in sku_values:
        existing_variant = product_repository.get_variant_by_sku(
            db,
            sku,
        )

        if existing_variant:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{sku}' already exists.",
            )

    return product_repository.create_product(
        db,
        product_data,
    )


def get_all_products(db: Session) -> list[Product]:
    return product_repository.get_all_products(db)


def get_product_by_id(
    db: Session,
    product_id: int,
) -> Product:
    product = product_repository.get_product_by_id(
        db,
        product_id,
    )

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return product


def update_product(
    db: Session,
    product_id: int,
    product_data: ProductUpdate,
) -> Product:
    product = get_product_by_id(db, product_id)

    if product_data.category_id is not None:
        category = category_repository.get_category_by_id(
            db,
            product_data.category_id,
        )

        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

    if (
        product_data.name is not None
        and product_data.name != product.name
    ):
        existing_product = product_repository.get_product_by_name(
            db,
            product_data.name,
        )

        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A product with this name already exists.",
            )

    return product_repository.update_product(
        db,
        product,
        product_data,
    )


def delete_product(
    db: Session,
    product_id: int,
) -> None:
    product = get_product_by_id(db, product_id)

    product_repository.delete_product(
        db,
        product,
    )