# Twitter Clone

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js) that replicates core Twitter functionality.

<img width="900" height="auto" alt="Twitter Clone Screenshot" src="https://github.com/user-attachments/assets/07931438-325d-4428-8c51-ed4a12724d63" />

## Features

- **User Authentication**
  - Secure registration and login
  - Persistent sessions using JWT tokens
  - Cross-browser support

- **Post Management**
  - Create, read, update, and delete posts
  - Like/unlike posts
  - View posts chronologically
  - Edit your own posts
  - Admin controls for content moderation

- **User Profiles**
  - Customizable user descriptions
  - View user's post history
  - Timestamps for posts and account creation

## Live Demo

Visit the live application: [Twitter Clone](https://twitter-clone-frontend-u30x.onrender.com/)

## Technologies Used

- **Frontend:**
  - React
  - React Router for navigation
  - Tailwind CSS for styling
  - Axios for API requests
  - Lucide React for icons

- **Backend:**
  - Node.js & Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcrypt for password hashing

- **Deployment:**
  - Frontend: Render
  - Backend: Render
  - Database: MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/maggieliu11/twitter-clone-Maggie-Tech-Blog.git
cd twitter-clone-Maggie-Tech-Blog
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Configure environment variables
```bash
# In server directory, create .env file with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
PORT=5001

# In client directory, create .env file with:
REACT_APP_API_URL=http://localhost:5001
```

4. Run the application
```bash
# Run backend (from server directory)
npm start

# Run frontend (from client directory)
npm start
```
