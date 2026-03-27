import express from 'express';
import { User } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/all', authenticate, async (req: AuthRequest, res) => {
  try {
    // Only allow lecturers or companies to see all users (you can modify this logic)
    if (req.user?.role !== 'lecturer' && req.user?.role !== 'company') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get users by role
router.get('/role/:role', authenticate, async (req: AuthRequest, res) => {
  try {
    const { role } = req.params;
    
    if (!['student', 'company', 'lecturer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const users = await User.find({ role })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (err) {
    console.error('Get users by role error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      roleStats: stats,
      recentUsers
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
