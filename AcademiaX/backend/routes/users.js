import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserStats
} from '../controllers/users.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateMongoId,
  validatePagination
} from '../middleware/validation.js';

const router = express.Router();


// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', validatePagination, getUsers);
router.get('/stats', getUserStats);
router.get('/:id', validateMongoId('id'), getUser);
router.post('/', validateUserRegistration, createUser);
router.put('/:id', validateMongoId('id'), updateUser);
router.delete('/:id', validateMongoId('id'), deleteUser);
router.put('/:id/reset-password', validateMongoId('id'), resetUserPassword);

export default router;
