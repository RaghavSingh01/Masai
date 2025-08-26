const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');


const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const course = new Course({
      title: title.trim(),
      description: description.trim()
    });
    
    await course.save();
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Course title already exists for an active course'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating course'
    });
  }
};


const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findActive().select('-__v').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching courses'
    });
  }
};


const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-__v');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or inactive'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course'
    });
  }
};


const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const course = await Course.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or inactive'
      });
    }
    
    if (title) course.title = title.trim();
    if (description) course.description = description.trim();
    
    await course.save();
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Course title already exists for another active course'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating course'
    });
  }
};


const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or already inactive'
      });
    }
    
    await course.softDelete();
    
    res.status(200).json({
      success: true,
      message: 'Course and related enrollments marked as inactive successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting course'
    });
  }
};


const getCourseStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    const course = await Course.findOne({ 
      _id: courseId, 
      isActive: true 
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or inactive'
      });
    }
    
    const enrollments = await Enrollment.getCourseStudents(courseId);
    
    const activeStudents = enrollments
      .filter(enrollment => enrollment.studentId !== null)
      .map(enrollment => ({
        studentId: enrollment.studentId._id,
        name: enrollment.studentId.name,
        email: enrollment.studentId.email,
        enrolledAt: enrollment.enrolledAt,
        studentCreatedAt: enrollment.studentId.createdAt
      }));
    
    res.status(200).json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description
      },
      studentsCount: activeStudents.length,
      students: activeStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course students'
    });
  }
};


const restoreCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ 
      _id: req.params.id, 
      isActive: false 
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or already active'
      });
    }
    
    await course.restore();
    
    res.status(200).json({
      success: true,
      message: 'Course restored successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error restoring course'
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  restoreCourse
};