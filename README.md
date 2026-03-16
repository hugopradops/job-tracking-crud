# Job Application Tracker

A full-stack job application tracker that helps you manage your job search from start to finish. Track every application, monitor your pipeline, and stay organized throughout the process.

## Features

- **Application Tracking** — Log job applications with company, position, status, date, and notes
- **Status Pipeline** — Track applications through four stages: Applied, Interview, Offer, and Rejected
- **Dashboard Stats** — See at-a-glance counts for each status
- **Filter & Search** — Filter your applications by status
- **Self-Hosted** — Run it on your own server. First launch creates your personal account, then registration locks — your data stays yours
- **Demo Mode** — Try it instantly with the built-in demo account (`demo@demo.ca` / `password`)
- **Responsive Design** — Desktop table view and mobile card layout

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend | FastAPI, SQLAlchemy (async), Pydantic |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose), bcrypt |
| Deployment | Docker Compose, Nginx |

## Self-Hosting

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run the app

```bash
git clone https://github.com/hugopradops/job-tracking-crud.git
cd job-tracking-crud
docker compose up -d --build
```

The app will be available at **http://localhost**.

By default the app runs in **demo mode** (sign-in only with the demo account). To self-host with your own account, change the mode in `docker-compose.yml`:

```yaml
# docker-compose.yml
backend:
  environment:
    MODE: selfhost  # Change from "demo" to "selfhost"
```

On first launch in self-host mode, you'll be prompted to create your personal account. After that, registration is closed — only you can sign in.

### Stop the app

```bash
docker compose down
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/setup-status/` | Check if initial setup is complete |
| POST | `/api/auth/register/` | Create account (only works on first run) |
| POST | `/api/auth/login/` | Sign in |
| GET | `/api/auth/me/` | Get current user |
| GET | `/api/applications/` | List all applications (supports `?status=` filter) |
| POST | `/api/applications/` | Create an application |
| PUT | `/api/applications/{id}` | Update an application |
| DELETE | `/api/applications/{id}` | Delete an application |

All `/api/applications/` endpoints require a Bearer token in the Authorization header.
