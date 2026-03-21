import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gpa: { type: Number },
  address: { type: String },
  year: { type: String },
  contact: { type: String },
  cvUrl: { type: String }, // Base64 string for simplicity
  additionalDetails: { type: String },
}, { timestamps: true });

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
