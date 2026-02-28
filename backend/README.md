# Boarding Student API (MERN-style)

Node.js + Express + TypeScript backend with **MongoDB Atlas** and JWT auth.

## Setup

1. **MongoDB Atlas**
   - Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
   - Create a database user (username + password).
   - Get the connection string: **Connect** → **Drivers** → copy the URI (e.g. `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/`).
   - Add your DB name and options: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/boarding-student?retryWrites=true&w=majority`.
   - In **Network Access**, add your IP (or `0.0.0.0/0` for dev).

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit `.env` and set:
   - **MONGODB_URI** — your Atlas connection string (replace `<user>`, `<password>`, `<cluster>`).
   - **JWT_SECRET** — a long random string for production.

## Run

- **Development:** `npm run dev` (port 3001).
- **Production:** `npm run build` then `npm start`.
- **Seed only:** `npm run seed` (creates default users and data if the DB has no users).

On first start, the API auto-seeds the database if no users exist.

## Environment

| Variable       | Description                    | Default           |
|----------------|--------------------------------|-------------------|
| PORT           | Server port                    | 3001              |
| NODE_ENV       | environment                    | development       |
| JWT_SECRET     | Secret for JWT tokens          | (set in .env)     |
| MONGODB_URI    | MongoDB Atlas connection string| (required)        |
| API_URL        | Base URL for CV links          | http://localhost:3001 |
| FRONTEND_URL   | CORS allowed origin            | http://localhost:5173 |

## API

Base URL: `http://localhost:3001` (or your `API_URL`).

### Auth (no token)
- `POST /api/auth/login` — Body: `{ email, password }` → `{ token, user }`
- `POST /api/auth/register` — Body: `{ email, password, firstName, lastName }` → `{ token, user }`

### Protected (header: `Authorization: Bearer <token>`)
- `GET /api/auth/me` — Current user
- `GET /api/students/me` — Current student profile
- `PATCH /api/students/me` — Update profile (partial)
- `POST /api/students/me/cv` — Upload CV (multipart form field `cv`, PDF, max 5MB) → `{ cvUrl }`
- `GET /api/companies/matches` — Companies with match status for current student
- `PATCH /api/companies/:id/match-status` — Body: `{ status }` (pending | matched | rejected | accepted)
- `GET /api/appointments` — List appointments
- `POST /api/appointments` — Body: `{ advisorName, advisorEmail, date, duration, type, notes? }`
- `GET /api/messages` — List messages
- `POST /api/messages` — Body: `{ recipientId, recipientName, content }`
- `GET /api/resources` — List resources

### Other
- `GET /api/health` — Health check
- `GET /uploads/:filename` — Uploaded CV files

## Seed users

After seeding you can log in with:
- **student@boarding.com** / **demo123**
- **o.zouglah03@gmail.com** / **demo123**
