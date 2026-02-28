// Core React types for describing the shape of component props
import { ReactNode } from 'react';
// Routing helpers: Link for navigation, useLocation to detect active route
import { Link, useLocation } from 'react-router-dom';
// Icons used in the sidebar navigation and mobile header
import { 
  User, 
  FileText, 
  Building2, 
  Calendar, 
  MapPin, 
  BookOpen,
  Menu,
  X,
  LogOut
} from 'lucide-react';
// Local state for managing whether the mobile menu is open
import { useState } from 'react';
// Global app context hook to display student info in the sidebar
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// Props accepted by the Layout component
interface LayoutProps {
  children: ReactNode;
}

// Layout wraps all pages with navigation (sidebar + mobile top bar)
const Layout = ({ children }: LayoutProps) => {
  // Current route information, used for active link styling
  const location = useLocation();
  // Track whether the mobile navigation drawer is visible
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { student } = useApp();
  const { logout } = useAuth();

  // Main navigation items for the student portal
  const navigation = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'CV', path: '/cv', icon: FileText },
    { name: 'Matching', path: '/matching', icon: Building2 },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Journey', path: '/journey', icon: MapPin },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  // Track if custom logo failed to load so we show "BS" fallback
  const [logoError, setLogoError] = useState(false);

  // Simple helper to know if a given path matches the current URL
  const isActive = (path: string) => location.pathname === path;

  const logoContent = (size: 'sm' | 'md') => (
    <div className={size === 'sm' ? 'w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white shrink-0' : 'w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md shrink-0'}>
      {!logoError ? (
        <img
          src="/images/logo.png"
          alt="Boarding Student"
          className={size === 'sm' ? 'w-8 h-8 object-contain' : 'w-10 h-10 object-contain'}
          onError={() => setLogoError(true)}
        />
      ) : (
        <div className={size === 'sm' ? 'w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center' : 'w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center'}>
          <span className={`text-white font-bold ${size === 'sm' ? 'text-sm' : ''}`}>BS</span>
        </div>
      )}
    </div>
  );

  return (
    // Background and high-level layout container
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile top bar with logo and hamburger menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            {logoContent('sm')}
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Boarding Student
            </h1>
          </div>
          <button
            // Toggle mobile navigation when button is pressed
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-16 animate-fade-in flex flex-col">
          <nav className="flex flex-col p-4 space-y-1 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={isActive(item.path) ? 'text-primary-600' : ''} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => { setMobileMenuOpen(false); logout(); }}
              className="flex items-center space-x-3 px-4 py-3.5 rounded-xl w-full text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-soft">
          <div className="flex-1 flex flex-col pt-6 pb-6 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                {logoContent('md')}
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    Boarding Student
                  </h1>
                  <p className="text-xs text-gray-500">Student Portal</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-transform duration-200 ${isActive(item.path) ? 'text-primary-600' : 'group-hover:scale-110'}`} 
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            {student && (
              <div className="px-6 py-5 mx-4 mt-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="text-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700">
                          {student.firstName.charAt(0)}
                          {student.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 leading-snug">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-gray-500 text-[11px] truncate max-w-[150px]">
                        {student.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-600 font-medium">Profile Completion</span>
                      <span className="font-bold text-primary-600">{student.profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${student.profileCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-gray-200 hover:border-red-200"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-72 pt-16 lg:pt-0">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
