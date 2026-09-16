from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.repositories import category_repository
from app.schemas.category import CategoryCreate, CategoryUpdate


def create_category(db: Session, category_data: CategoryCreate) -> Category:
    existing_category = category_repository.get_category_by_name(
        db,
        category_data.name,
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A category with this name already exists.",
        )

    return category_repository.create_category(db, category_data)


def get_all_categories(db: Session) -> list[Category]:
    return category_repository.get_all_categories(db)


def get_category_by_id(db: Session, category_id: int) -> Category:
    category = category_repository.get_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return category


def update_category(
    db: Session,
    category_id: int,
    category_data: CategoryUpdate,
) -> Category:
    category = get_category_by_id(db, category_id)

    if category_data.name and category_data.name != category.name:
        existing_category = category_repository.get_category_by_name(
            db,
            category_data.name,
        )

        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A category with this name already exists.",
            )

    return category_repository.update_category(
        db,
        category,
        category_data,
    )


def delete_category(db: Session, category_id: int) -> None:
    category = get_category_by_id(db, category_id)
    category_repository.delete_category(db, category)