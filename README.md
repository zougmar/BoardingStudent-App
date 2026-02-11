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

- **Student Profile Management** - Create and edit student profile with academic background, skills, and interests
- **CV Upload & Management** - Upload and manage CV (PDF format) connected to the matching process
- **Company Matching Visualization** - Display matching companies with match scores and status
- **Appointment Booking** - Book appointments with advisors and view upcoming/past appointments
- **Messaging & Journey Tracking** - Real-time messaging and visual journey tracking
- **Boarding Resources Access** - Housing information, language support, and integration resources

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation & Running

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
BoardingStudent-App/
├── frontend/              # React + TypeScript frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context for state management
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   ├── package.json
│   └── README.md          # Detailed frontend documentation
└── README.md              # This file
```

## 🛠️ Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

## 📦 Available Scripts

From the `frontend` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

The application is designed with API-ready architecture. The `src/services/api.ts` file contains placeholder functions ready for integration with backend APIs.

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=https://api.boarding.com
```

## 📱 Application Pages

1. **Profile** (`/profile`) - Manage personal information and academic background
2. **CV** (`/cv`) - Upload and manage CV
3. **Matching** (`/matching`) - View and manage company matches
4. **Appointments** (`/appointments`) - Book and view appointments
5. **Journey** (`/journey`) - Track progress and message advisors
6. **Resources** (`/resources`) - Access housing, language, and integration resources

## 🧪 Mock Data

The application currently uses mock data initialized in `AppContext`. This allows for full functionality testing without a backend. When integrating with real APIs, replace the mock data initialization with actual API calls.

## 📝 Development Notes

- TypeScript strict mode enabled
- ESLint for code quality
- Mobile-first responsive design
- React Context API for state management

## 📚 Documentation

For more detailed documentation, see the [frontend README](./frontend/README.md).

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
