import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.firstName || user?.companyName}
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your matched candidates and review applications for {user?.companyName}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Total matched</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Pending review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
              <CheckCircle2 className="text-sky-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Accepted / Matched</p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Matched students</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Demo mode</h3>
          <p className="mt-2 text-slate-600 max-w-md mx-auto">
            Matched students will appear here when you connect the app to a backend. For now, explore the rest of the dashboard and student flows.
          </p>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="flex items-start gap-3">
          <Building2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-slate-900">Company account</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Signed in as <span className="font-medium text-slate-900">{user?.companyName}</span>.
              Contact the Boarding team to update your company profile or add users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
