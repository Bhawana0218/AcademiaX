import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Task must be assigned to a student']
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned by a user']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['assignment', 'project', 'quiz', 'exam', 'homework', 'other'],
    default: 'assignment'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  estimatedTime: {
    type: Number, // in minutes
    min: [1, 'Estimated time must be at least 1 minute'],
    max: [480, 'Estimated time cannot exceed 8 hours']
  },
  actualTime: {
    type: Number, // in minutes
    min: [0, 'Actual time cannot be negative'],
    default: null
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  submission: {
    submittedAt: Date,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    content: String,
    attachments: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimeType: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    grade: {
      type: Number,
      min: [0, 'Grade cannot be less than 0'],
      max: [100, 'Grade cannot exceed 100']
    },
    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    gradedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  completedAt: Date,
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time remaining
taskSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  const diffMs = dueDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue
taskSchema.virtual('isOverdue').get(function() {
  return new Date() > new Date(this.dueDate) && this.status !== 'completed';
});

// Virtual for completion percentage
taskSchema.virtual('completionPercentage').get(function() {
  switch (this.status) {
    case 'completed':
      return 100;
    case 'in_progress':
      return 50;
    case 'overdue':
      return this.completedAt ? 100 : 25;
    default:
      return 0;
  }
});

// Pre-save middleware to update status based on due date
taskSchema.pre('save', function(next) {
  if (this.isModified('dueDate') || this.isModified('status')) {
    const now = new Date();
    const dueDate = new Date(this.dueDate);
    
    if (this.status !== 'completed' && now > dueDate) {
      this.status = 'overdue';
    }
  }
  
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  
  next();
});

// Indexes for faster queries
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isActive: 1 });
taskSchema.index({ createdAt: -1 });

// Compound indexes
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ assignedBy: 1, status: 1 });
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ priority: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
