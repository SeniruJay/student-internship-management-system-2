import express from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Internship } from '../models/Internship.js';
import { Application } from '../models/Application.js';
import { Report } from '../models/Report.js';
import { Viva } from '../models/Viva.js';

const router = express.Router();

// Profile
router.get('/profile', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user?.id }).populate('user', 'name email');
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/profile', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const { gpa, address, year, contact, cvUrl, additionalDetails } = req.body;
    let profile = await StudentProfile.findOne({ user: req.user?.id });
    
    const parsedGpa = (gpa !== undefined && gpa !== null && gpa !== '') ? parseFloat(gpa) : undefined;
    const finalGpa = (parsedGpa !== undefined && !isNaN(parsedGpa)) ? parsedGpa : undefined;

    if (profile) {
      profile.gpa = finalGpa;
      profile.address = address;
      profile.year = year;
      profile.contact = contact;
      profile.cvUrl = cvUrl;
      profile.additionalDetails = additionalDetails;
      await profile.save();
    } else {
      profile = new StudentProfile({
        user: req.user?.id,
        gpa: finalGpa, address, year, contact, cvUrl, additionalDetails
      });
      await profile.save();
    }
    res.json({ profile });
  } catch (err) {
    console.error('Profile save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Internships
router.get('/internships', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const internships = await Internship.find({ status: 'open' }).populate('company', 'name email');
    res.json({ internships });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Applications
router.post('/applications', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const { internshipId, cvUrl } = req.body;
    
    const existingApp = await Application.findOne({ student: req.user?.id, internship: internshipId });
    if (existingApp) {
      return res.status(400).json({ error: 'Already applied to this internship' });
    }

    const application = new Application({
      student: req.user?.id,
      internship: internshipId,
      cvUrl
    });
    await application.save();
    res.status(201).json({ application });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/applications', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const applications = await Application.find({ student: req.user?.id })
      .populate({
        path: 'internship',
        populate: { path: 'company', select: 'name email' }
      });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reports
router.post('/reports', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const { content, fileUrl } = req.body;
    const report = new Report({
      student: req.user?.id,
      type: 'final',
      content,
      fileUrl
    });
    await report.save();
    res.status(201).json({ report });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Viva
router.get('/viva', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const vivas = await Viva.find({ student: req.user?.id }).populate('lecturer', 'name');
    res.json({ vivas });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
