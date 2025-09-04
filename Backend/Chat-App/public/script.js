// Socket.IO client connection
const socket = io();

// DOM elements
const loginSection = document.getElementById('loginSection');
const chatSection = document.getElementById('chatSection');
const usernameInput = document.getElementById('usernameInput');
const roomSelect = document.getElementById('roomSelect');
const joinBtn = document.getElementById('joinBtn');
const currentUser = document.getElementById('currentUser');
const currentRoom = document.getElementById('currentRoom');
const adminBadge = document.getElementById('adminBadge');
const roomSwitcher = document.getElementById('roomSwitcher');
const disconnectBtn = document.getElementById('disconnectBtn');
const onlineUsers = document.getElementById('onlineUsers');
const userCount = document.getElementById('userCount');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const adminControls = document.getElementById('adminControls');
const broadcastInput = document.getElementById('broadcastInput');
const broadcastBtn = document.getElementById('broadcastBtn');
const notifications = document.getElementById('notifications');

// Application state
let username = '';
let currentRoomName = 'general';
let isAdmin = false;

// Utility functions
const isAdminUser = (username) => {
    const adminUsers = ['admin', 'administrator', 'moderator'];
    return adminUsers.includes(username.toLowerCase()) || username.startsWith('admin_');
};

const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notifications.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
};

const formatTime = (timestamp) => {
    const time = new Date(timestamp);
    return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
};

const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
};

const addMessage = (messageData, isOwn = false) => {
    const messageDiv = document.createElement('div');
    let messageClass = 'message';

    if (messageData.isAdmin && messageData.room === 'broadcast') {
        messageClass += ' admin';
    } else if (messageData.username === 'System') {
        messageClass += ' system';
    } else if (isOwn) {
        messageClass += ' own';
    } else {
        messageClass += ' other';
    }

    messageDiv.className = messageClass;

    if (messageData.isAdmin && messageData.room === 'broadcast') {
        // Admin broadcast message
        messageDiv.innerHTML = `
            <div class="message-header">ADMIN ANNOUNCEMENT</div>
            <div>${escapeHtml(messageData.message)}</div>
            <div class="message-time">${formatTime(messageData.timestamp)}</div>
        `;
    } else if (messageData.username === 'System') {
        // System message
        messageDiv.innerHTML = "<div>${escapeHtml(messageData.message)}</div>";
    } else {
        // Regular chat message
        const crown = messageData.isAdmin ? ' ðŸ‘‘' : '';
        messageDiv.innerHTML = `
            <div class="message-header">
                ${escapeHtml(messageData.username)}${crown}
            </div>
            <div>${escapeHtml(messageData.message)}</div>
            <div class="message-time">${formatTime(messageData.timestamp)}</div>
        `;
    }

    messages.appendChild(messageDiv);
    scrollToBottom();
};

const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

const updateOnlineUsers = (users) => {
    onlineUsers.innerHTML = '';
    userCount.textContent = users.length;

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        if (isAdminUser(user)) {
            userDiv.classList.add('admin');
        }
        userDiv.innerHTML = `
            <i class="fas fa-circle"></i>
            ${escapeHtml(user)}
        `;
        onlineUsers.appendChild(userDiv);
    });
};

const enableChatControls = () => {
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
};

const disableChatControls = () => {
    messageInput.disabled = true;
    sendBtn.disabled = true;
};

// Event Listeners

// Join chat
joinBtn.addEventListener('click', () => {
    const usernameValue = usernameInput.value.trim();
    const room = roomSelect.value;

    if (!usernameValue) {
        showNotification('Please enter a username', 'error');
        return;
    }

    if (usernameValue.length < 2) {
        showNotification('Username must be at least 2 characters', 'error');
        return;
    }

    username = usernameValue;
    currentRoomName = room;
    isAdmin = isAdminUser(username);

    // Update UI
    currentUser.textContent = username;
    currentRoom.textContent = room;
    roomSwitcher.value = room;

    if (isAdmin) {
        adminBadge.style.display = 'inline';
        adminControls.style.display = 'block';
    }

    // Hide login, show chat
    loginSection.style.display = 'none';
    chatSection.style.display = 'block';

    // Join the chat
    socket.emit('join', { username, room });
    showNotification(`Welcome to ${room}!`, 'success');
});

// Socket event listeners
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    showNotification('Disconnected from server', 'error');
    disableChatControls();
});

socket.on('chat_history', (historyMessages) => {
    messages.innerHTML = '';
    historyMessages.forEach(msg => {
        addMessage(msg, msg.username === username);
    });
    enableChatControls();
});

socket.on('group_message', (messageData) => {
    addMessage(messageData, messageData.username === username);
});

socket.on('admin_broadcast', (messageData) => {
    addMessage(messageData);
    showNotification('Admin Announcement received', 'info');
});

socket.on('user_joined', (data) => {
    addMessage({
        username: 'System',
        message: data.message,
        timestamp: data.timestamp
    });
});

socket.on('user_left', (data) => {
    addMessage({
        username: 'System',
        message: data.message,
        timestamp: data.timestamp
    });
});

socket.on('online_users', updateOnlineUsers);

socket.on('room_switched', (data) => {
    currentRoomName = data.room;
    currentRoom.textContent = data.room;
    showNotification(`Switched to ${data.room}`, 'success');
});

socket.on('error', (errorMessage) => {
    showNotification(errorMessage, 'error');
});

// Event handlers
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinBtn.click();
});

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;
    socket.emit('group_message', { message });
    messageInput.value = '';
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

broadcastBtn.addEventListener('click', () => {
    const message = broadcastInput.value.trim();
    if (!message) return;
    socket.emit('admin_broadcast', { message });
    broadcastInput.value = '';
});

broadcastInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') broadcastBtn.click();
});

roomSwitcher.addEventListener('change', (e) => {
    const newRoom = e.target.value;
    if (newRoom !== currentRoomName) {
        socket.emit('switch_room', { newRoom });
    }
});

disconnectBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to disconnect?')) {
        socket.emit('manual_disconnect');
        showNotification('Disconnected from chat', 'info');
        setTimeout(() => {
            loginSection.style.display = 'block';
            chatSection.style.display = 'none';
            messages.innerHTML = '';
            onlineUsers.innerHTML = '';
            userCount.textContent = '0';
            usernameInput.value = '';
            messageInput.value = '';
            broadcastInput.value = '';
            adminControls.style.display = 'none';
            adminBadge.style.display = 'none';
            disableChatControls();
        }, 500);
    }
});

console.log('Chat application initialized');