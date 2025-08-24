import mongoose from 'mongoose';
import validator from 'validator';

// Address Schema (subdocument)
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street is required'],
    trim: true,
    maxlength: [200, 'Street cannot exceed 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [100, 'State cannot exceed 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'India',
    trim: true,
    maxlength: [100, 'Country cannot exceed 100 characters']
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    validate: {
      validator: function(v) {
        if (this.country === 'India') {
          return /^[1-9][0-9]{5}$/.test(v);
        }
        return /^[A-Za-z0-9]{3,10}$/.test(v);
      },
      message: 'Please provide a valid pincode'
    }
  }
}, { timestamps: true, _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: 'Name should only contain letters and spaces'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address'
    }
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age cannot exceed 150'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be a whole number'
    }
  },
  addresses: [addressSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('addressCount').get(function() {
  return this.addresses.length;
});

userSchema.index({ email: 1 });
userSchema.index({ name: 1 });

userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingUser = await mongoose.model('User').findOne({ 
      email: this.email, 
      _id: { $ne: this._id } 
    });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.status = 400;
      return next(error);
    }
  }
  next();
});

userSchema.statics.getSummary = async function() {
  const pipeline = [
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        totalAddresses: { $sum: { $size: '$addresses' } },
        users: {
          $push: {
            _id: '$_id',
            name: '$name',
            email: '$email',
            addressCount: { $size: '$addresses' }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        totalAddresses: 1,
        users: 1
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || { totalUsers: 0, totalAddresses: 0, users: [] };
};

const User = mongoose.model('User', userSchema);

export default User;
