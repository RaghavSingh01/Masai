const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


const { 
  handleValidationError, 
  globalErrorHandler 
} = require('./middleware/validation');


const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const app = express();


app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('---');
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Course Management API',
    version: '1.0.0',
    endpoints: {
      students: {
        'GET /api/students': 'Get all active students',
        'POST /api/students': 'Create a new student',
        'GET /api/students/:id': 'Get student by ID',
        'PUT /api/students/:id': 'Update student',
        'DELETE /api/students/:id': 'Soft delete student',
        'GET /api/students/:id/courses': 'Get student\'s active courses',
        'PATCH /api/students/:id/restore': 'Restore soft-deleted student'
      },
      courses: {
        'GET /api/courses': 'Get all active courses',
        'POST /api/courses': 'Create a new course',
        'GET /api/courses/:id': 'Get course by ID',
        'PUT /api/courses/:id': 'Update course',
        'DELETE /api/courses/:id': 'Soft delete course',
        'GET /api/courses/:id/students': 'Get course\'s active students',
        'PATCH /api/courses/:id/restore': 'Restore soft-deleted course'
      },
      enrollments: {
        'POST /api/enroll': 'Enroll student in course',
        'GET /api/enrollments': 'Get all active enrollments',
        'GET /api/enrollments/:id': 'Get enrollment by ID',
        'DELETE /api/enrollments/:id': 'Unenroll student from course',
        'PATCH /api/enrollments/:id/restore': 'Restore soft-deleted enrollment',
        'GET /api/enrollments/student/:studentId': 'Get enrollments by student',
        'GET /api/enrollments/course/:courseId': 'Get enrollments by course'
      }
    },
    schemas: {
      Student: {
        name: 'String (required, 2-100 chars)',
        email: 'String (required, unique, valid email)',
        isActive: 'Boolean (default: true)'
      },
      Course: {
        title: 'String (required, 2-200 chars)',
        description: 'String (required, 10-1000 chars)',
        isActive: 'Boolean (default: true)'
      },
      Enrollment: {
        studentId: 'ObjectId (required, ref: Student)',
        courseId: 'ObjectId (required, ref: Course)',
        enrolledAt: 'Date (default: Date.now)',
        isActive: 'Boolean (default: true)'
      }
    }
  });
});


app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});


app.use(handleValidationError);
app.use(globalErrorHandler);

module.exports = app;