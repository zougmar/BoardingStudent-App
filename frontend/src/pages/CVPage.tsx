// Import React hooks: local state and ref to the hidden file input
import { useState, useRef } from 'react';
// Import global app context to access student data and CV upload function
import { useApp } from '../context/AppContext';
// Icons used in the CV management UI
import { FileText, Upload, Check, X, Download, Eye } from 'lucide-react';

// Page responsible for uploading, replacing and viewing CV status
const CVPage = () => {
  // Get current student object and uploadCV helper from context
  const { student, uploadCV } = useApp();
  // Whether a CV upload is currently in progress
  const [uploading, setUploading] = useState(false);
  // Error message shown when validation or upload fails
  const [error, setError] = useState<string | null>(null);
  // Ref to the hidden file input so we can trigger it from buttons
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show a loading state while student data is not ready
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

  // Handle file selection from the hidden input
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Take the first selected file (if any)
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - only accept PDFs
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
      // Delegate the actual upload logic to context (could call real API later)
      await uploadCV(file);
    } catch (err) {
      setError('Failed to upload CV. Please try again.');
    } finally {
      setUploading(false);
      // Reset input value so the same file can be chosen again later if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Click handler for the "Replace CV" button - opens hidden file input
  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  // Download the current CV using the stored URL (mock in this app)
  const handleDownload = () => {
    if (student.cvUrl) {
      const link = document.createElement('a');
      link.href = student.cvUrl;
      link.download = 'CV.pdf';
      link.click();
    }
  };

  return (
    // Page container with max width and entrance animation
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="section-header">
        <h1 className="section-title">CV Management</h1>
        <p className="section-subtitle">Upload and manage your CV for company matching</p>
      </div>

      <div className="card-elevated">
        {/* Shared hidden file input used for both upload and replace actions */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* If a CV is already uploaded, show success state and actions */}
        {student.cvUrl ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-md">
                  <Check className="text-emerald-700" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">CV Uploaded</h3>
                  <p className="text-sm text-gray-600">Your CV is connected to the matching process</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <button
                  // Download existing CV
                  onClick={handleDownload}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
                <button
                  // Open the PDF in a new browser tab for viewing
                  onClick={() => student.cvUrl && window.open(student.cvUrl, '_blank')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Eye size={18} />
                  <span>View</span>
                </button>
                <button
                  // Open file picker to replace CV
                  onClick={handleReplace}
                  className="btn-primary flex items-center space-x-2"
                  disabled={uploading}
                >
                  <Upload size={18} />
                  <span>Replace CV</span>
                </button>
              </div>
            </div>

            {/* Information panel explaining CV usage */}
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
          // If no CV yet, show an empty-state encouraging upload
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
            <button
              // Trigger hidden file input when user clicks primary button
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

        {/* Error alert box displayed when something goes wrong */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center space-x-3 shadow-sm">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="text-red-600" size={20} />
            </div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Optional progress bar to visualize upload process */}
        {uploading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full animate-pulse shadow-sm" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center font-medium">Uploading your CV...</p>
          </div>
        )}
      </div>

      {/* Static tips to help student improve their CV */}
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
