from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    colour = Column(String(50), nullable=False)

    size = Column(String(50), nullable=False)

    price = Column(Numeric(10, 2), nullable=False)

    stock = Column(Integer, nullable=False, default=0)

    sku = Column(String(100), unique=True, nullable=True)

    product = relationship(
        "Product",
        back_populates="variants",
    )