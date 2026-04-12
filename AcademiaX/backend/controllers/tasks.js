import Task from '../models/Task.js';
import Student from '../models/Student.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    priority,
    category,
    assignedTo,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (category) {
    query.category = category;
  }

  if (assignedTo) {
    query.assignedTo = assignedTo;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const tasks = await Task.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('assignedTo', 'firstName lastName email studentId')
    .populate('assignedBy', 'name email');

  const total = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});


export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName email studentId grade section')
    .populate('assignedBy', 'name email')
    .populate('submission.submittedBy', 'firstName lastName email')
    .populate('submission.gradedBy', 'name email');

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      task
    }
  });
});


export const createTask = asyncHandler(async (req, res) => {
  const taskData = {
    ...req.body,
    assignedBy: req.user.id
  };

  // Verify student exists
  const student = await Student.findById(taskData.assignedTo);
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Assigned student not found'
    });
  }

  const task = await Task.create(taskData);

  // Populate references for response
  await task.populate('assignedTo', 'firstName lastName email studentId');
  await task.populate('assignedBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task
    }
  });
});


export const updateTask = asyncHandler(async (req, res) => {
  const taskData = req.body;
  const taskId = req.params.id;

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  // Verify assigned student exists if being updated
  if (taskData.assignedTo) {
    const student = await Student.findById(taskData.assignedTo);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Assigned student not found'
      });
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    taskData,
    { new: true, runValidators: true }
  )
    .populate('assignedTo', 'firstName lastName email studentId')
    .populate('assignedBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task: updatedTask
    }
  });
});


export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  // Soft delete by setting isActive to false
  task.isActive = false;
  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});


export const submitTask = asyncHandler(async (req, res) => {
  const { content, attachments } = req.body;
  const taskId = req.params.id;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  if (task.status === 'completed') {
    return res.status(400).json({
      success: false,
      error: 'Task is already completed'
    });
  }

  // Update submission
  task.submission = {
    submittedAt: new Date(),
    submittedBy: task.assignedTo, // In real app, this would be the logged-in student
    content,
    attachments: attachments || []
  };

  task.status = 'completed';
  task.completedAt = new Date();

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task submitted successfully',
    data: {
      task
    }
  });
});


export const gradeTask = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const taskId = req.params.id;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  if (!task.submission || !task.submission.submittedAt) {
    return res.status(400).json({
      success: false,
      error: 'Task has not been submitted yet'
    });
  }

  // Update grade
  task.submission.grade = grade;
  task.submission.feedback = feedback;
  task.submission.gradedAt = new Date();
  task.submission.gradedBy = req.user.id;

  await task.save();

  // Populate for response
  await task.populate('submission.gradedBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Task graded successfully',
    data: {
      task
    }
  });
});


export const getTaskStats = asyncHandler(async (req, res) => {
  const totalTasks = await Task.countDocuments({ isActive: true });

  // Tasks by status
  const tasksByStatus = await Task.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Tasks by priority
  const tasksByPriority = await Task.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  // Tasks by category
  const tasksByCategory = await Task.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Overdue tasks
  const overdueTasks = await Task.countDocuments({
    isActive: true,
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() }
  });

  // Tasks due in next 7 days
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const upcomingTasks = await Task.countDocuments({
    isActive: true,
    status: { $ne: 'completed' },
    dueDate: { $gte: new Date(), $lte: sevenDaysFromNow }
  });

  // Completion rate
  const completedTasks = await Task.countDocuments({
    isActive: true,
    status: 'completed'
  });

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  res.status(200).json({
    success: true,
    data: {
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      tasksByCategory,
      overdueTasks,
      upcomingTasks,
      completionRate: Math.round(completionRate * 100) / 100
    }
  });
});


export const getStudentTasks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    sortBy = 'dueDate',
    sortOrder = 'asc'
  } = req.query;

  // Verify student exists
  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }

  // Build query
  const query = { 
    assignedTo: studentId,
    isActive: true
  };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  // Sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const tasks = await Task.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('assignedBy', 'name email');

  // Get total count for pagination
  const total = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      student,
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});


export const exportTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ isActive: true })
    .populate('assignedTo', 'firstName lastName email studentId')
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });

  // Convert to CSV format
  const csvHeader = 'Title,Student,Student ID,Status,Priority,Category,Due Date,Created By,Created At,Completed At\n';
  
  const csvData = tasks.map(task => {
    return [
      `"${task.title}"`,
      task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : '',
      task.assignedTo ? task.assignedTo.studentId : '',
      task.status,
      task.priority,
      task.category,
      task.dueDate.toISOString().split('T')[0],
      task.assignedBy ? task.assignedBy.name : '',
      task.createdAt.toISOString().split('T')[0],
      task.completedAt ? task.completedAt.toISOString().split('T')[0] : ''
    ].join(',');
  }).join('\n');

  const csv = csvHeader + csvData;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=tasks_export.csv');
  
  res.status(200).send(csv);
});
