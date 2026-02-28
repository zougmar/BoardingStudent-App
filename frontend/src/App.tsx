import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CVPage from './pages/CVPage';
import MatchingPage from './pages/MatchingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/profile" replace />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/cv" element={<CVPage />} />
                      <Route path="/matching" element={<MatchingPage />} />
                      <Route path="/appointments" element={<AppointmentsPage />} />
                      <Route path="/journey" element={<JourneyPage />} />
                      <Route path="/resources" element={<ResourcesPage />} />
                    </Routes>
                  </Layout>
                </AppProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
