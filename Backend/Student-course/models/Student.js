const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
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

studentSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'studentId'
});

studentSchema.index({ email: 1 });
studentSchema.index({ isActive: 1 });

studentSchema.pre('save', async function(next) {
  if (!this.isModified('email')) return next();
  
  const existingStudent = await this.constructor.findOne({
    email: this.email,
    isActive: true,
    _id: { $ne: this._id }
  });
  
  if (existingStudent) {
    throw new Error('Email already exists for an active student');
  }
  
  next();
});


studentSchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, isActive: true });
};

studentSchema.methods.softDelete = async function() {
  this.isActive = false;
  await this.save();

  const Enrollment = mongoose.model('Enrollment');
  await Enrollment.updateMany(
    { studentId: this._id, isActive: true },
    { isActive: false }
  );
  
  return this;
};

studentSchema.methods.restore = async function() {
  this.isActive = true;
  return await this.save();
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;