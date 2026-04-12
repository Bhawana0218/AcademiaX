import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
     
    .isIn(['admin', 'teacher'])
    .withMessage('Role must be either admin or teacher'),
  
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Student validation rules
export const validateStudentCreation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('studentId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Student ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Student ID can only contain letters and numbers'),
  
  body('grade')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Grade must be between 1 and 12'),
  
  body('section')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Section must be between 1 and 10 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const dob = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      if (age < 5 || age > 25) {
        throw new Error('Student age must be between 5 and 25 years');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

export const validateStudentUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('grade')
    .optional()
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Grade must be between 1 and 12'),
  
  body('section')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Section must be between 1 and 10 characters'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

// Task validation rules
export const validateTaskCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('assignedTo')
    .isMongoId()
    .withMessage('Assigned student ID must be valid'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('category')
    .optional()
    .isIn(['assignment', 'project', 'quiz', 'exam', 'homework', 'other'])
    .withMessage('Category must be assignment, project, quiz, exam, homework, or other'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Please provide a valid due date')
    .custom((value) => {
      const dueDate = new Date(value);
      const now = new Date();
      if (dueDate <= now) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  
  body('estimatedTime')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Estimated time must be between 1 and 480 minutes'),
  
  handleValidationErrors
];

export const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'overdue'])
    .withMessage('Status must be pending, in_progress, completed, or overdue'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('category')
    .optional()
    .isIn(['assignment', 'project', 'quiz', 'exam', 'homework', 'other'])
    .withMessage('Category must be assignment, project, quiz, exam, homework, or other'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid due date'),
  
  body('estimatedTime')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Estimated time must be between 1 and 480 minutes'),
  
  handleValidationErrors
];

// ID validation
export const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];
