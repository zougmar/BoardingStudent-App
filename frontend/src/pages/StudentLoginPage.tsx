import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, 'student');
    setLoading(false);
    if (result.success) navigate('/', { replace: true });
    else setError(result.error || 'Login failed');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Branding */}
      <div className="relative hidden md:flex md:w-[48%] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/95 to-slate-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-10 lg:p-14 text-white w-full">
          <Link to="/login" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-bold text-lg border border-white/20">
              BS
            </div>
            <span className="text-xl font-bold tracking-tight">Boarding Student</span>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-primary-200 mb-4">
              <Sparkles size={22} strokeWidth={2} />
              <span className="text-sm font-semibold uppercase tracking-wider">Student Portal</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight">
              Manage your profile,<br />discover your matches
            </h1>
            <p className="text-slate-300 text-lg max-w-sm leading-relaxed">
              Sign in to update your CV, track company matches, and book appointments with advisors.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur border border-white/10 px-4 py-3 text-sm text-slate-200">
            <span className="font-medium text-white">Demo:</span> student@boarding.com / demo123
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50/80">
        <div className="w-full max-w-[400px]">
          <div className="md:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
              BS
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Boarding Student</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="mt-2 text-slate-500">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-600 text-xs">!</span>
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={1.8} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={1.8} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
