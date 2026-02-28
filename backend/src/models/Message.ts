import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  recipientId: { type: String, required: true },
  recipientName: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
