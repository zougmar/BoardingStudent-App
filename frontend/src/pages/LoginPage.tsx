import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type AccountType = 'student' | 'company';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('student');
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
    const result = await login(email, password, accountType);
    setLoading(false);
    if (result.success) {
      navigate(accountType === 'company' ? '/company' : '/', { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="font-bold text-lg">BS</span>
          </div>
          <span className="text-xl font-bold">Boarding Student</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Welcome back</h2>
          <p className="text-primary-100 text-lg max-w-sm">
            Sign in as a student to manage your profile and matches, or as a company to view candidates.
          </p>
        </div>
        <p className="text-primary-200 text-sm">
          Students: student@boarding.com / demo123 — Companies: company@techcorp.com / demo123
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">BS</div>
            <span className="text-xl font-bold text-gray-900">Boarding Student</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500 text-sm mb-6">Choose your account type and enter your credentials</p>

            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setAccountType('student'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${accountType === 'student' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <User size={18} />
                Student
              </button>
              <button
                type="button"
                onClick={() => { setAccountType('company'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${accountType === 'company' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Building2 size={18} />
                Company
              </button>
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
                    placeholder={accountType === 'company' ? 'company@example.com' : 'you@example.com'}
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
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign in as {accountType === 'company' ? 'Company' : 'Student'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600 text-sm">
              {accountType === 'student' && (
                <>
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                    Create one
                  </Link>
                </>
              )}
              {accountType === 'company' && (
                <span className="text-gray-500">Company accounts are created by the Boarding team.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
