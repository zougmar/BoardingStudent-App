import mongoose from 'mongoose';

const academicBackgroundSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  university: { type: String, default: '' },
  graduationYear: { type: Number },
}, { _id: false });

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    avatarUrl: { type: String },
    academicBackground: { type: academicBackgroundSchema, default: () => ({}) },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    profileCompletion: { type: Number, default: 0 },
    cvUrl: { type: String },
    journeyStatus: { type: String, enum: ['profile', 'matching', 'internship', 'integration'], default: 'profile' },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
