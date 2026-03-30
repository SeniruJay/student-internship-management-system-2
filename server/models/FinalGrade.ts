import mongoose from 'mongoose';

const finalGradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendance: { type: Number, required: true, min: 0, max: 100 },
  vivaMarks: { type: Number, required: true, min: 0, max: 100 },
  reportMarks: { type: Number, required: true, min: 0, max: 100 },
  companyReview: { type: Number, required: true, min: 0, max: 100 },
  finalScore: { type: Number, required: true },
  finalGrade: { type: String, required: true },
  gradedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const FinalGrade = mongoose.model('FinalGrade', finalGradeSchema);
