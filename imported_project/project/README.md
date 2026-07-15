# Smart Waste and Garbage Complaint Management System — Punjab, Pakistan

Full project deliverable: backend, frontend, and documentation.

## Contents

```
project/
├── backend/     Django + DRF + MongoDB (djongo) REST API — see backend/README.md
├── frontend/    React + Vite + Tailwind web app — see frontend/README.md
└── docs/
    ├── SRS.docx      Software Requirements Specification
    └── REVIEW.docx   Technical review (risk assessment, gaps, recommendations)
```

## Quick start

1. **Backend** — `cd backend`, follow `backend/README.md` (Python 3.12, MongoDB, `pip install -r requirements.txt`, `python manage.py migrate`, `python manage.py seed_locations`, `python manage.py runserver`).
2. **Frontend** — `cd frontend`, follow `frontend/README.md` (`npm install`, `npm run dev`).
3. Read `docs/REVIEW.docx` first — it flags the one architectural risk (MongoDB via `djongo`) worth understanding before you build on top of this.

## What's implemented

- All 8 modules from the spec: Citizen/Admin/Manager/Worker portals, notifications, analytics, complaint tracking, user verification.
- Full complaint lifecycle (Pending → ... → Closed/Reopened/Rejected) with timeline, images, comments, feedback.
- JWT auth (register/login/logout/refresh/change/forgot/reset password).
- Punjab location hierarchy seed data (Division → District → Tehsil → Area) for all 9 divisions.
- Assignment workflow (Admin → Manager → Worker) with notifications.
- Role-based dashboards + admin analytics with charts.
- PDF / Excel / CSV report generation.
- React web app wired to every one of the above endpoints, with role-based routing and layouts.

## What's stubbed / follow-up work

See `docs/REVIEW.docx`, Section 5, for the full list (mainly: admin user/team management UI, automated tests, email delivery for password reset).
