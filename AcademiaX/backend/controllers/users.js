import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

//    Get all users (admin only)

export const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const users = await User.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-password');

  // Get total count for pagination
  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

//   Get single user by ID

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// @desc    Create new user (admin only)
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User with this email already exists'
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'teacher'
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: user.profile
    }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, avatar } = req.body;
  const userId = req.params.id;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email, role, isActive, avatar },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser.profile
    }
  });
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete your own account'
    });
  }

  // Soft delete by setting isActive to false
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully'
  });
});

// @desc    Reset user password (admin only)
// @route   PUT /api/users/:id/reset-password
// @access  Private (Admin)
export const resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin)
export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });

  // Users by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentRegistrations = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Users with recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const activeRecently = await User.countDocuments({
    isActive: true,
    lastLogin: { $gte: sevenDaysAgo }
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
      recentRegistrations,
      activeRecently
    }
  });
});
