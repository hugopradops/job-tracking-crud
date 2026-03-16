from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import ApplicationStatus as ModelStatus
from app.models import JobApplication
from app.schemas import (
    ApplicationStatus,
    JobApplicationCreate,
    JobApplicationResponse,
    JobApplicationUpdate,
)
from app.user_model import User

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.get("/", response_model=list[JobApplicationResponse])
async def list_applications(
    status: ApplicationStatus | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(JobApplication).where(JobApplication.user_id == current_user.id)
    if status is not None:
        stmt = stmt.where(JobApplication.status == ModelStatus(status.value))
    stmt = stmt.order_by(JobApplication.date_applied.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{application_id}", response_model=JobApplicationResponse)
async def get_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.user_id == current_user.id,
        )
    )
    application = result.scalar_one_or_none()
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.post("/", response_model=JobApplicationResponse, status_code=201)
async def create_application(
    data: JobApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = JobApplication(**data.model_dump(), user_id=current_user.id)
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


@router.put("/{application_id}", response_model=JobApplicationResponse)
async def update_application(
    application_id: int,
    data: JobApplicationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.user_id == current_user.id,
        )
    )
    application = result.scalar_one_or_none()
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(application, key, value)

    await db.commit()
    await db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=204)
async def delete_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.user_id == current_user.id,
        )
    )
    application = result.scalar_one_or_none()
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    await db.delete(application)
    await db.commit()
