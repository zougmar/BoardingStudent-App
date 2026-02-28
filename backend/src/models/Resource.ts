import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['housing', 'language', 'integration', 'community'], required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
