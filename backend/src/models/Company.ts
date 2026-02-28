import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  logo: { type: String },
  matchScore: { type: Number, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
});

export default mongoose.model('Company', companySchema);
