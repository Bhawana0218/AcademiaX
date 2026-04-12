import Student from '../models/Student.js';
import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

//   Get all students with pagination and filtering

export const getStudents = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    grade,
    section,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Search functionality
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by grade
  if (grade) {
    query.grade = grade;
  }

  // Filter by section
  if (section) {
    query.section = section;
  }

  // Sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const students = await Student.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('taskStats');

  // Get total count for pagination
  const total = await Student.countDocuments(query);

  // Get task statistics for each student
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const taskStats = await Task.aggregate([
        { $match: { assignedTo: student._id, isActive: true } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const stats = {
        total: taskStats.reduce((sum, stat) => sum + stat.count, 0),
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0
      };

      taskStats.forEach(stat => {
        stats[stat._id] = stat.count;
      });

      return {
        ...student.toObject(),
        taskStats: stats
      };
    })
  );

  res.status(200).json({
    success: true,
    data: {
      students: studentsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

//   Get single student by ID

export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }

  // Get student's tasks
  const tasks = await Task.find({ assignedTo: student._id, isActive: true })
    .sort({ createdAt: -1 })
    .populate('assignedBy', 'name email');

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    in_progress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    overdue: tasks.filter(task => task.status === 'overdue').length
  };

  res.status(200).json({
    success: true,
    data: {
      student,
      tasks,
      taskStats
    }
  });
});

//    Create new student

export const createStudent = asyncHandler(async (req, res) => {
  const studentData = req.body;

  // Check if student with email already exists
  const existingStudent = await Student.findOne({ email: studentData.email });
  if (existingStudent) {
    return res.status(400).json({
      success: false,
      error: 'Student with this email already exists'
    });
  }

  // Check if student ID already exists
  const existingStudentId = await Student.findOne({ studentId: studentData.studentId });
  if (existingStudentId) {
    return res.status(400).json({
      success: false,
      error: 'Student ID already exists'
    });
  }

  const student = await Student.create(studentData);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: {
      student
    }
  });
});

//    Update student

export const updateStudent = asyncHandler(async (req, res) => {
  const studentData = req.body;
  const studentId = req.params.id;

  // Check if student exists
  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }

  // Check if email is being changed and if it already exists
  if (studentData.email && studentData.email !== student.email) {
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }
  }

  // Check if student ID is being changed and if it already exists
  if (studentData.studentId && studentData.studentId !== student.studentId) {
    const existingStudentId = await Student.findOne({ studentId: studentData.studentId });
    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID already exists'
      });
    }
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    studentData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: {
      student: updatedStudent
    }
  });
});

//     Delete student (soft delete)

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }

  // Soft delete by setting isActive to false
  student.isActive = false;
  await student.save();

  // Also deactivate associated tasks
  await Task.updateMany(
    { assignedTo: student._id },
    { isActive: false }
  );

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully'
  });
});

//    Get student statistics

export const getStudentStats = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments({ isActive: true });
  
  // Students by grade
  const studentsByGrade = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Students by section
  const studentsBySection = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$section',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Recent enrollments (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentEnrollments = await Student.countDocuments({
    isActive: true,
    enrollmentDate: { $gte: thirtyDaysAgo }
  });

  // Gender distribution
  const genderDistribution = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$gender',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      studentsByGrade,
      studentsBySection,
      recentEnrollments,
      genderDistribution
    }
  });
});

//   Export students to CSV

export const exportStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({ isActive: true })
    .sort({ lastName: 1, firstName: 1 });

  // Convert to CSV format
  const csvHeader = 'Student ID,First Name,Last Name,Email,Grade,Section,Gender,Phone,Enrollment Date\n';
  
  const csvData = students.map(student => {
    return [
      student.studentId,
      student.firstName,
      student.lastName,
      student.email,
      student.grade,
      student.section,
      student.gender,
      student.phone || '',
      student.enrollmentDate.toISOString().split('T')[0]
    ].join(',');
  }).join('\n');

  const csv = csvHeader + csvData;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=students_export.csv');
  
  res.status(200).send(csv);
});
