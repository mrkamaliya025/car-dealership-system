from sqlalchemy import Column, Integer, String, Float, Boolean
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    mobile = Column(String, unique=True, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    is_admin = Column(Boolean, default=False)


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    make = Column(String, nullable=False)

    model = Column(String, nullable=False)

    category = Column(String, nullable=False)

    price = Column(Float, nullable=False)

    quantity = Column(Integer, default=0)