const express = require('express');
const router = express.Router();
const {
  enrollStudent,
  getAllEnrollments,
  getEnrollmentById,
  unenrollStudent,
  restoreEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse
} = require('../Controllers/enrollmentController');

const {
  validateObjectId,
  validateEnrollment,
  asyncHandler
} = require('../middleware/validation');


router.post(
  '/',
  validateEnrollment,
  asyncHandler(enrollStudent)
);


router.get('/', asyncHandler(getAllEnrollments));


router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(getEnrollmentById)
);


router.delete(
  '/:id',
  validateObjectId('id'),
  asyncHandler(unenrollStudent)
);


router.patch(
  '/:id/restore',
  validateObjectId('id'),
  asyncHandler(restoreEnrollment)
);


router.get(
  '/student/:studentId',
  validateObjectId('studentId'),
  asyncHandler(getEnrollmentsByStudent)
);


router.get(
  '/course/:courseId',
  validateObjectId('courseId'),
  asyncHandler(getEnrollmentsByCourse)
);

module.exports = router;