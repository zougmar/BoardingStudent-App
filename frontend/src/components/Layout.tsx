import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Building2, 
  Calendar, 
  MapPin, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { student } = useApp();

  const navigation = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'CV', path: '/cv', icon: FileText },
    { name: 'Matching', path: '/matching', icon: Building2 },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Journey', path: '/journey', icon: MapPin },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Boarding Student
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-16 animate-fade-in">
          <nav className="flex flex-col p-4 space-y-1">
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
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-soft">
          <div className="flex-1 flex flex-col pt-6 pb-6 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">BS</span>
                </div>
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
                  <div className="font-semibold text-gray-900 mb-0.5">{student.firstName} {student.lastName}</div>
                  <div className="text-gray-500 text-xs mb-3">{student.email}</div>
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
