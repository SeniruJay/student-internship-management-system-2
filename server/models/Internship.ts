import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  duration: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

export const Internship = mongoose.model('Internship', internshipSchema);
