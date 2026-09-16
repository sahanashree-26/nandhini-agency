from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def create_category(db: Session, category_data: CategoryCreate) -> Category:
    category = Category(**category_data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_all_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.id.desc()).all()


def get_category_by_id(db: Session, category_id: int) -> Category | None:
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str) -> Category | None:
    return db.query(Category).filter(Category.name == name).first()


def update_category(
    db: Session,
    category: Category,
    category_data: CategoryUpdate,
) -> Category:
    update_data = category_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()