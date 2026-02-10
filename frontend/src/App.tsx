import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import CVPage from './pages/CVPage';
import MatchingPage from './pages/MatchingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
