const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');


const createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const student = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase()
    });
    
    await student.save();
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists for an active student'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating student'
    });
  }
};


const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findActive().select('-__v').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching students'
    });
  }
};


const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-__v');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or inactive'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student'
    });
  }
};


const updateStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const student = await Student.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or inactive'
      });
    }
    
    if (name) student.name = name.trim();
    if (email) student.email = email.trim().toLowerCase();
    
    await student.save();
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists for another active student'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating student'
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or already inactive'
      });
    }
    
    await student.softDelete();
    
    res.status(200).json({
      success: true,
      message: 'Student and related enrollments marked as inactive successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting student'
    });
  }
};


const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const student = await Student.findOne({ 
      _id: studentId, 
      isActive: true 
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or inactive'
      });
    }
    
    const enrollments = await Enrollment.getStudentCourses(studentId);
    
    const activeCourses = enrollments
      .filter(enrollment => enrollment.courseId !== null)
      .map(enrollment => ({
        courseId: enrollment.courseId._id,
        title: enrollment.courseId.title,
        description: enrollment.courseId.description,
        enrolledAt: enrollment.enrolledAt,
        courseCreatedAt: enrollment.courseId.createdAt
      }));
    
    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      coursesCount: activeCourses.length,
      courses: activeCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student courses'
    });
  }
};


const restoreStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ 
      _id: req.params.id, 
      isActive: false 
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or already active'
      });
    }
    
    await student.restore();
    
    res.status(200).json({
      success: true,
      message: 'Student restored successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error restoring student'
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  restoreStudent
};