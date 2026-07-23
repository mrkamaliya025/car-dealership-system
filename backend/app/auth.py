from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)


def create_access_token(user):
    payload = {
        "sub": user.email,
        "is_admin": user.is_admin,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)