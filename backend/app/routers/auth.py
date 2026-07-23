from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin
from app.auth import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# --------------------------
# Register
# --------------------------
@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Password confirmation
    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    # Email exists
    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Mobile exists
    existing_mobile = db.query(User).filter(
        User.mobile == user.mobile
    ).first()

    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile number already exists"
        )

    # Create user
    new_user = User(
        full_name=user.full_name,
        mobile=user.mobile,
        email=user.email,
        password=hash_password(user.password),

        # Automatically make this email an Admin
        is_admin=(user.email.lower() == "admin@gmail.com")
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration Successful"
    }


# --------------------------
# Login
# --------------------------
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # Check if user exists
    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    # Verify password
    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    # Verify selected role
    if user.role.lower() == "admin" and not db_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="This account is not an Admin."
        )

    if user.role.lower() == "user" and db_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Please select Admin to login with this account."
        )

    # Generate JWT
    token = create_access_token(db_user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "mobile": db_user.mobile,
            "email": db_user.email,
            "is_admin": db_user.is_admin
        }
    }