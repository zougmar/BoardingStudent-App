// Import global application context to access companies and updater
import { useApp } from '../context/AppContext';
// Icons used for company cards and status indicators
import { Building2, MapPin, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
// Date formatting helper (used for any date fields if needed)
import { format } from 'date-fns';

// Page that shows company matches and lets the student accept/decline them
const MatchingPage = () => {
  // Get list of matched companies and helper to update match status
  const { companies, updateCompanyStatus } = useApp();

  // Small helper that returns a colored badge based on match status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return (
          <span className="badge badge-success">
            <CheckCircle size={14} />
            <span>Matched</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="badge badge-info">
            <CheckCircle size={14} />
            <span>Accepted</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="badge badge-error">
            <XCircle size={14} />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="badge badge-warning">
            <Clock size={14} />
            <span>Pending</span>
          </span>
        );
    }
  };

  // Pick a text color class based on the match score value
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-yellow-600';
  };

  // Handler used when the student accepts or rejects a match
  const handleStatusChange = (companyId: string, newStatus: 'accepted' | 'rejected') => {
    updateCompanyStatus(companyId, newStatus);
  };

  // Sort companies by match score (highest first) to show the best matches on top
  const sortedCompanies = [...companies].sort((a, b) => b.matchScore - a.matchScore);

  return (
    // Main container for the matching page
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page heading */}
      <div className="section-header">
        <h1 className="section-title">Company Matching</h1>
        <p className="section-subtitle">Discover companies that match your profile and skills</p>
      </div>

      {/* Empty state when there are no matching companies */}
      {sortedCompanies.length === 0 ? (
        <div className="card text-center py-12">
          <Building2 className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
          <p className="text-gray-600">
            Complete your profile and upload your CV to start seeing matching companies
          </p>
        </div>
      ) : (
        // List of company cards when matches exist
        <div className="space-y-6">
          {sortedCompanies.map((company, index) => (
            <div 
              key={company.id} 
              className="card-elevated hover:shadow-large transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex items-start space-x-4">
                      {company.logo ? (
                        // Show company logo when provided
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-gray-100"
                        />
                      ) : (
                        // Fallback block with generic building icon when no logo exists
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shadow-md border-2 border-primary-50">
                          <Building2 className="text-primary-600" size={36} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                            <MapPin size={14} className="text-primary-600" />
                            <span className="font-medium">{company.location}</span>
                          </span>
                          <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium">{company.industry}</span>
                        </div>
                      </div>
                    </div>
                    {/* Visual status (Pending / Matched / Accepted / Rejected) */}
                    {getStatusBadge(company.matchStatus)}
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{company.description}</p>

                  {/* Match score bar and percentage */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Match Score</span>
                      <span className={`text-2xl font-bold ${getMatchScoreColor(company.matchScore)}`}>
                        {company.matchScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                          company.matchScore >= 85
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            : company.matchScore >= 70
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600'
                        }`}
                        style={{ width: `${company.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Company requirements as small tags */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column: actions and small status summary boxes */}
                <div className="flex flex-col space-y-2 md:w-48">
                  {company.matchStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(company.id, 'accepted')}
                        className="btn-primary w-full"
                      >
                        Accept Match
                      </button>
                      <button
                        onClick={() => handleStatusChange(company.id, 'rejected')}
                        className="btn-secondary w-full"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {company.matchStatus === 'matched' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium text-center">
                        You've been matched!
                      </p>
                    </div>
                  )}
                  {company.matchStatus === 'accepted' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium text-center">
                        Match accepted
                      </p>
                    </div>
                  )}
                  {company.matchStatus === 'rejected' && (
                    <button
                      onClick={() => updateCompanyStatus(company.id, 'pending')}
                      className="btn-secondary w-full"
                    >
                      Reconsider
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card-elevated mt-8 bg-gradient-to-br from-primary-50/80 to-primary-100/50 border-2 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-200 rounded-xl">
            <TrendingUp className="text-primary-700" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-900 mb-2 text-lg">How Matching Works</h3>
            <p className="text-sm text-primary-800 leading-relaxed">
              Companies are matched based on your profile, skills, and CV. Higher match scores indicate
              better alignment with company requirements. You can accept or decline matches, and our team
              will help facilitate the next steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;
