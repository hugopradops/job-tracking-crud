from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class ApplicationStatus(str, Enum):
    applied = "applied"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"


class JobApplicationBase(BaseModel):
    company: str
    position: str
    status: ApplicationStatus = ApplicationStatus.applied
    date_applied: date
    notes: str | None = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    status: ApplicationStatus | None = None
    date_applied: date | None = None
    notes: str | None = None


class JobApplicationResponse(JobApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
