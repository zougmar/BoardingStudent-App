import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'company'], default: 'student' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
