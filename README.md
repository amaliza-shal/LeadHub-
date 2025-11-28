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
You can deploy this project to any Node-capable host (Render, Railway, Heroku, Fly, etc.) by pointing the service to this repo and using `npm start`.

## Notes & Next steps
- Passwords are stored in plain text in `db.json` for simplicity — replace with proper hashing before production.
- Token is a stub (email) — replace with JWT or session system for real deployments.
- I can add a small migration to create initial progress on signup server-side if preferred.
- If you'd like, I can wire up a simple deployment pipeline and add environment-based configuration.

---
If you want me to proceed with deployment (Render/Heroku) or to harden authentication (bcrypt + JWT), tell me which one and I will implement it and push the changes.