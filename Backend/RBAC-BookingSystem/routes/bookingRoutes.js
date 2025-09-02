const express = require('express');
const Booking = require('../models/Booking');
const { authenticate, authorize, ownershipOrAdmin } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

const router = express.Router();

// Apply authentication to all booking routes
router.use(authenticate);

// POST /bookings - Create a new booking (users can create, status = "pending")
router.post('/', asyncHandler(async (req, res) => {
    const { serviceName, requestedDate, requestedTime, description } = req.body;

    // Validate required fields
    if (!serviceName || !requestedDate || !requestedTime) {
        return res.status(400).json({
            success: false,
            message: 'Service name, requested date, and time are required'
        });
    }

    // Create booking with pending status
    const booking = await Booking.create({
        serviceName,
        requestedDate,
        requestedTime,
        description,
        user: req.user.id,
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
            booking
        }
    });
}));

// GET /bookings - Users can view their own bookings, Admins can view all bookings
router.get('/', asyncHandler(async (req, res) => {
    let query = {};

    // If user is not admin, only show their own bookings
    if (req.user.role !== 'admin') {
        query.user = req.user.id;
    }

    // Add status filter if provided
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Add service filter if provided
    if (req.query.service) {
        query.serviceName = req.query.service;
    }

    const bookings = await Booking.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(req.query.limit) || 10)
        .skip(parseInt(req.query.skip) || 0);

    const totalCount = await Booking.countDocuments(query);

    res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: {
            bookings,
            pagination: {
                total: totalCount,
                limit: parseInt(req.query.limit) || 10,
                skip: parseInt(req.query.skip) || 0
            }
        }
    });
}));

// GET /bookings/:id - Get specific booking (ownership or admin check)
router.get('/:id', asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    // Check ownership or admin role
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Booking retrieved successfully',
        data: {
            booking
        }
    });
}));

// PUT /bookings/:id - Users can update their bookings (only if pending)
router.put('/:id', asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    // Check ownership
    if (booking.user._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'You can only update your own bookings'
        });
    }

    // Users can only update pending bookings
    if (booking.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: 'Only pending bookings can be updated'
        });
    }

    const { serviceName, requestedDate, requestedTime, description } = req.body;

    // Update allowed fields
    if (serviceName) booking.serviceName = serviceName;
    if (requestedDate) booking.requestedDate = requestedDate;
    if (requestedTime) booking.requestedTime = requestedTime;
    if (description !== undefined) booking.description = description;

    await booking.save();

    res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: {
            booking
        }
    });
}));

// DELETE /bookings/:id - Users can cancel their own bookings (only if pending)
router.delete('/:id', asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    // Check ownership
    if (booking.user._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'You can only cancel your own bookings'
        });
    }

    // Users can only cancel pending bookings
    if (booking.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: 'Only pending bookings can be cancelled'
        });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
            booking
        }
    });
}));

// PATCH /bookings/:id/approve - Admins can approve a booking
router.patch('/:id/approve', authorize('admin'), asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    if (booking.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: 'Only pending bookings can be approved'
        });
    }

    booking.status = 'approved';
    booking.approvedBy = req.user.id;
    booking.adminNotes = req.body.adminNotes || '';

    await booking.save();

    res.status(200).json({
        success: true,
        message: 'Booking approved successfully',
        data: {
            booking
        }
    });
}));

// PATCH /bookings/:id/reject - Admins can reject a booking
router.patch('/:id/reject', authorize('admin'), asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    if (booking.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: 'Only pending bookings can be rejected'
        });
    }

    booking.status = 'rejected';
    booking.approvedBy = req.user.id;
    booking.adminNotes = req.body.adminNotes || req.body.reason || '';

    await booking.save();

    res.status(200).json({
        success: true,
        message: 'Booking rejected successfully',
        data: {
            booking
        }
    });
}));

// DELETE /bookings/:id/admin - Admins can delete any booking
router.delete('/:id/admin', authorize('admin'), asyncHandler(async (req, res) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Booking deleted successfully'
    });
}));

module.exports = router;