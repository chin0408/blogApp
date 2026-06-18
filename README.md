# MEVN Blog Application

A Full-Stack Blog Application built with the **MEVN Stack** (MongoDB, Express.js, Vue.js, Node.js).

## Description

This application allows users to register, log in, and manage blog posts. Authenticated users can create, read, update, and delete their own posts. Admin users can delete any post. All users (including guests) can view all posts. Authenticated users can comment on blog posts.

---

## Features

- **User Authentication** — Register with email/username/password, login with JWT tokens, password hashing with bcrypt.
- **Blog Post CRUD** — Create, read, update, and delete blog posts.
- **Authorization** — Only post authors can edit/delete their own posts. Admins can delete any post.
- **Comments** — Authenticated users can add comments on blog posts.
- **Error Handling** — Proper error responses and validation on both server and client.

---

## Project Structure

```
s87-s89/
├── server/           # Backend API (Express + MongoDB)
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth middleware (JWT verification)
│   ├── models/       # Mongoose schemas (User, Post, Comment)
│   ├── routes/       # Express route definitions
│   ├── index.js      # Server entry point
│   └── .env          # Environment variables
├── client/           # Frontend (Vue.js 3 + Vite)
│   ├── src/
│   │   ├── views/    # Page components
│   │   ├── stores/   # Pinia state management
│   │   ├── services/ # API service (axios)
│   │   ├── router/   # Vue Router config
│   │   └── assets/   # CSS styles
│   └── index.html
└── README.md
```

---

## Credentials / Test Accounts

### Admin Account
- **Email:** admin@blog.com
- **Password:** admin123

### Regular User Account
- **Email:** user@blog.com
- **Password:** user123

> Note: These accounts must be manually created via the Register page or seeded into the database. Set `isAdmin: true` in MongoDB for the admin account.

---

## Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | Vue.js 3, Vite, Pinia, Vue Router |
| Backend   | Node.js, Express.js |
| Database  | MongoDB (Mongoose) |
| Auth      | JWT, bcryptjs      |
| HTTP      | Axios              |

---

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
```bash
cd server
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Environment Variables (server/.env)
```
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog-app
JWT_SECRET=yourSecretKey
```

---

## API Endpoints

### Auth
| Method | Endpoint             | Description        | Auth |
|--------|----------------------|--------------------|------|
| POST   | /api/users/register  | Register new user  | No   |
| POST   | /api/users/login     | Login user         | No   |
| GET    | /api/users/profile   | Get user profile   | Yes  |

### Posts
| Method | Endpoint         | Description       | Auth   |
|--------|------------------|-------------------|--------|
| GET    | /api/posts       | Get all posts     | No     |
| GET    | /api/posts/:id   | Get single post   | No     |
| POST   | /api/posts       | Create a post     | Yes    |
| PUT    | /api/posts/:id   | Update a post     | Yes (author only) |
| DELETE | /api/posts/:id   | Delete a post     | Yes (author/admin) |

### Comments
| Method | Endpoint              | Description          | Auth   |
|--------|-----------------------|----------------------|--------|
| GET    | /api/comments/:postId | Get post comments    | No     |
| POST   | /api/comments/:postId | Add comment to post  | Yes    |
| DELETE | /api/comments/:id     | Delete a comment     | Yes (author/admin) |

---

## Running the Application

1. Start the backend server: `cd server && npm run dev`
2. Start the frontend dev server: `cd client && npm run dev`
3. Open browser at `http://localhost:5173`

---

© 2025 - MEVN Blog Application (s87-s89 In-Class Prototyping)
