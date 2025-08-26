const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  restoreCourse
} = require('../Controllers/courseController');

const {
  validateObjectId,
  validateRequestBody,
  validateStringLength,
  asyncHandler
} = require('../middleware/validation');


router.get('/', asyncHandler(getAllCourses));


router.post(
  '/',
  validateRequestBody(['title', 'description']),
  validateStringLength('title', 2, 200),
  validateStringLength('description', 10, 1000),
  asyncHandler(createCourse)
);


router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(getCourseById)
);


router.put(
  '/:id',
  validateObjectId('id'),
  validateStringLength('title', 2, 200),
  validateStringLength('description', 10, 1000),
  asyncHandler(updateCourse)
);


router.delete(
  '/:id',
  validateObjectId('id'),
  asyncHandler(deleteCourse)
);


router.get(
  '/:id/students',
  validateObjectId('id'),
  asyncHandler(getCourseStudents)
);


router.patch(
  '/:id/restore',
  validateObjectId('id'),
  asyncHandler(restoreCourse)
);

module.exports = router;