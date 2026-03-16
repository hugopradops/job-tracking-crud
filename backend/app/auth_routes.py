import os

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.database import get_db
from app.user_model import User
from app.user_schemas import TokenResponse, UserLogin, UserRegister, UserResponse

DEMO_EMAIL = "demo@demo.ca"
DEMO_MODE = os.getenv("MODE", "demo").lower() == "demo"

router = APIRouter(prefix="/api/auth", tags=["auth"])


async def _has_owner(db: AsyncSession) -> bool:
    """Check if a non-demo user (the owner) already exists."""
    result = await db.execute(
        select(func.count()).select_from(User).where(User.email != DEMO_EMAIL)
    )
    return result.scalar() > 0


@router.get("/setup-status/")
async def setup_status(db: AsyncSession = Depends(get_db)):
    if DEMO_MODE:
        return {"setup_complete": True, "demo": True}
    has_owner = await _has_owner(db)
    return {"setup_complete": has_owner, "demo": False}


@router.post("/register/", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    # Block registration in demo mode or if an owner already exists
    if DEMO_MODE or await _has_owner(db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is closed. An account already exists.",
        )

    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login/", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me/", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
