const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');


const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student || !student.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or is inactive'
      });
    }
    
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or is inactive'
      });
    }
    
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
      isActive: true
    });
    
    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }
    
    const enrollment = new Enrollment({
      studentId,
      courseId
    });
    
    await enrollment.save();
    
    await enrollment.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'courseId', select: 'title description' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: {
        enrollmentId: enrollment._id,
        student: {
          id: enrollment.studentId._id,
          name: enrollment.studentId.name,
          email: enrollment.studentId.email
        },
        course: {
          id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          description: enrollment.courseId.description
        },
        enrolledAt: enrollment.enrolledAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error enrolling student'
    });
  }
};


const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findActive()
      .populate('studentId', 'name email')
      .populate('courseId', 'title description')
      .sort({ enrolledAt: -1 });
    
    const formattedEnrollments = enrollments.map(enrollment => ({
      enrollmentId: enrollment._id,
      student: enrollment.studentId ? {
        id: enrollment.studentId._id,
        name: enrollment.studentId.name,
        email: enrollment.studentId.email
      } : null,
      course: enrollment.courseId ? {
        id: enrollment.courseId._id,
        title: enrollment.courseId.title,
        description: enrollment.courseId.description
      } : null,
      enrolledAt: enrollment.enrolledAt,
      createdAt: enrollment.createdAt
    }));
    
    res.status(200).json({
      success: true,
      count: formattedEnrollments.length,
      data: formattedEnrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching enrollments'
    });
  }
};


const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      isActive: true
    })
      .populate('studentId', 'name email')
      .populate('courseId', 'title description');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found or inactive'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        enrollmentId: enrollment._id,
        student: enrollment.studentId ? {
          id: enrollment.studentId._id,
          name: enrollment.studentId.name,
          email: enrollment.studentId.email
        } : null,
        course: enrollment.courseId ? {
          id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          description: enrollment.courseId.description
        } : null,
        enrolledAt: enrollment.enrolledAt,
        createdAt: enrollment.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching enrollment'
    });
  }
};


const unenrollStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found or already inactive'
      });
    }
    
    await enrollment.softDelete();
    
    res.status(200).json({
      success: true,
      message: 'Student unenrolled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error unenrolling student'
    });
  }
};


const restoreEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      isActive: false
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found or already active'
      });
    }
    
    await enrollment.restore();
    
    await enrollment.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'courseId', select: 'title description' }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment restored successfully',
      data: {
        enrollmentId: enrollment._id,
        student: enrollment.studentId ? {
          id: enrollment.studentId._id,
          name: enrollment.studentId.name,
          email: enrollment.studentId.email
        } : null,
        course: enrollment.courseId ? {
          id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          description: enrollment.courseId.description
        } : null,
        enrolledAt: enrollment.enrolledAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error restoring enrollment'
    });
  }
};

const getEnrollmentsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const enrollments = await Enrollment.findActive({ studentId })
      .populate('courseId', 'title description')
      .sort({ enrolledAt: -1 });
    
    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        isActive: student.isActive
      },
      count: enrollments.length,
      enrollments: enrollments.map(enrollment => ({
        enrollmentId: enrollment._id,
        course: enrollment.courseId ? {
          id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          description: enrollment.courseId.description
        } : null,
        enrolledAt: enrollment.enrolledAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student enrollments'
    });
  }
};


const getEnrollmentsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const enrollments = await Enrollment.findActive({ courseId })
      .populate('studentId', 'name email')
      .sort({ enrolledAt: -1 });
    
    res.status(200).json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        isActive: course.isActive
      },
      count: enrollments.length,
      enrollments: enrollments.map(enrollment => ({
        enrollmentId: enrollment._id,
        student: enrollment.studentId ? {
          id: enrollment.studentId._id,
          name: enrollment.studentId.name,
          email: enrollment.studentId.email
        } : null,
        enrolledAt: enrollment.enrolledAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course enrollments'
    });
  }
};

module.exports = {
  enrollStudent,
  getAllEnrollments,
  getEnrollmentById,
  unenrollStudent,
  restoreEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse
};