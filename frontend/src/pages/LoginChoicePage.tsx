import { Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

export default function LoginChoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex flex-col">
      <header className="flex items-center justify-between p-6 md:p-8">
        <Link to="/login" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/25">
            BS
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Boarding Student
          </span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Sign in to your student account
          </p>
        </div>

        <div className="w-full max-w-md">
          <Link
            to="/login/student"
            className="group relative flex flex-col items-center p-8 md:p-10 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <User className="text-primary-600" size={32} strokeWidth={2} />
            </div>
            <h2 className="relative text-xl font-bold text-gray-900 mb-2">Student</h2>
            <p className="relative text-gray-500 text-sm text-center mb-6">
              Manage your profile, CV, and company matches
            </p>
            <span className="relative inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
              Sign in
              <ArrowRight size={18} className="group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-gray-400">
          New here? <Link to="/register" className="text-primary-600 font-medium hover:underline">Create an account</Link>
        </p>
      </main>
    </div>
  );
}
