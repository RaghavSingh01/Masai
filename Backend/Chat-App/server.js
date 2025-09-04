const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory storage (as a fallback)
let onlineUsers = new Map();
let chatMessages = []; // Used only if MongoDB fails
let rooms = new Map();

// --- MongoDB Setup ---
let Message;
try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    const messageSchema = new mongoose.Schema({
        username: String,
        message: String,
        room: String,
        timestamp: { type: Date, default: Date.now },
        isAdmin: { type: Boolean, default: false }
    });
    
    Message = mongoose.model('Message', messageSchema);
    console.log('🔗 Connected to MongoDB');
} catch (error) {
    console.log('⚠ MongoDB not available, chat history will not be saved.');
    Message = null;
}

// --- Helper Functions ---
const isAdmin = (username) => {
    const adminUsers = ['admin', 'administrator', 'moderator'];
    return adminUsers.includes(username.toLowerCase()) || username.startsWith('admin_');
};

const saveMessageToMongoDB = async (messageData) => {
    if (Message) {
        try {
            const message = new Message(messageData);
            await message.save();
        } catch (error) {
            console.error('MongoDB save error:', error);
        }
    }
};

// ** NEW FUNCTION **: Gets recent messages directly from MongoDB
const getRecentMessagesFromMongoDB = async (room) => {
    if (Message) {
        try {
            // Find the last 50 messages for the specific room
            const messages = await Message.find({ room: room })
                .sort({ timestamp: -1 }) // Get the newest first
                .limit(50);
            return messages.reverse(); // Reverse to show oldest first in the chat
        } catch (error) {
            console.error('MongoDB fetch error:', error);
            return []; // Return empty on error
        }
    }
    // Fallback to in-memory array if MongoDB is down
    return chatMessages.filter(msg => msg.room === room).slice(-50);
};


// --- Socket.IO Connection Handling ---
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // User registration/join
    socket.on('join', async (data) => {
        const { username, room = 'general' } = data;
        
        onlineUsers.set(socket.id, { username, socketId: socket.id, room });
        socket.join(room);
        if (!rooms.has(room)) rooms.set(room, new Set());
        rooms.get(room).add(socket.id);

        // ** CHANGED **: Fetch history from MongoDB
        const recentMessages = await getRecentMessagesFromMongoDB(room);
        socket.emit('chat_history', recentMessages);

        // Notify others and update user list
        socket.to(room).emit('user_joined', `{ username, message: ${username} joined the chat }`);
        const roomUsers = Array.from(onlineUsers.values()).filter(user => user.room === room).map(u => u.username);
        io.to(room).emit('online_users', roomUsers);
    });

    // Handle group chat messages
    socket.on('group_message', async (data) => {
        const user = onlineUsers.get(socket.id);
        if (!user) return;

        const messageData = {
            username: user.username,
            message: data.message,
            room: user.room,
            timestamp: new Date(),
            isAdmin: isAdmin(user.username)
        };

        // ** CHANGED **: Save directly to MongoDB
        await saveMessageToMongoDB(messageData);

        // Broadcast message to all users in the room
        io.to(user.room).emit('group_message', messageData);
    });
    
    // Handle admin broadcasts
    socket.on('admin_broadcast', async (data) => {
        const user = onlineUsers.get(socket.id);
        if (!user || !isAdmin(user.username)) return;

        const messageData = {
            username: user.username,
            message: data.message,
            room: 'broadcast', // Special room for broadcasts
            timestamp: new Date(),
            isAdmin: true
        };
        
        // Save broadcast to MongoDB
        await saveMessageToMongoDB(messageData);

        // Broadcast to all connected users
        io.emit('admin_broadcast', messageData);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        const user = onlineUsers.get(socket.id);
        if (user) {
            onlineUsers.delete(socket.id);
            if (rooms.has(user.room)) rooms.get(user.room).delete(socket.id);

            // Notify room and update user list
            socket.to(user.room).emit('user_left', `{ username: user.username, message: ${user.username} left the chat }`);
            const roomUsers = Array.from(onlineUsers.values()).filter(u => u.room === user.room).map(u => u.username);
            io.to(user.room).emit('online_users', roomUsers);
            console.log(`👋 ${user.username} disconnected.`);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Chat server running on http://localhost:${PORT}`);
    console.log('Features enabled:');
    console.log('  ✅ Real-time group chat');
    console.log('  ✅ Online users tracking');
    console.log('  ✅ Admin broadcasting');
    console.log('  ✅ Room-based chat');
    console.log('  ❌ Redis (disabled)');
    console.log(`  ${Message ? '✅' : '❌'} MongoDB chat history`);
});