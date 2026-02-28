import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import CompanyLayout from './components/CompanyLayout';
import LoginChoicePage from './pages/LoginChoicePage';
import StudentLoginPage from './pages/StudentLoginPage';
import CompanyLoginPage from './pages/CompanyLoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CVPage from './pages/CVPage';
import MatchingPage from './pages/MatchingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/ResourcesPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';

function StudentApp() {
  return (
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
  );
}

function RoleGuard() {
  const { user } = useAuth();
  if (user?.role === 'company') {
    return <Navigate to="/company" replace />;
  }
  return <StudentApp />;
}

function CompanyRouteGuard() {
  const { user } = useAuth();
  if (user?.role !== 'company') {
    return <Navigate to="/" replace />;
  }
  return (
    <CompanyLayout>
      <Routes>
        <Route index element={<CompanyDashboardPage />} />
      </Routes>
    </CompanyLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginChoicePage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/login/company" element={<CompanyLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/company" element={
            <ProtectedRoute>
              <CompanyRouteGuard />
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <RoleGuard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
