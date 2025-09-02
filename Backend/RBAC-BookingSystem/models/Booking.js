const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
        enum: ['plumbing', 'car repair', 'cleaning', 'electrical', 'painting', 'carpentry']
    },
    requestedDate: {
        type: Date,
        required: [true, 'Requested date is required'],
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'Requested date must be in the future'
        }
    },
    requestedTime: {
        type: String,
        required: [true, 'Requested time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Admin notes cannot exceed 500 characters']
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for efficient querying
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Middleware to set approval details
bookingSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'approved' && !this.approvedAt) {
        this.approvedAt = new Date();
    }
    next();
});

// Populate user details when querying
bookingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'username email role'
    }).populate({
        path: 'approvedBy',
        select: 'username email'
    });
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);