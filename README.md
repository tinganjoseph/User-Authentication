User Authentication with MongoDB, Express.js, and Node.js
This project demonstrates a basic user authentication system using MongoDB, Express.js, and Node.js. It allows users to sign up, log in, and access protected routes.

Features
User registration with email and password
Password hashing using bcrypt
User login with authentication tokens (JSON Web Tokens - JWT)
Protected routes that require authentication
Prerequisites
Before running this project, make sure you have the following installed:

Node.js (v12 or higher)
MongoDB database
Getting Started
Clone the repository:
bash
Copy code
git clone https://github.com/tinganjoseph/User-Authentication
cd user-authentication
Install the dependencies:
bash
Copy code
npm install
Configure the environment variables:
Create a .env file in the root directory and add the following:

plaintext
Copy code
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key_for_jwt
Replace your_mongodb_connection_string with your actual MongoDB connection string, and your_secret_key_for_jwt with a secret key for JWT token generation.

Start the server:
bash
Copy code
npm start
The server will run on http://localhost:3000 by default.

API Endpoints
The following API endpoints are available:

POST /api/signup: User registration
POST /api/login: User login
GET /api/profile: Get user profile (requires authentication)
Technologies Used
MongoDB: NoSQL database for user data storage
Express.js: Web framework for building the API
Node.js: JavaScript runtime for server-side development
bcrypt: Library for password hashing
JSON Web Tokens (JWT): For user authentication and token-based sessions
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Special thanks to Tingan Joseph for their helpful code snippets and inspiration.

