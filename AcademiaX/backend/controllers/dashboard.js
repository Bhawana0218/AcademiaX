import Student from '../models/Student.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';


export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get basic counts
  const totalStudents = await Student.countDocuments({ isActive: true });
  const totalTasks = await Task.countDocuments({ isActive: true });
  const completedTasks = await Task.countDocuments({ 
    isActive: true, 
    status: 'completed' 
  });
  const pendingTasks = await Task.countDocuments({ 
    isActive: true, 
    status: 'pending' 
  });

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get overdue tasks count
  const overdueTasks = await Task.countDocuments({
    isActive: true,
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() }
  });

  // Get tasks due this week
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const tasksDueThisWeek = await Task.countDocuments({
    isActive: true,
    status: { $ne: 'completed' },
    dueDate: { $gte: startOfWeek, $lte: endOfWeek }
  });

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTasks = await Task.find({
    isActive: true,
    createdAt: { $gte: sevenDaysAgo }
  })
    .populate('assignedTo', 'firstName lastName')
    .populate('assignedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  const recentStudents = await Student.find({
    isActive: true,
    enrollmentDate: { $gte: sevenDaysAgo }
  })
    .sort({ enrollmentDate: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalStudents,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        tasksDueThisWeek,
        completionRate: Math.round(completionRate * 100) / 100
      },
      recentActivity: {
        recentTasks,
        recentStudents
      }
    }
  });
});


export const getTaskStatusDistribution = asyncHandler(async (req, res) => {
  const distribution = await Task.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format for chart
  const formattedData = distribution.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1).replace('_', ' '),
    value: item.count,
    status: item._id
  }));

  res.status(200).json({
    success: true,
    data: formattedData
  });
});


export const getTaskPriorityDistribution = asyncHandler(async (req, res) => {
  const distribution = await Task.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format for chart
  const formattedData = distribution.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    priority: item._id
  }));

  res.status(200).json({
    success: true,
    data: formattedData
  });
});

//    Get student distribution by grade

export const getStudentGradeDistribution = asyncHandler(async (req, res) => {
  const distribution = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format for chart
  const formattedData = distribution.map(item => ({
    grade: `Grade ${item._id}`,
    count: item.count
  }));

  res.status(200).json({
    success: true,
    data: formattedData
  });
});

//     Get monthly task completion trend

export const getTaskCompletionTrend = asyncHandler(async (req, res) => {
  const months = 6; // Last 6 months
  const monthlyData = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const completed = await Task.countDocuments({
      isActive: true,
      status: 'completed',
      completedAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const created = await Task.countDocuments({
      isActive: true,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    monthlyData.push({
      month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      completed,
      created
    });
  }

  res.status(200).json({
    success: true,
    data: monthlyData
  });
});

//   Get top performers (students with most completed tasks)

export const getTopPerformers = asyncHandler(async (req, res) => {
  const topPerformers = await Task.aggregate([
    { $match: { isActive: true, status: 'completed' } },
    {
      $group: {
        _id: '$assignedTo',
        completedTasks: { $sum: 1 },
        avgGrade: { $avg: '$submission.grade' }
      }
    },
    { $sort: { completedTasks: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'students',
        localField: '_id',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $project: {
        studentName: { $concat: ['$student.firstName', ' ', '$student.lastName'] },
        studentId: '$student.studentId',
        grade: '$student.grade',
        completedTasks: 1,
        avgGrade: { $round: ['$avgGrade', 2] }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: topPerformers
  });
});

//     Get upcoming deadlines

export const getUpcomingDeadlines = asyncHandler(async (req, res) => {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const upcomingTasks = await Task.find({
    isActive: true,
    status: { $ne: 'completed' },
    dueDate: { $gte: new Date(), $lte: sevenDaysFromNow }
  })
    .populate('assignedTo', 'firstName lastName studentId')
    .populate('assignedBy', 'name')
    .sort({ dueDate: 1 })
    .limit(20);

  res.status(200).json({
    success: true,
    data: upcomingTasks
  });
});

//   Get activity feed

export const getActivityFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  // Get recent tasks
  const recentTasks = await Task.find({ isActive: true })
    .populate('assignedTo', 'firstName lastName')
    .populate('assignedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit);

  // Get recent students
  const recentStudents = await Student.find({ isActive: true })
    .sort({ enrollmentDate: -1 })
    .limit(limit);

  // Combine and format activities
  const activities = [];

  recentTasks.forEach(task => {
    activities.push({
      id: `task-${task._id}`,
      type: 'task',
      action: task.status === 'completed' ? 'completed' : 'created',
      title: task.title,
      description: `Task "${task.title}" was ${task.status === 'completed' ? 'completed' : 'assigned'} to ${task.assignedTo ? task.assignedTo.firstName + ' ' + task.assignedTo.lastName : 'Unknown'}`,
      user: task.assignedBy?.name || 'System',
      timestamp: task.createdAt,
      priority: task.priority,
      status: task.status
    });
  });

  recentStudents.forEach(student => {
    activities.push({
      id: `student-${student._id}`,
      type: 'student',
      action: 'enrolled',
      title: `${student.firstName} ${student.lastName}`,
      description: `New student ${student.firstName} ${student.lastName} enrolled in Grade ${student.grade}`,
      user: 'System',
      timestamp: student.enrollmentDate,
      grade: student.grade
    });
  });

  // Sort by timestamp and paginate
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedActivities = activities.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    data: {
      activities: paginatedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    }
  });
});
