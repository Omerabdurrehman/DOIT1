# Smart Waste and Garbage Complaint Management System — Backend

Django + Django REST Framework API backed by MongoDB (via `djongo`), with JWT authentication.

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit values
```

Make sure MongoDB is running locally (or update `.env` to point at your instance), then:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_locations   # populates Punjab province/division/district/tehsil/area
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`
Swagger docs: `http://127.0.0.1:8000/swagger/`

## App layout

| App             | Responsibility                                              |
|------------------|--------------------------------------------------------------|
| `accounts`       | Custom User model, roles, JWT auth, profile, teams           |
| `locations`      | Province/Division/District/Tehsil/Area hierarchy             |
| `complaints`      | Complaint CRUD, images, timeline, comments, feedback, status  |
| `assignments`    | Admin→Manager→Worker assignment workflow                     |
| `notifications`  | In-app notifications (Django signals + DB)                   |
| `dashboard`      | Per-role dashboards + analytics aggregation                  |
| `reports`        | PDF / Excel / CSV report generation                          |

See `../docs/SRS.docx` for full requirements and `../docs/REVIEW.docx` for a technical review
of this spec, including a note on `djongo` compatibility risk.
