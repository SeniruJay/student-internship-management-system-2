import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  cvUrl: { type: String, required: true }, // Base64 string for simplicity
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);
