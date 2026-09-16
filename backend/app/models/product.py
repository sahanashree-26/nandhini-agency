from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(String(150), nullable=False)
    tamil_name = Column(String(150), nullable=True)
    description = Column(Text, nullable=True)
    brand = Column(String(100), nullable=True)
    material = Column(String(100), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    category = relationship("Category")

    images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.display_order",
    )

    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
    )