## 🛠 Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or newer)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [MongoDB](https://www.mongodb.com/try/download/community) (a running local or cloud instance)

### Step 1: Clone the Repository
```
git clone https://github.com/RaghavSingh01/Masai/tree/main/Backend/Auth-PassReset
cd Auth-PassReset
```
### Step 2: Install Dependencies

Install all the required packages from package.json.

```
npm install
```

### Step 3: Configure Environment Variables

Create a .env file in the project root and add your configuration details. You can copy the example file below.

```
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (replace with your MongoDB connection string)
MONGODB_URI=mongodb://localhost:27017/auth_system

# JWT Secrets (Generate strong, random strings for these in production)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# JWT Expiration Times
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d


EMAIL_PROVIDER=gmail
EMAIL_FROM="Your App Name" <noreply@yourapp.com>
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password


```
> *Important*: For EMAIL_PASS with Gmail, you need to generate an *App Password* from your Google Account settings. Your regular password will not work.

### Step 4: Run the Server

Start the server in development mode, which uses nodemon for automatic restarts on file changes.

```
npm start
```

The server will be running at "http://localhost:5000".


