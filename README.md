# Boarding Student App

A modern, front-end-only Single Page Application for students and companies: profile management, matching, appointments, and resources. **Professional login** with Student and Company options; runs standalone with demo accounts.

## ✨ Features

- **Login** – Choose **Student** or **Company**; sign in with demo or registered accounts
- **Student** – Profile, CV, company matching, appointments, journey, resources
- **Company** – Dashboard with stats and matched-students section (demo mode)
- **Register** – Create a student account (stored in browser)
- Responsive, modern UI with Tailwind CSS

## 🚀 Quick Start

**Prerequisites:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

### Demo login

| Role    | Email                     | Password |
|--------|---------------------------|----------|
| Student| `student@boarding.com`    | `demo123`|
| Student| `o.zouglah03@gmail.com`   | `demo123`|
| Company| `company@techcorp.com`   | `demo123`|
| Company| `company@innovatelab.com`| `demo123`|

New users can **Register** (student only); data is stored in the browser.

## 📁 Project structure

```
frontend/
├── src/
│   ├── components/   # Layout, ProtectedRoute, CompanyLayout, etc.
│   ├── context/      # AuthContext, AppContext
│   ├── pages/        # Login, Register, Profile, CV, Matching, etc.
│   ├── services/     # api.ts (placeholders for future backend)
│   └── types/
├── public/
└── package.json
```

## 📦 Scripts

From the `frontend` directory:

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – ESLint

## 🌐 Deploy (Vercel)

1. Connect the repo to Vercel.
2. Set **Root Directory** to `frontend`.
3. Build: `npm run build`, Output: `dist`.
4. Deploy. No environment variables required; the app uses demo login and in-browser data.

## 🛠️ Stack

- React 18, TypeScript, Vite  
- React Router, Tailwind CSS, Lucide React, date-fns  

## 📄 License

Proprietary – Boarding services.

---

Built for students using Boarding services.
