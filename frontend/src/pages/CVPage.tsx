import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Upload, Check, X, Download } from 'lucide-react';

const CVPage = () => {
  const { student, uploadCV } = useApp();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await uploadCV(file);
    } catch (err) {
      setError('Failed to upload CV. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (student.cvUrl) {
      const link = document.createElement('a');
      link.href = student.cvUrl;
      link.download = 'CV.pdf';
      link.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">CV Management</h1>
        <p className="section-subtitle">Upload and manage your CV for company matching</p>
      </div>

      <div className="card-elevated">
        {student.cvUrl ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-md">
                  <Check className="text-emerald-700" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">CV Uploaded</h3>
                  <p className="text-sm text-gray-600">Your CV is connected to the matching process</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleReplace}
                  className="btn-primary flex items-center space-x-2"
                  disabled={uploading}
                >
                  <Upload size={18} />
                  <span>Replace CV</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-900 mb-2">CV Status</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Your CV is being used for company matching. Companies can view your CV when evaluating your profile.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg">
                <FileText className="text-gray-500" size={56} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No CV Uploaded</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Upload your CV to enable company matching and increase your opportunities
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Upload CV</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Accepted format: PDF (max 5MB)
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center space-x-3 shadow-sm">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="text-red-600" size={20} />
            </div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {uploading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full animate-pulse shadow-sm" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center font-medium">Uploading your CV...</p>
          </div>
        )}
      </div>

      <div className="card-elevated mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">CV Tips</h3>
        <ul className="space-y-4">
          <li className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-primary-100 rounded-lg mt-0.5">
              <span className="text-primary-600 font-bold">✓</span>
            </div>
            <span className="text-gray-700 leading-relaxed">Ensure your CV is up-to-date with your latest skills and experiences</span>
          </li>
          <li className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-primary-100 rounded-lg mt-0.5">
              <span className="text-primary-600 font-bold">✓</span>
            </div>
            <span className="text-gray-700 leading-relaxed">Include relevant projects and achievements</span>
          </li>
          <li className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-primary-100 rounded-lg mt-0.5">
              <span className="text-primary-600 font-bold">✓</span>
            </div>
            <span className="text-gray-700 leading-relaxed">Keep it concise and well-formatted (2-3 pages recommended)</span>
          </li>
          <li className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-primary-100 rounded-lg mt-0.5">
              <span className="text-primary-600 font-bold">✓</span>
            </div>
            <span className="text-gray-700 leading-relaxed">Your CV will be visible to matched companies</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CVPage;
