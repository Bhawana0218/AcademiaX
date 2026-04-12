import User from '../models/User.js';
import { generateToken, createTokenPayload } from '../utils/jwt.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User with this email already exists'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'teacher'
  });

  // Generate token
  const tokenPayload = createTokenPayload(user);
  const token = generateToken(tokenPayload);

  // Update last login
  await user.updateLastLogin();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.profile,
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Account has been deactivated'
    });
  }

  // Generate token
  const tokenPayload = createTokenPayload(user);
  const token = generateToken(tokenPayload);

  // Update last login
  await user.updateLastLogin();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.profile,
      token
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: user.profile
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const userId = req.user.id;

  // Check if email is being changed and if it already exists
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, avatar },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.profile
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Get user with password
  const user = await User.findById(userId).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
export const refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Account has been deactivated'
    });
  }

  // Generate new token
  const tokenPayload = createTokenPayload(user);
  const token = generateToken(tokenPayload);

  res.status(200).json({
    success: true,
    data: {
      token
    }
  });
});
