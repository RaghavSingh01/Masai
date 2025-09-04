const EventEmitter = require('events');

class RealTimeNotificationSystem extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.on('userLoggedIn', this.handleUserLogin);
        this.on('userLoggedIn', this.logUserLogin);
        this.on('userLoggedIn', this.sendWelcomeNotification);

        this.on('messageReceived', this.handleMessage);
        this.on('messageReceived', this.logMessage);
        this.on('messageReceived', this.notifyUser);

        this.on('dataSynced', this.handleDataSync);
        this.on('dataSynced', this.logDataSync);
        this.on('dataSynced', this.notifyDataSyncComplete);
    }

    handleUserLogin(username) {
        console.log(` User ${username} logged in`);
    }

    logUserLogin(username) {
        const timestamp = new Date().toISOString();
        console.log(` LOG: User login event - ${username} at ${timestamp}`);
    }

    sendWelcomeNotification(username) {
        console.log(`Notification sent to ${username}: Welcome back!`);
    }

    handleMessage(from, to, message) {
        console.log(` Message from ${from} to ${to}: ${message}`);
    }

    logMessage(from, to, message) {
        const timestamp = new Date().toISOString();
        console.log(`LOG: Message event - ${from} -> ${to} at ${timestamp}`);
    }

    notifyUser(from, to, message) {
        console.log(` Notification sent to ${to}: New message from ${from}`);
    }

    handleDataSync(username, dataType) {
        console.log(` Data sync completed for ${username}: ${dataType}`);
    }

    logDataSync(username, dataType) {
        const timestamp = new Date().toISOString();
        console.log(` LOG: Data sync event - ${username}/${dataType} at ${timestamp}`);
    }

    notifyDataSyncComplete(username, dataType) {
        console.log(` Notification: ${dataType} sync complete for ${username}`);
    }

    simulateUserLogin(username) {
        console.log(` Simulating user login for: ${username}`);
        console.log('='.repeat(50));

        this.emit('userLoggedIn', username);

        setTimeout(() => {
            console.log(`\Processing user data for ${username}...`);
            this.emit('dataSynced', username, 'user profile data');
        }, 1000);

        setTimeout(() => {
            console.log(` Checking messages for ${username}...`);
            this.emit('messageReceived', 'System', 'username', 'Your account has been updated successfully!');
        }, 2000);
    }

    simulateRealTimeSystem() {
        console.log('ðŸŒŸ Starting Real-Time Notification System Demo');
        console.log('='.repeat(60));

        const users = ['john', 'alice', 'bob'];

        users.forEach((user, index) => {
            setTimeout(() => {
                this.simulateUserLogin(user);
            }, index * 3000);
        });

        setTimeout(() => {
            console.log('\nðŸ”„ Simulating background data sync...');
            console.log('='.repeat(50));
            this.emit('dataSynced', 'background_process', 'system cache');
        }, 8000);

        setTimeout(() => {
            console.log(' Simulating peer-to-peer message...');
            console.log('='.repeat(50));
            this.emit('messageReceived', 'alice', 'john', 'Hey John, how are you doing?');
        }, 10000);
    }

    demonstrateEventListeners() {
        console.log('‹ Current Event Listeners:');
        console.log('='.repeat(40));

        const events = ['userLoggedIn', 'messageReceived', 'dataSynced'];
        events.forEach(eventName => {
            const listenerCount = this.listenerCount(eventName);
            console.log(`${eventName}: ${listenerCount} listeners`);
        });
    }
}

const notificationSystem = new RealTimeNotificationSystem();

notificationSystem.demonstrateEventListeners();

notificationSystem.simulateRealTimeSystem();

setTimeout(() => {
    console.log('\nðŸ Demo completed! Real-Time Notification System shutting down...');
    process.exit(0);
}, 12000);