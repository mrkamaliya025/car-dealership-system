from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )


def admin_required(user=Depends(get_current_user)):

    if not user.get("is_admin"):
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user