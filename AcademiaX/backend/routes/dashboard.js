import express from 'express';
import {
  getDashboardStats,
  getTaskStatusDistribution,
  getTaskPriorityDistribution,
  getStudentGradeDistribution,
  getTaskCompletionTrend,
  getTopPerformers,
  getUpcomingDeadlines,
  getActivityFeed
} from '../controllers/dashboard.js';
import { protect } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/stats', getDashboardStats);
router.get('/tasks/status', getTaskStatusDistribution);
router.get('/tasks/priority', getTaskPriorityDistribution);
router.get('/students/grades', getStudentGradeDistribution);
router.get('/tasks/trend', getTaskCompletionTrend);
router.get('/students/top-performers', getTopPerformers);
router.get('/tasks/upcoming-deadlines', getUpcomingDeadlines);
router.get('/activity', validatePagination, getActivityFeed);

export default router;
