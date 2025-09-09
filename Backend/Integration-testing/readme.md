# Todo API with CI/CD and DevOps Practices

This project is a backend-only Node.js Express application for managing todos, complete with user authentication via JWT. The codebase has been refactored to follow professional standards and features a full Continuous Integration (CI) and Continuous Deployment (CD) pipeline using GitHub Actions to automatically test and deploy the application to Render.

### Live Deployed URL

*[https://your-service-name.onrender.com](https://your-service-name.onrender.com)*

*(Remember to replace your-service-name with your actual Render service URL)*

## Features

-   *User Authentication:* Secure user signup and login with JSON Web Tokens (JWT).
-   *CRUD Operations:* Full Create, Read, Update, and Delete functionality for todos.
-   *Protected Routes:* All todo-related endpoints are protected and require a valid JWT.
-   *Professional Codebase:* Follows a logical folder structure with consistent naming conventions.
-   *Centralized Error Handling:* A single middleware for handling all application errors gracefully.
-   *Consistent API Responses:* Standardized JSON responses ({ status, data, message }) across the API.
-   *Database Integration:* Uses MongoDB with Mongoose for data persistence.
-   *Automated Testing:* Comprehensive integration tests with Jest & Supertest.
-   *CI/CD Pipeline:* GitHub Actions workflow runs tests on every push to main and deploys to Render on success.
-   *Containerization (Bonus):* Includes a Dockerfile for easy containerization.

## Environment Variables

Create a .env file in the project root for local development. For deployment on Render, these should be set in the service's "Environment" settings.
```
#Server configuration
PORT=3000
NODE_ENV=production

#Database URI (e.g., from MongoDB Atlas)
MONGODB_URI=your_production_mongodb_uri

#JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

## Setup and Run Locally

1.  *Clone the repository:*
    ```
    git clone https://github.com/RaghavSingh01/Masai
    cd Backend/Integration-testing
    ```

2.  *Install dependencies:*
    ```
    npm install
    ```

3.  **Set up your .env file** with your local database URI and JWT secret.

4.  *Run the development server:*
    ```
    npm run dev
    ```
    

## Continuous Integration & Deployment (CI/CD)

This project is configured with a GitHub Actions workflow (.github/workflows/ci.yml) that:
1.  Triggers on every push to the main branch.
2.  Sets up a Node.js environment and a MongoDB service container.
3.  Installs all dependencies.
4.  Runs the complete integration test suite.
5.  If tests pass, it triggers a new deployment on Render using a secure Deploy Hook.

This ensures that only tested and verified code reaches production.


