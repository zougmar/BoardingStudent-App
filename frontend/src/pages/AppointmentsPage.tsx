// Import React hook to manage local state inside this component
import { useState } from 'react';
// Import global application context (provides appointments data and actions)
import { useApp } from '../context/AppContext';
// Import icon components used in the UI
import { Calendar, Clock, User, Mail, Plus, CheckCircle, XCircle } from 'lucide-react';
// Import date utility helpers for formatting and checking past/future dates
import { format, isPast, isFuture } from 'date-fns';

// Main page component responsible for displaying and booking appointments
const AppointmentsPage = () => {
  // Get the list of appointments and the function to add a new one from context
  const { appointments, addAppointment } = useApp();

  // Controls whether the booking form is visible or hidden
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Local state for all the fields in the booking form
  const [formData, setFormData] = useState({
    advisorName: '', // Advisor full name
    advisorEmail: '', // Advisor contact email
    date: '', // Selected appointment date (YYYY-MM-DD string)
    time: '', // Selected appointment time (HH:MM string)
    duration: '30', // Duration in minutes, stored as string for the select input
    // Type of the appointment; union type limits it to three allowed values
    type: 'consultation' as 'consultation' | 'follow-up' | 'support',
  });

  // Compute all upcoming (future) appointments that are still scheduled
  const upcomingAppointments = appointments.filter(apt =>
    isFuture(apt.date) && apt.status === 'scheduled'
  );

  // Compute all past or already completed appointments
  const pastAppointments = appointments.filter(apt =>
    isPast(apt.date) || apt.status === 'completed'
  );

  // Handle the submit event when the user confirms the booking form
  const handleSubmit = (e: React.FormEvent) => {
    // Prevent the default browser form submission (page reload)
    e.preventDefault();

    // Split the "HH:MM" time string into hours and minutes
    const [hours, minutes] = formData.time.split(':');

    // Create a Date object from the selected date string
    const appointmentDate = new Date(formData.date);
    // Apply the selected time (hours and minutes) to that date
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));

    // Create a new appointment using the context function
    addAppointment({
      advisorName: formData.advisorName, // stored from text input
      advisorEmail: formData.advisorEmail, // stored from email input
      date: appointmentDate, // full Date object with date + time
      duration: parseInt(formData.duration), // convert duration string to number
      type: formData.type, // one of: consultation, follow-up, support
      status: 'scheduled', // new appointments are always created as scheduled
    });

    // Reset the form back to its initial empty state
    setFormData({
      advisorName: '',
      advisorEmail: '',
      date: '',
      time: '',
      duration: '30',
      type: 'consultation', // back to default type
    });
    // Hide the booking form after a successful submission
    setShowBookingForm(false);
  };

  // Return a small badge element depending on the appointment status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          // Green badge with icon for completed appointments
          <span className="badge badge-success">
            <CheckCircle size={14} />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          // Red badge for cancelled appointments
          <span className="badge badge-error">
            <XCircle size={14} />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          // Default info badge for scheduled appointments
          <span className="badge badge-info">
            Scheduled
          </span>
        );
    }
  };

  // Human-readable label for the appointment type
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'follow-up':
        return 'Follow-up';
      case 'support':
        return 'Support';
      default:
        return type;
    }
  };

  return (
    // Main container that centers the content and applies a fade-in animation
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header section with title, subtitle and "Book Appointment" button */}
      <div className="section-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Appointments</h1>
          <p className="section-subtitle">Schedule and manage your appointments with advisors</p>
        </div>
        <button
          // Toggle the booking form when the button is clicked
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Plus size={18} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Booking form section - only visible when showBookingForm is true */}
      {showBookingForm && (
        <div className="card-elevated mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h2>
          {/* Form captures all appointment details and calls handleSubmit on submit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Use a responsive grid: one column on mobile, two on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advisor Name *
                </label>
                <input
                  type="text"
                  // Bind input value to advisorName in state
                  value={formData.advisorName}
                  // Update only advisorName, keep the rest of formData unchanged
                  onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advisor Email *
                </label>
                <input
                  type="email"
                  // Bind input value to advisorEmail in state
                  value={formData.advisorEmail}
                  // Update only advisorEmail
                  onChange={(e) => setFormData({ ...formData, advisorEmail: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  // Bind selected date string (YYYY-MM-DD)
                  value={formData.date}
                  // Update date field in state
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  // Prevent booking in the past by setting minimum allowed date
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  // Bind selected time string (HH:MM)
                  value={formData.time}
                  // Update time field in state
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <select
                  // Selected duration option (stored as string)
                  value={formData.duration}
                  // Update duration in state when user chooses an option
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  // Selected type of appointment
                  value={formData.type}
                  // Cast to "any" here to satisfy TypeScript for the union type
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input-field"
                  required
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              {/* Submit button to create the new appointment */}
              <button type="submit" className="btn-primary">
                Book Appointment
              </button>
              <button
                type="button"
                // Close the form without saving when user clicks cancel
                onClick={() => setShowBookingForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section for upcoming (future) appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Appointments</h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="card-elevated hover:shadow-large transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {/* Appointment type as the main title (e.g. Consultation) */}
                        <h3 className="text-lg font-semibold mb-1">{getTypeLabel(appointment.type)}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {/* Advisor name with user icon */}
                          <span className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{appointment.advisorName}</span>
                          </span>
                          {/* Advisor email with mail icon */}
                          <span className="flex items-center space-x-1">
                            <Mail size={14} />
                            <span>{appointment.advisorEmail}</span>
                          </span>
                        </div>
                      </div>
                      {/* Visual status indicator (Scheduled / Completed / Cancelled) */}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {/* Date row with calendar icon */}
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Calendar size={16} />
                        <span>{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
                      </span>
                      {/* Time + duration row with clock icon */}
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Clock size={16} />
                        <span>
                          {format(appointment.date, 'h:mm a')} ({appointment.duration} min)
                        </span>
                      </span>
                    </div>
                    {/* Optional notes about the appointment, shown only if they exist */}
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section for past or completed appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Appointments</h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="card opacity-75 hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {/* Appointment type for past entries */}
                        <h3 className="text-lg font-semibold mb-1">{getTypeLabel(appointment.type)}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {/* Advisor name */}
                          <span className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{appointment.advisorName}</span>
                          </span>
                          {/* Advisor email */}
                          <span className="flex items-center space-x-1">
                            <Mail size={14} />
                            <span>{appointment.advisorEmail}</span>
                          </span>
                        </div>
                      </div>
                      {/* Status badge (usually Completed or Cancelled for past) */}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {/* Date information */}
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Calendar size={16} />
                        <span>{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
                      </span>
                      {/* Time and duration information */}
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Clock size={16} />
                        <span>
                          {format(appointment.date, 'h:mm a')} ({appointment.duration} min)
                        </span>
                      </span>
                    </div>
                    {/* Optional notes for the past appointment */}
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when there are no appointments and the form is hidden */}
      {appointments.length === 0 && !showBookingForm && (
        <div className="card text-center py-12">
          <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No Appointments</h3>
          <p className="text-gray-600 mb-4">
            Book your first appointment with an advisor to get started
          </p>
          <button
            // When user clicks this button, show the booking form
            onClick={() => setShowBookingForm(true)}
            className="btn-primary"
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
};

// Export AppointmentsPage as the default export so it can be used in the router
export default AppointmentsPage;
