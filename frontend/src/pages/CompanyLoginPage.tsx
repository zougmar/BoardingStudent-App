import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CompanyLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate(user.role === 'company' ? '/company' : '/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, 'company');
    setLoading(false);
    if (result.success) navigate('/company', { replace: true });
    else setError(result.error || 'Login failed');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-12 flex-col justify-between text-white">
        <Link to="/login" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="font-bold text-lg">BS</span>
          </div>
          <span className="text-xl font-bold">Boarding Student</span>
        </Link>
        <div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <Building2 size={28} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Company portal</h2>
          <p className="text-emerald-100 text-lg max-w-sm">
            Sign in to view matched candidates, review applications, and manage your hiring pipeline.
          </p>
        </div>
        <p className="text-emerald-200 text-sm">
          Demo: company@techcorp.com / demo123
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">BS</div>
            <span className="text-xl font-bold text-gray-900">Boarding Student</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
              ← Back to sign in options
            </Link>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company sign in</h1>
                <p className="text-gray-500 text-sm">Enter your company account credentials</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@example.com"
                    className="input-field pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Company accounts are created by the Boarding team. <Link to="/login" className="text-emerald-600 font-medium hover:underline">Back to options</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
