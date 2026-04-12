import express from 'express';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
  exportStudents
} from '../controllers/students.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateStudentCreation,
  validateStudentUpdate,
  validateMongoId,
  validatePagination
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/', validatePagination, getStudents);
router.get('/stats/overview', getStudentStats);
router.get('/export', authorize('admin', 'teacher'), exportStudents);
router.get('/:id', validateMongoId('id'), getStudent);
router.post('/', authorize('admin', 'teacher'), validateStudentCreation, createStudent);
router.put('/:id', authorize('admin', 'teacher'), validateMongoId('id'), validateStudentUpdate, updateStudent);
router.delete('/:id', authorize('admin'), validateMongoId('id'), deleteStudent);

export default router;
