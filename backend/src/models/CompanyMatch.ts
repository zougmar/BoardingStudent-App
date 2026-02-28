import mongoose from 'mongoose';

const companyMatchSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  matchStatus: {
    type: String,
    enum: ['pending', 'matched', 'rejected', 'accepted'],
    default: 'pending',
  },
}, { timestamps: true });

companyMatchSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

export default mongoose.model('CompanyMatch', companyMatchSchema);
