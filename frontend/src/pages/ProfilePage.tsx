// Import React hooks for managing local state and file input refs
import { useState, useRef } from 'react';
// Import global application context hook (provides student data and update function)
import { useApp } from '../context/AppContext';
// Import icons used throughout the profile UI
import { User, Mail, Phone, GraduationCap, Award, Heart, QrCode } from 'lucide-react';
// QR code component for sharing the profile
import QRCode from 'react-qr-code';

// Main page component that lets the student view and edit their profile
const ProfilePage = () => {
  // Get the current student object and updater from context
  const { student, updateStudent } = useApp();
  // Track whether the profile is currently in "edit" mode
  const [isEditing, setIsEditing] = useState(false);
  // Local state that mirrors the editable fields of the student profile
  const [formData, setFormData] = useState({
    // Basic personal info
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    phone: student?.phone || '',
    // Academic background
    degree: student?.academicBackground.degree || '',
    field: student?.academicBackground.field || '',
    university: student?.academicBackground.university || '',
    graduationYear: student?.academicBackground.graduationYear?.toString() || '',
    // Skills and interests as comma-separated strings for the form inputs
    skills: student?.skills.join(', ') || '',
    interests: student?.interests.join(', ') || '',
  });
  // Ref for the hidden file input used to upload a new avatar image
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  // Optional local error state for avatar upload issues
  const [avatarError, setAvatarError] = useState<string | null>(null);
  // Controls visibility of the profile QR code panel
  const [showQr, setShowQr] = useState(false);
  // Value encoded in the QR code (profile link with student id)
  const profileQrValue =
    typeof window !== 'undefined'
      ? `${window.location.origin}/profile?id=${student?.id ?? ''}`
      : `/profile?id=${student?.id ?? ''}`;

  // While student data is loading (null), show a spinner instead of the form
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Handle the main profile form submit (save profile changes)
  const handleSubmit = (e: React.FormEvent) => {
    // Prevent full page reload
    e.preventDefault();

    // Send updated profile information to context
    updateStudent({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      academicBackground: {
        degree: formData.degree,
        field: formData.field,
        university: formData.university,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
      },
      // Convert comma-separated text into arrays, trimming empty values
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
    });
    // Leave edit mode after saving successfully
    setIsEditing(false);
  };

  // Generic handler for all text/select inputs on the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle selecting a new avatar image from local files and store it
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation: allow only image files and keep size reasonable (e.g. 2MB)
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be smaller than 2MB');
      return;
    }

    setAvatarError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        // Store the base64 data URL in the student profile.
        // updateStudent will also persist it to localStorage.
        updateStudent({ avatarUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    // Main page container with width and entrance animation
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Page header: title and short description */}
      <div className="section-header">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Manage your personal information and academic background</p>
      </div>

      {/* Profile Completion Card: shows how complete the profile is */}
      <div className="card-elevated mb-8 bg-gradient-to-br from-primary-50/50 to-white border-primary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Completion</h2>
            <p className="text-sm text-gray-600">Complete your profile to increase your matching opportunities</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {student.profileCompletion}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${student.profileCompletion}%` }}
          />
        </div>
      </div>

      {/* Profile area: either shows edit form or read-only view */}
      <div className="card-elevated">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center border border-gray-200">
                <span className="text-lg font-semibold text-primary-700">
                  {student.firstName.charAt(0)}
                  {student.lastName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500 mt-1">Keep your profile up to date</p>
              <div className="mt-3 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-sm font-medium text-primary-700 hover:text-primary-800 underline underline-offset-2"
                >
                  Change photo
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              {avatarError && (
                <p className="mt-1 text-xs text-red-600">{avatarError}</p>
              )}
            </div>
          </div>
          <div className="relative flex items-center justify-end space-x-3 md:justify-normal">
            {/* QR code action icon, similar style to your example */}
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white text-stone-500 shadow-md hover:shadow-lg hover:scale-105 border border-gray-200 transition-transform"
              aria-label="Show profile QR code"
            >
              <QrCode size={18} />
            </button>
            {showQr && (
              <div className="absolute right-0 top-12 z-20 p-3 bg-white rounded-2xl border border-gray-200 shadow-lg">
                <div className="flex flex-col items-center space-y-2">
                  <QRCode value={profileQrValue} size={120} />
                  <p className="text-[10px] text-gray-500 text-center max-w-[160px]">
                    Scan to open this profile on another device.
                  </p>
                </div>
              </div>
            )}
            {/* Show "Edit Profile" button only when not already editing */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <User size={18} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <GraduationCap className="text-primary-600" size={24} />
                <span>Academic Background</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree Level *
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select degree</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University *
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="input-field"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skills & Interests</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., React, TypeScript, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Web Development, AI"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    phone: student.phone || '',
                    degree: student.academicBackground.degree,
                    field: student.academicBackground.field,
                    university: student.academicBackground.university,
                    graduationYear: student.academicBackground.graduationYear?.toString() || '',
                    skills: student.skills.join(', '),
                    interests: student.interests.join(', '),
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-primary-100 rounded-lg">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm"
                    />
                  ) : (
                    <User className="text-primary-600" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Mail className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{student.email}</p>
                </div>
              </div>
              {student.phone && (
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Phone className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{student.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <GraduationCap className="text-primary-600" size={24} />
                <span>Academic Background</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Degree</p>
                  <p className="font-medium">{student.academicBackground.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Field</p>
                  <p className="font-medium">{student.academicBackground.field}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">University</p>
                  <p className="font-medium">{student.academicBackground.university}</p>
                </div>
                {student.academicBackground.graduationYear && (
                  <div>
                    <p className="text-sm text-gray-500">Graduation Year</p>
                    <p className="font-medium">{student.academicBackground.graduationYear}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Award className="text-primary-600" size={24} />
                <span>Skills</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {student.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-xl text-sm font-semibold border border-primary-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Heart className="text-primary-600" size={24} />
                <span>Interests</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {student.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-xl text-sm font-semibold border border-purple-200 shadow-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
