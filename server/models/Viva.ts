import mongoose from 'mongoose';

const vivaSchema = new mongoose.Schema({
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  instructions: { type: String, required: true },
  grade: { type: String },
}, { timestamps: true });

export const Viva = mongoose.model('Viva', vivaSchema);
