import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, User, Mail, Plus, CheckCircle, XCircle } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';

const AppointmentsPage = () => {
  const { appointments, addAppointment } = useApp();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    advisorName: '',
    advisorEmail: '',
    date: '',
    time: '',
    duration: '30',
    type: 'consultation' as 'consultation' | 'follow-up' | 'support',
  });

  const upcomingAppointments = appointments.filter(apt => 
    isFuture(apt.date) && apt.status === 'scheduled'
  );
  const pastAppointments = appointments.filter(apt => 
    isPast(apt.date) || apt.status === 'completed'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [hours, minutes] = formData.time.split(':');
    const appointmentDate = new Date(formData.date);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));

    addAppointment({
      advisorName: formData.advisorName,
      advisorEmail: formData.advisorEmail,
      date: appointmentDate,
      duration: parseInt(formData.duration),
      type: formData.type,
      status: 'scheduled',
    });

    setFormData({
      advisorName: '',
      advisorEmail: '',
      date: '',
      time: '',
      duration: '30',
      type: 'consultation',
    });
    setShowBookingForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge badge-success">
            <CheckCircle size={14} />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-error">
            <XCircle size={14} />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="badge badge-info">
            Scheduled
          </span>
        );
    }
  };

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
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="section-header flex items-center justify-between">
        <div>
          <h1 className="section-title">Appointments</h1>
          <p className="section-subtitle">Schedule and manage your appointments with advisors</p>
        </div>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Book Appointment</span>
        </button>
      </div>

      {showBookingForm && (
        <div className="card-elevated mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advisor Name *
                </label>
                <input
                  type="text"
                  value={formData.advisorName}
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
                  value={formData.advisorEmail}
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
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
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
                  value={formData.time}
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
                  value={formData.duration}
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
                  value={formData.type}
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
            <div className="flex space-x-4 pt-4">
              <button type="submit" className="btn-primary">
                Book Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                        <h3 className="text-lg font-semibold mb-1">{getTypeLabel(appointment.type)}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{appointment.advisorName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Mail size={14} />
                            <span>{appointment.advisorEmail}</span>
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Calendar size={16} />
                        <span>{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
                      </span>
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Clock size={16} />
                        <span>
                          {format(appointment.date, 'h:mm a')} ({appointment.duration} min)
                        </span>
                      </span>
                    </div>
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
                        <h3 className="text-lg font-semibold mb-1">{getTypeLabel(appointment.type)}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{appointment.advisorName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Mail size={14} />
                            <span>{appointment.advisorEmail}</span>
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Calendar size={16} />
                        <span>{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
                      </span>
                      <span className="flex items-center space-x-2 text-gray-700">
                        <Clock size={16} />
                        <span>
                          {format(appointment.date, 'h:mm a')} ({appointment.duration} min)
                        </span>
                      </span>
                    </div>
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

      {appointments.length === 0 && !showBookingForm && (
        <div className="card text-center py-12">
          <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No Appointments</h3>
          <p className="text-gray-600 mb-4">
            Book your first appointment with an advisor to get started
          </p>
          <button
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

export default AppointmentsPage;
