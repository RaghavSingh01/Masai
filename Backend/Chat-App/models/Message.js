const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    },
    room: {
        type: String,
        required: true,
        default: 'general'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    messageType: {
        type: String,
        enum: ['chat', 'system', 'broadcast'],
        default: 'chat'
    }
}, {
    timestamps: true 
});

messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ username: 1 });
messageSchema.index({ timestamp: -1 });

messageSchema.statics.getRecentByRoom = function(room, limit = 50) {
    return this.find({ room })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();
};

messageSchema.statics.getAdminBroadcasts = function(limit = 10) {
    return this.find({ isAdmin: true, messageType: 'broadcast' })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();
};

messageSchema.methods.toClientFormat = function() {
    return {
        username: this.username,
        message: this.message,
        room: this.room,
        timestamp: this.timestamp,
        isAdmin: this.isAdmin,
        messageType: this.messageType
    };
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;