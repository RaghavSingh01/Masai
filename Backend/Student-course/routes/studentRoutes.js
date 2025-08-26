const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  restoreStudent
} = require('../Controllers/studentController');

const {
  validateObjectId,
  validateRequestBody,
  validateEmail,
  validateStringLength,
  asyncHandler
} = require('../middleware/validation');


router.get('/', asyncHandler(getAllStudents));


router.post(
  '/',
  validateRequestBody(['name', 'email']),
  validateEmail,
  validateStringLength('name', 2, 100),
  asyncHandler(createStudent)
);


router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(getStudentById)
);


router.put(
  '/:id',
  validateObjectId('id'),
  validateEmail,
  validateStringLength('name', 2, 100),
  asyncHandler(updateStudent)
);


router.delete(
  '/:id',
  validateObjectId('id'),
  asyncHandler(deleteStudent)
);


router.get(
  '/:id/courses',
  validateObjectId('id'),
  asyncHandler(getStudentCourses)
);


router.patch(
  '/:id/restore',
  validateObjectId('id'),
  asyncHandler(restoreStudent)
);

module.exports = router;