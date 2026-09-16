from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant
from app.schemas.product import ProductCreate, ProductUpdate


def create_product(
    db: Session,
    product_data: ProductCreate,
) -> Product:
    try:
        product = Product(
            category_id=product_data.category_id,
            name=product_data.name,
            tamil_name=product_data.tamil_name,
            description=product_data.description,
            brand=product_data.brand,
            material=product_data.material,
            is_active=product_data.is_active,
        )

        db.add(product)
        db.flush()

        for image_data in product_data.images:
            image = ProductImage(
                product_id=product.id,
                image_url=image_data.image_url,
                display_order=image_data.display_order,
            )
            db.add(image)

        for variant_data in product_data.variants:
            variant = ProductVariant(
                product_id=product.id,
                colour=variant_data.colour,
                size=variant_data.size,
                price=variant_data.price,
                stock=variant_data.stock,
                sku=variant_data.sku,
            )
            db.add(variant)

        db.commit()

        return get_product_by_id(db, product.id)

    except SQLAlchemyError:
        db.rollback()
        raise


def get_all_products(db: Session) -> list[Product]:
    return (
        db.query(Product)
        .options(
            selectinload(Product.images),
            selectinload(Product.variants),
        )
        .order_by(Product.id.desc())
        .all()
    )


def get_product_by_id(
    db: Session,
    product_id: int,
) -> Product | None:
    return (
        db.query(Product)
        .options(
            selectinload(Product.images),
            selectinload(Product.variants),
        )
        .filter(Product.id == product_id)
        .first()
    )


def get_product_by_name(
    db: Session,
    name: str,
) -> Product | None:
    return (
        db.query(Product)
        .filter(Product.name == name)
        .first()
    )


def get_variant_by_sku(
    db: Session,
    sku: str,
) -> ProductVariant | None:
    return (
        db.query(ProductVariant)
        .filter(ProductVariant.sku == sku)
        .first()
    )


def update_product(
    db: Session,
    product: Product,
    product_data: ProductUpdate,
) -> Product:
    try:
        update_data = product_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(product, field, value)

        db.commit()

        return get_product_by_id(db, product.id)

    except SQLAlchemyError:
        db.rollback()
        raise


def delete_product(
    db: Session,
    product: Product,
) -> None:
    try:
        db.delete(product)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise