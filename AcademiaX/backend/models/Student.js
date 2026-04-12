import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    maxlength: [20, 'Student ID cannot exceed 20 characters']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    maxlength: [10, 'Section cannot exceed 10 characters']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Please add a valid phone number']
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [100, 'Street address cannot exceed 100 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Zip code cannot exceed 20 characters']
    }
  },
  parentInfo: {
    fatherName: {
      type: String,
      trim: true,
      maxlength: [100, 'Father name cannot exceed 100 characters']
    },
    motherName: {
      type: String,
      trim: true,
      maxlength: [100, 'Mother name cannot exceed 100 characters']
    },
    parentEmail: {
      type: String,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid parent email'
      ]
    },
    parentPhone: {
      type: String,
      trim: true,
      match: [/^[\d\s\-\+\(\)]+$/, 'Please add a valid parent phone number']
    }
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for student's task statistics
studentSchema.virtual('taskStats', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'assignedTo',
  match: { isActive: true }
});

// Virtual for age calculation
studentSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Indexes for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ studentId: 1 });
studentSchema.index({ grade: 1 });
studentSchema.index({ section: 1 });
studentSchema.index({ isActive: 1 });
studentSchema.index({ firstName: 1, lastName: 1 });
studentSchema.index({ 'parentInfo.parentEmail': 1 });

// Compound index for grade and section
studentSchema.index({ grade: 1, section: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
