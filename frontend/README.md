# Boarding Student App

A modern Single Page Application (SPA) designed to support students throughout their journey — from profile creation to internship placement and on-site integration. The platform provides visibility, transparency, and autonomy to students, inspired by professional recruitment platforms.

## 🎯 Project Overview

The Boarding Student App is a student-facing front-end application that solves common challenges students face:

- **Limited visibility** into which companies match their profile
- **Fragmented support** across placement, advising, and integration
- **Lack of transparency** and control over their journey

The application offers one intuitive interface where students can manage their profile, opportunities, and support interactions.

## ✨ Features

### Core Features

- **Student Profile Management**
  - Create and edit student profile
  - Academic background, skills, interests
  - Real-time profile completion status

- **CV Upload & Management**
  - Upload CV (PDF format)
  - Update or replace CV
  - CV connected to the matching process

- **Company Matching Visualization**
  - Display matching companies with match scores
  - Show match status clearly (pending, matched, accepted, rejected)
  - Clean and readable matching interface
  - Accept or decline matches

- **Appointment Booking**
  - Book appointments with advisors
  - View upcoming and past appointments
  - Filter by status and date

- **Messaging & Journey Tracking**
  - Real-time messaging between student and advisors
  - Visual journey steps:
    - Profile
    - Matching
    - Internship
    - Integration
  - Real-time status updates

- **Boarding Resources Access**
  - Housing information
  - Language support
  - Local life and integration resources
  - Community content

## 🛠️ Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd "BoardingStudent App"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
BoardingStudent App/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout.tsx       # Main layout with navigation
│   ├── context/             # React Context for state management
│   │   └── AppContext.tsx  # Global application state
│   ├── pages/               # Page components
│   │   ├── ProfilePage.tsx
│   │   ├── CVPage.tsx
│   │   ├── MatchingPage.tsx
│   │   ├── AppointmentsPage.tsx
│   │   ├── JourneyPage.tsx
│   │   └── ResourcesPage.tsx
│   ├── services/            # API service layer
│   │   └── api.ts          # API integration (ready for backend)
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Usage

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🔌 API Integration

The application is designed with API-ready architecture. The `src/services/api.ts` file contains placeholder functions ready for integration with the IA Backoffice APIs.

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.boarding.com
```

### API Endpoints (Expected)

- `GET /students/me` - Get student profile
- `PATCH /students/me` - Update student profile
- `POST /students/me/cv` - Upload CV
- `GET /companies/matches` - Get matching companies
- `PATCH /companies/:id/match-status` - Update match status
- `GET /appointments` - Get appointments
- `POST /appointments` - Create appointment
- `GET /messages` - Get messages
- `POST /messages` - Send message
- `GET /resources` - Get resources

## 🎨 Design Principles

- **Mobile-first**: Responsive design that works on all devices
- **User-centric**: Intuitive interface with clear feedback
- **Professional**: Recruitment-grade user experience
- **Accessible**: Semantic HTML and proper ARIA labels
- **Performant**: Fast SPA navigation with optimized rendering

## 📱 Pages

1. **Profile** (`/profile`) - Manage personal information and academic background
2. **CV** (`/cv`) - Upload and manage CV
3. **Matching** (`/matching`) - View and manage company matches
4. **Appointments** (`/appointments`) - Book and view appointments
5. **Journey** (`/journey`) - Track progress and message advisors
6. **Resources** (`/resources`) - Access housing, language, and integration resources

## 🔐 State Management

The application uses React Context API for state management. All global state is managed in `src/context/AppContext.tsx`, including:

- Student profile data
- Company matches
- Appointments
- Messages
- Resources

## 🧪 Mock Data

The application currently uses mock data initialized in `AppContext`. This allows for full functionality testing without a backend. When integrating with real APIs, replace the mock data initialization with actual API calls.

## 📝 Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Consistent component structure
- Reusable utility classes with Tailwind

## 🚧 Future Enhancements

- Real-time notifications
- File preview for CV
- Advanced filtering for companies
- Calendar integration
- Email notifications
- Multi-language support

## 📄 License

This project is proprietary software for Boarding services.

## 👥 Support

For questions or issues, please contact the development team or refer to the Resources page within the application.

---

Built with ❤️ for students using Boarding services
