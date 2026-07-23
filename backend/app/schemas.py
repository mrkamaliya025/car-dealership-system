from pydantic import BaseModel, EmailStr, Field


# -------------------------
# User Schemas
# -------------------------

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=3)
    mobile: str = Field(..., min_length=10, max_length=10)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    role: str
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    mobile: str
    email: EmailStr
    is_admin: bool

    class Config:
        from_attributes = True


# -------------------------
# Vehicle Schemas
# -------------------------

class VehicleCreate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleUpdate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleResponse(BaseModel):
    id: int
    make: str
    model: str
    category: str
    price: float
    quantity: int

    class Config:
        from_attributes = True