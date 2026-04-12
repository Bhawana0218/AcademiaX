import express from 'express';
import User from "../models/User.js";

import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/logout', protect, logout);
router.post('/refresh', protect, refreshToken);

export default router;
