# Dish Booking System

A dish booking system with multi-role access, automatic chef assignment, order status updates, password reset, and Swagger API documentation.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account for email service

### Installation

1. Clone the repository
2. Install dependencies:
   bash
   npm install
   

3. Configure environment variables in .env file:
   - Update MONGODB_URI with your MongoDB connection string
   - Update email configuration with your Gmail credentials
   - JWT secrets are pre-configured

4. Start MongoDB service

5. Run the application:
   bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   

6. Access the API:
   - Server: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user  
- POST /api/auth/forgot-password - Request password reset
- PUT /api/auth/reset-password/:token - Reset password
- GET /api/auth/profile - Get user profile

### Dishes
- GET /api/dishes - Get all dishes (Public)
- GET /api/dishes/:id - Get single dish (Public)
- POST /api/dishes - Create dish (Admin only)
- PUT /api/dishes/:id - Update dish (Admin only)
- DELETE /api/dishes/:id - Delete dish (Admin only)
- PATCH /api/dishes/:id/availability - Toggle availability (Admin only)

### Orders
- POST /api/orders - Create order (User only)
- GET /api/orders - Get orders (Role-based access)
- GET /api/orders/my-orders - Get user's orders (User only)
- GET /api/orders/assigned-orders - Get assigned orders (Chef only)
- GET /api/orders/:id - Get single order
- PATCH /api/orders/:id/status - Update order status (Chef/Admin)

### Users
- GET /api/users - Get all users (Admin only)
- GET /api/users/:id - Get single user (Admin only)
- PUT /api/users/:id - Update user (Admin only)
- DELETE /api/users/:id - Delete user (Admin only)
- PATCH /api/users/:id/status - Toggle user status (Admin only)
- PUT /api/users/profile - Update own profile




