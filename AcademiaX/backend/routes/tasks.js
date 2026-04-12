import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  submitTask,
  gradeTask,
  getTaskStats,
  getStudentTasks,
  exportTasks
} from '../controllers/tasks.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateTaskCreation,
  validateTaskUpdate,
  validateMongoId,
  validatePagination
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/', validatePagination, getTasks);
router.get('/stats/overview', getTaskStats);
router.get('/export', authorize('admin', 'teacher'), exportTasks);
router.get('/student/:studentId', validateMongoId('studentId'), getStudentTasks);
router.get('/:id', validateMongoId('id'), getTask);
router.post('/', authorize('admin', 'teacher'), validateTaskCreation, createTask);
router.put('/:id', validateMongoId('id'), validateTaskUpdate, updateTask);
router.delete('/:id', authorize('admin', 'teacher'), validateMongoId('id'), deleteTask);
router.post('/:id/submit', validateMongoId('id'), submitTask);
router.put('/:id/grade', authorize('admin', 'teacher'), validateMongoId('id'), gradeTask);

export default router;
