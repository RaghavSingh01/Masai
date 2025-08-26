const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'courseId'
});

courseSchema.index({ title: 1 });
courseSchema.index({ isActive: 1 });

courseSchema.pre('save', async function(next) {
  if (!this.isModified('title')) return next();
  
  const existingCourse = await this.constructor.findOne({
    title: this.title,
    isActive: true,
    _id: { $ne: this._id }
  });
  
  if (existingCourse) {
    throw new Error('Course title already exists for an active course');
  }
  
  next();
});

courseSchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, isActive: true });
};

courseSchema.methods.softDelete = async function() {
  this.isActive = false;
  await this.save();
  
  const Enrollment = mongoose.model('Enrollment');
  await Enrollment.updateMany(
    { courseId: this._id, isActive: true },
    { isActive: false }
  );
  
  return this;
};

courseSchema.methods.restore = async function() {
  this.isActive = true;
  return await this.save();
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;