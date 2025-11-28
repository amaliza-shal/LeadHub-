# LeadHub

Minimal LeadHub demo (frontend + Express backend). This README explains how I improved authentication, persistence, and content loading so the platform can run locally and be deployed.

## What I changed/added
- Added a minimal Express backend (`server.js`) that serves static files and provides API endpoints:
  - `GET /api/status` — health check
  - `POST /api/auth/signup` — create user (stored in `db.json`)
  - `POST /api/auth/login` — login user (simple email/password check)
  - `GET /api/courses` — returns `db.json` courses
  - `GET /api/courses/:id` — get course details
  - `GET /api/progress` and `POST /api/progress` — read/write user progress using the token (email) in `Authorization: Bearer <email>`
- Persisted data in `db.json` (users, courses, progress).
- Frontend changes in `main.js`:
  - `loadCourses()` fetches `/api/courses` and renders the courses grid.
  - Login now calls `/api/auth/login`; if the user does not exist, the signup form is pre-filled and shown.
  - Signup posts to `/api/auth/signup` and creates initial progress using `/api/progress`.
  - `startCourse(id)` fetches the course detail and opens video modal when `videoUrl` exists, then updates progress.
  - Progress is fetched from `/api/progress` on login and saved via `POST /api/progress` when progress changes.

## Run locally (Windows PowerShell)
```powershell
cd 'C:\Users\EVOTECH SOL\Desktop\LEAD HUB\LeadHub-'
npm install
npm start
# open http://localhost:3000 in your browser
```

## Deploy
Recommended deployment (two options):

- Option A — Single deploy (recommended for simplicity): Deploy the full app (backend + static frontend) as a Node service on Render, Railway, or Heroku. These services will run `npm start` and serve the site from the Express server.

- Option B — Separate frontend + backend (recommended for scalability):
  - Deploy the backend (Express) to Render or Railway. Set an environment variable `JWT_SECRET` on the host (do NOT use the default development secret in production). The backend will serve the static files and API endpoints. Use the `start` script (`npm start`).
  - Optionally deploy only the static frontend to Vercel or Netlify and point API calls to the backend URL (update `fetch` URLs or set a runtime env).

## Notes & Next steps
- Passwords are stored in plain text in `db.json` for simplicity — replace with proper hashing before production.
- Token is a stub (email) — replace with JWT or session system for real deployments.
- I can add a small migration to create initial progress on signup server-side if preferred.
- If you'd like, I can wire up a simple deployment pipeline and add environment-based configuration.

### What I implemented now
- Passwords are hashed with `bcryptjs` and JSON Web Tokens (`jsonwebtoken`) are issued on login/signup.
- The client stores the JWT in `localStorage` as `authToken` and sends it in `Authorization: Bearer <token>` on protected API calls.
- A small smoke test is available at `tests/api.test.js` (run `node tests/api.test.js`) to verify core API flows locally.

### Production reminders
- Set `JWT_SECRET` in your host environment — do not use the default value.
- Move to a proper database (SQLite/Postgres) before storing real user data.
- Add HTTPS and CORS configuration if you split frontend/backend across hosts.


---
If you want me to proceed with deployment (Render/Heroku) or to harden authentication (bcrypt + JWT), tell me which one and I will implement it and push the changes.