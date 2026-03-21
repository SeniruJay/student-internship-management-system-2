import express from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Application } from '../models/Application.js';
import { Report } from '../models/Report.js';
import { Viva } from '../models/Viva.js';

const router = express.Router();

// Students
router.get('/students', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const students = await StudentProfile.find().populate('user', 'name email');
    
    // Get their internship status
    const studentsWithStatus = await Promise.all(students.map(async (student) => {
      const app = await Application.findOne({ student: student.user._id, status: 'approved' })
        .populate('internship', 'title company')
        .populate({
          path: 'internship',
          populate: { path: 'company', select: 'name' }
        });
      
      return {
        ...student.toObject(),
        internship: app ? app.internship : null
      };
    }));

    res.json({ students: studentsWithStatus });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reports
router.get('/reports', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const reports = await Report.find()
      .populate('student', 'name email')
      .populate('company', 'name');
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Viva
router.post('/viva', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const { studentId, date, time, instructions } = req.body;
    const viva = new Viva({
      lecturer: req.user?.id,
      student: studentId,
      date, time, instructions
    });
    await viva.save();
    res.status(201).json({ viva });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/viva', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const vivas = await Viva.find({ lecturer: req.user?.id }).populate('student', 'name email');
    res.json({ vivas });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/viva/:id/grade', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const { grade } = req.body;
    const viva = await Viva.findById(req.params.id);
    
    if (!viva) {
      return res.status(404).json({ error: 'Viva not found' });
    }

    if (viva.lecturer.toString() !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    viva.grade = grade;
    await viva.save();
    res.json({ viva });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
