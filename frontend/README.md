# Smart Waste and Garbage Complaint Management System — Frontend (Web)

React 18 + Vite + Tailwind CSS + React Router + Redux Toolkit.

## Setup

```bash
npm install
cp .env.example .env     # set VITE_API_BASE_URL to your backend URL
npm run dev
```

App runs at `http://localhost:3000`.

## Structure

- `src/pages/auth` — Login, Register, Forgot Password
- `src/pages/citizen` — Citizen dashboard, complaint creation & listing
- `src/pages/admin` — Admin dashboard, all complaints, users/teams, analytics, reports
- `src/pages/manager` — Manager dashboard, team assignments
- `src/pages/worker` — Field worker dashboard, task list
- `src/pages/shared` — Complaint detail (used by all roles), profile, 404
- `src/layouts` — Sidebar shell per role portal
- `src/services` — Axios API clients (auth, complaints, locations, assignments, notifications, dashboard, reports)
- `src/context` — AuthContext (JWT session) + Redux store (notifications)
- `src/routes` — `ProtectedRoute` (requires login) and `RoleRoute` (requires matching role)

This is a functional scaffold wired to every backend endpoint described in the SRS — some
admin-only screens (e.g. full user/team CRUD) are stubbed and should be built out once the
corresponding list/create API endpoints are finalized (see `docs/REVIEW.md`).
