import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, only for weekly reports
  type: { type: String, enum: ['weekly', 'final'], required: true },
  weekNumber: { type: Number },
  content: { type: String, required: true },
  fileUrl: { type: String }, // Base64 string for simplicity
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
