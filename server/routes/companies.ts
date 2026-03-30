import express from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { Internship } from '../models/Internship.js';
import { Application } from '../models/Application.js';
import { Report } from '../models/Report.js';
import { StudentProfile } from '../models/StudentProfile.js';

const router = express.Router();

// Internships
router.post('/internships', authenticate, authorize(['company']), async (req: AuthRequest, res) => {
  try {
    const { title, description, requirements, duration, deadline } = req.body;
    const internship = new Internship({
      company: req.user?.id,
      title, description, requirements, duration, deadline
    });
    await internship.save();
    res.status(201).json({ internship });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/internships', authenticate, authorize(['company']), async (req: AuthRequest, res) => {
  try {
    const internships = await Internship.find({ company: req.user?.id });
    res.json({ internships });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Applications
router.get('/applications', authenticate, authorize(['company']), async (req: AuthRequest, res) => {
  try {
    const internships = await Internship.find({ company: req.user?.id }).select('_id');
    const internshipIds = internships.map(i => i._id);

    const applications = await Application.find({ internship: { $in: internshipIds } })
      .populate('student', 'name email')
      .populate('internship', 'title');
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/applications/:id/status', authenticate, authorize(['company']), async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('internship');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // @ts-ignore
    if (application.internship.company.toString() !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    res.json({ application });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reports
router.post('/reports', authenticate, authorize(['company']), async (req: AuthRequest, res) => {
  try {
    const { studentId, weekNumber, content } = req.body;
    const report = new Report({
      student: studentId,
      company: req.user?.id,
      type: 'weekly',
      weekNumber,
      content
    });
    await report.save();
    res.status(201).json({ report });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Available Students
router.get('/students', authenticate, authorize(['company']), async (req: AuthRequest, res) => {
  try {
    // Find students who don't have an approved application
    const approvedApps = await Application.find({ status: 'approved' }).select('student');
    const approvedStudentIds = approvedApps.map(app => app.student);

    const availableStudents = await StudentProfile.find({ user: { $nin: approvedStudentIds } })
      .populate('user', 'name email');
    
    res.json({ students: availableStudents });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
