// React Router setup for SPA navigation
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Context provider that exposes global app state (student, companies, etc.)
import { AppProvider } from './context/AppContext';
// Shared layout component (sidebar, header, main content area)
import Layout from './components/Layout';
// All individual page components
import ProfilePage from './pages/ProfilePage';
import CVPage from './pages/CVPage';
import MatchingPage from './pages/MatchingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/ResourcesPage';

// Root application component: wires up context + routing + layout
function App() {
  return (
    // Provide global app state to everything inside
    <AppProvider>
      {/* Router enables client-side navigation between pages */}
      <Router>
        {/* Layout wraps the main content with navigation UI */}
        <Layout>
          <Routes>
            {/* Default route redirects to the Profile page */}
            <Route path="/" element={<ProfilePage />} />
            {/* Profile and CV management */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cv" element={<CVPage />} />
            {/* Matching and appointments */}
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            {/* Journey tracking and resources */}
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
