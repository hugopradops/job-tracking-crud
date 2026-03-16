import asyncio
from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import delete, select

from app.auth import hash_password
from app.auth_routes import DEMO_EMAIL, DEMO_MODE, router as auth_router
from app.database import async_session
from app.models import ApplicationStatus, JobApplication
from app.routes import router
from app.user_model import User

DEMO_SAMPLES = [
    ("Google", "Software Engineer", ApplicationStatus.applied, date(2026, 3, 1), "Applied through careers page"),
    ("Stripe", "Frontend Developer", ApplicationStatus.interview, date(2026, 3, 5), "Phone screen scheduled"),
    ("Shopify", "Fullstack Engineer", ApplicationStatus.offer, date(2026, 3, 10), "Offer received!"),
    ("Meta", "Backend Engineer", ApplicationStatus.rejected, date(2026, 3, 3), "Didn't pass the final round"),
]


async def seed_demo_user() -> None:
    """Create the demo user and seed sample applications."""
    async with async_session() as db:
        result = await db.execute(select(User).where(User.email == DEMO_EMAIL))
        user = result.scalar_one_or_none()
        if user is None:
            user = User(email=DEMO_EMAIL, password_hash=hash_password("password"))
            db.add(user)
            await db.commit()
            await db.refresh(user)

        await _reset_demo_data(db, user.id)


async def _reset_demo_data(db, user_id: int) -> None:
    """Delete all demo applications and re-insert the samples."""
    await db.execute(
        delete(JobApplication).where(JobApplication.user_id == user_id)
    )
    await db.flush()
    for company, position, status, date_applied, notes in DEMO_SAMPLES:
        app = JobApplication(
            user_id=user_id,
            company=company,
            position=position,
            status=status,
            date_applied=date_applied,
            notes=notes,
        )
        db.add(app)
        await db.flush()
    await db.commit()


async def periodic_demo_reset() -> None:
    """Reset demo user data every hour."""
    while True:
        await asyncio.sleep(3600)
        try:
            async with async_session() as db:
                result = await db.execute(
                    select(User).where(User.email == DEMO_EMAIL)
                )
                user = result.scalar_one_or_none()
                if user:
                    await _reset_demo_data(db, user.id)
        except Exception:
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    if DEMO_MODE:
        await seed_demo_user()
        task = asyncio.create_task(periodic_demo_reset())
    yield
    if DEMO_MODE:
        task.cancel()


app = FastAPI(title="Job Application Tracker", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
