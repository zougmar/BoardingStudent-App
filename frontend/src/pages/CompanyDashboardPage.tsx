import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { companyDashboardAPI, type MatchedStudentItem } from '../services/api';
import {
  Building2,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  Mail,
  GraduationCap,
  Loader2,
  ExternalLink,
  UserCircle,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

function StatusBadge({ status }: { status: MatchedStudentItem['matchStatus'] }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    matched: 'bg-sky-100 text-sky-800 border-sky-200',
    accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}
    >
      {label}
    </span>
  );
}

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [list, setList] = useState<MatchedStudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    companyDashboardAPI
      .getMatchedStudents()
      .then((data) => {
        if (!cancelled) setList(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = async (matchId: string, status: MatchedStudentItem['matchStatus']) => {
    if (!API_BASE) return;
    setUpdatingId(matchId);
    try {
      await companyDashboardAPI.updateMatchStatus(matchId, status);
      setList((prev) =>
        prev.map((m) => (m.matchId === matchId ? { ...m, matchStatus: status } : m))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: list.length,
    pending: list.filter((m) => m.matchStatus === 'pending').length,
    accepted: list.filter((m) => m.matchStatus === 'accepted' || m.matchStatus === 'matched').length,
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.firstName || user?.companyName}
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your matched candidates and review applications for {user?.companyName}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.accepted}</p>
              <p className="text-sm text-slate-500">Accepted / Matched</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matched students */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Matched students</h2>

        {!API_BASE && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <Building2 className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-600">
              Connect the app to the backend (set <code className="bg-slate-100 px-1 rounded">VITE_API_URL</code>) to see
              matched students here.
            </p>
          </div>
        )}

        {API_BASE && loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-emerald-600 animate-spin" size={40} />
          </div>
        )}

        {API_BASE && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p>{error}</p>
          </div>
        )}

        {API_BASE && !loading && !error && list.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Users className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-600 font-medium">No matched students yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Students matched with your company will appear here.
            </p>
          </div>
        )}

        {API_BASE && !loading && !error && list.length > 0 && (
          <div className="space-y-4">
            {list.map((item) => (
              <div
                key={item.matchId}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <UserCircle className="text-slate-400" size={28} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {item.student.firstName} {item.student.lastName}
                      </h3>
                      <a
                        href={`mailto:${item.student.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 mt-0.5"
                      >
                        <Mail size={14} />
                        {item.student.email}
                      </a>
                      {item.student.academicBackground?.field && (
                        <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                          <GraduationCap size={14} />
                          {item.student.academicBackground.field}
                          {item.student.academicBackground.university && (
                            <> · {item.student.academicBackground.university}</>
                          )}
                        </p>
                      )}
                      {item.student.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.student.skills.slice(0, 5).map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                          {item.student.skills.length > 5 && (
                            <span className="text-xs text-slate-400">+{item.student.skills.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Profile</span>
                      <span className="text-sm font-medium text-slate-700">
                        {item.student.profileCompletion}%
                      </span>
                    </div>
                    <StatusBadge status={item.matchStatus} />
                    {item.student.cvUrl && (
                      <a
                        href={item.student.cvUrl.startsWith('http') ? item.student.cvUrl : `${API_BASE.replace(/\/$/, '')}${item.student.cvUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                      >
                        <FileText size={16} />
                        CV
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {['pending', 'matched'].includes(item.matchStatus) && (
                      <>
                        <button
                          onClick={() => handleStatusChange(item.matchId, 'accepted')}
                          disabled={updatingId === item.matchId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                          {updatingId === item.matchId ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.matchId, 'rejected')}
                          disabled={updatingId === item.matchId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 disabled:opacity-50 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer note */}
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
