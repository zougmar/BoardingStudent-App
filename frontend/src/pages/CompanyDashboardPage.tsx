import { useAuth } from '../context/AuthContext';
import { Building2, Users, FileText } from 'lucide-react';

export default function CompanyDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.companyName || user?.firstName}. Manage your candidates and matches here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-elevated hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <Users className="text-primary-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Matched Students</h2>
              <p className="text-gray-500 text-sm">View students matched with your company</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This section will list students who have been matched with your company. Coming soon.
          </p>
        </div>
        <div className="card-elevated hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileText className="text-emerald-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Applications</h2>
              <p className="text-gray-500 text-sm">Review applications and CVs</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Review student applications and CVs in one place. Coming soon.
          </p>
        </div>
      </div>

      <div className="card-elevated mt-8 bg-gradient-to-br from-primary-50 to-white border border-primary-100">
        <div className="flex items-start gap-4">
          <Building2 className="text-primary-600 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Company account</h3>
            <p className="text-sm text-gray-600">
              You are signed in as <span className="font-medium text-gray-900">{user?.companyName}</span>.
              Contact the Boarding team to manage your company profile or add more users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
