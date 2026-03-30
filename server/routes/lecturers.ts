import express from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Application } from '../models/Application.js';
import { Report } from '../models/Report.js';
import { Viva } from '../models/Viva.js';
import { FinalGrade } from '../models/FinalGrade.js';

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

// Final Grading
router.post('/final-grade/:studentId', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const { attendance, vivaMarks, reportMarks, companyReview, finalScore, finalGrade } = req.body;
    const studentId = req.params.studentId;
    
    // Check if already graded
    const existingGrade = await FinalGrade.findOne({ student: studentId });
    if (existingGrade) {
      return res.status(400).json({ error: 'Student has already been graded' });
    }
    
    // Create final grade record
    const finalGradeRecord = new FinalGrade({
      student: studentId,
      lecturer: req.user?.id,
      attendance,
      vivaMarks,
      reportMarks,
      companyReview,
      finalScore,
      finalGrade
    });
    
    await finalGradeRecord.save();
    
    res.status(201).json({ 
      message: 'Final grade submitted successfully',
      finalGrade: finalGradeRecord 
    });
  } catch (err) {
    console.error('Final grading error:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get final grades for students
router.get('/final-grades', authenticate, authorize(['lecturer']), async (req: AuthRequest, res) => {
  try {
    const finalGrades = await FinalGrade.find()
      .populate('student', 'name email')
      .populate('lecturer', 'name');
    
    res.json({ finalGrades });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
