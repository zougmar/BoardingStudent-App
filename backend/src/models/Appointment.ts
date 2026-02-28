import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  advisorName: { type: String, required: true },
  advisorEmail: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  type: { type: String, enum: ['consultation', 'follow-up', 'support'], required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String },
});

export default mongoose.model('Appointment', appointmentSchema);
