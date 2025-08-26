const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

enrollmentSchema.index({ studentId: 1, isActive: 1 });
enrollmentSchema.index({ courseId: 1, isActive: 1 });
enrollmentSchema.index({ isActive: 1 });

enrollmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Student = mongoose.model('Student');
    const Course = mongoose.model('Course');
    
    const student = await Student.findById(this.studentId);
    if (!student || !student.isActive) {
      throw new Error('Student not found or is inactive');
    }
    
    const course = await Course.findById(this.courseId);
    if (!course || !course.isActive) {
      throw new Error('Course not found or is inactive');
    }
    
    const existingEnrollment = await this.constructor.findOne({
      studentId: this.studentId,
      courseId: this.courseId,
      isActive: true,
      _id: { $ne: this._id }
    });
    
    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course');
    }
  }
  
  next();
});

enrollmentSchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, isActive: true });
};

enrollmentSchema.statics.getStudentCourses = function(studentId) {
  return this.find({ studentId, isActive: true })
    .populate({
      path: 'courseId',
      match: { isActive: true },
      select: 'title description createdAt'
    })
    .select('courseId enrolledAt')
    .lean();
};

enrollmentSchema.statics.getCourseStudents = function(courseId) {
  return this.find({ courseId, isActive: true })
    .populate({
      path: 'studentId',
      match: { isActive: true },
      select: 'name email createdAt'
    })
    .select('studentId enrolledAt')
    .lean();
};

enrollmentSchema.methods.softDelete = async function() {
  this.isActive = false;
  return await this.save();
};

enrollmentSchema.methods.restore = async function() {
  const Student = mongoose.model('Student');
  const Course = mongoose.model('Course');
  
  const student = await Student.findById(this.studentId);
  const course = await Course.findById(this.courseId);
  
  if (!student || !student.isActive) {
    throw new Error('Cannot restore enrollment: Student is not active');
  }
  
  if (!course || !course.isActive) {
    throw new Error('Cannot restore enrollment: Course is not active');
  }
  
  this.isActive = true;
  return await this.save();
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;