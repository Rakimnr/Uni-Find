# 🎓 Uni-Find

<div align="center">

**University Lost & Found Management System**

A MERN-style web application that helps universities manage found items, student claims, and item return workflows through a centralized digital platform.

![Status](https://img.shields.io/badge/Status-Active%20Development-gold)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Uploads](https://img.shields.io/badge/File%20Uploads-Multer-blue)

</div>

---

## 📚 Table of Contents

- [About the Project](#-about-the-project)
- [Current Features](#-current-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [How to Run the Project](#-how-to-run-the-project)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Frontend Routes](#-frontend-routes)
- [Backend API Endpoints](#-backend-api-endpoints)
- [Database Models](#-database-models)
- [How the System Works](#-how-the-system-works)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Project Notes](#-project-notes)

---

## 📖 About the Project

**Uni-Find** is a university lost-and-found management system built to reduce the confusion and delay of manual lost property handling.

Instead of depending on notice boards, security desks, or word of mouth, this system provides a single web platform where users can:

- report found items
- browse available items
- submit ownership claims
- track submitted claims
- manage items through an admin panel

The current repository is organized into two main parts:

- **Frontend** — React + Vite client application
- **Backend** — Express + MongoDB REST API

This project is a strong base for a full campus-wide lost-and-found portal and can be extended further with authentication, notifications, and smarter item matching.

---

## ✨ Current Features

### 👤 User Features
- Browse all found items
- View item details
- Report a found item with image upload
- Submit a claim for an item
- View personal claim history
- Access a user dashboard

### 👑 Admin Features
- Access admin dashboard
- Review submitted claims
- Approve or reject claims
- Manage found items
- Add found items manually
- View expired items

### 🧩 System Features
- REST API for found items and claims
- MongoDB database integration
- Static image serving through the `uploads/` folder
- Clean separation between frontend and backend
- Reusable layouts for user and admin pages

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM, Axios, React Icons, CSS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Multer, JWT, CORS, Dotenv |
| **Development Tools** | npm, Nodemon, ESLint, VS Code, Git |

---

## 🏗 System Architecture

```text
Users / Admin
      │
      ▼
Frontend (React + Vite)
      │
      ▼
Axios HTTP Requests
      │
      ▼
Backend API (Node.js + Express)
      │
      ├── Found Item Routes
      ├── Claim Routes
      ├── Middleware
      └── Static Uploads
      │
      ▼
MongoDB Database
```

### Flow Summary
1. The frontend sends requests to the Express backend.
2. The backend processes the request using routes, controllers, and middleware.
3. MongoDB stores item and claim data.
4. Uploaded item images are stored in the `Backend/uploads/` folder.
5. Admins review claims and update claim or item status.

---

## 📁 Project Structure

```bash
Uni-Find/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── uploads/
│   ├── app.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

---

## 🚀 How to Run the Project

## 1. Prerequisites

Make sure these are installed on your computer:

- **Node.js** (recommended: latest LTS version)
- **npm**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**
- A code editor such as **VS Code**

---

## 2. Clone the Repository

```bash
git clone https://github.com/Rakimnr/Uni-Find.git
cd Uni-Find
```

---

## 3. Set Up the Backend

Open a terminal and run:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder.

Example:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/unifind
JWT_SECRET=your_secret_key_here
```

Then start the backend server:

```bash
npm run dev
```

### Expected backend console output
You should see something similar to:

```bash
Connected to MongoDB
Server is started on PORT 5001
```

If MongoDB is not running or your connection string is incorrect, the backend will fail to start.

---

## 4. Set Up the Frontend

Open a **new terminal** and run:

```bash
cd Frontend
npm install
npm run dev
```

Because the frontend uses Vite with `--open`, it should automatically open in your browser.

### Expected frontend output

```bash
VITE v...
Local: http://localhost:5173/
```

If the browser does not open automatically, open this URL manually:

```text
http://localhost:5173/
```

---

## 5. Run Both at the Same Time

To use the project correctly:

- keep the **backend running**
- keep the **frontend running**
- make sure MongoDB is connected

### Recommended terminal setup

**Terminal 1**
```bash
cd Backend
npm run dev
```

**Terminal 2**
```bash
cd Frontend
npm run dev
```

---

## 6. First Things to Check After Running

Once both servers are running:

- open the frontend home page
- test adding a found item
- check whether the image is uploaded correctly
- try submitting a claim
- open admin pages and verify claim review pages load

---

## ⚙️ Environment Variables

Create this file:

```text
Backend/.env
```

Use the following variables:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/unifind
JWT_SECRET=your_secret_key_here
```

### Variable Explanation

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express backend |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key reserved for JWT-related features |

> **Note:** JWT is installed in the backend, but the current admin protection is still a placeholder and not a full authentication system yet.

---

## 📜 Available Scripts

### Backend Scripts

Run inside `Backend/`:

```bash
npm run dev
```
Starts the backend using **nodemon**.

```bash
npm start
```
Starts the backend using **node**.

### Frontend Scripts

Run inside `Frontend/`:

```bash
npm run dev
```
Starts the Vite development server.

```bash
npm start
```
Also starts the Vite development server.

```bash
npm run build
```
Creates a production build.

```bash
npm run preview
```
Previews the production build locally.

```bash
npm run lint
```
Runs ESLint.

---

## 🖥 Frontend Routes

The current frontend routes are defined in `Frontend/src/App.jsx`.

### User Routes

| Route | Description |
|---|---|
| `/` | Displays the found items list |
| `/report-found-item` | Form to report a found item |
| `/claims/new/:itemId` | Claim submission page for a selected item |
| `/my-claims` | Shows claims submitted by the user |
| `/dashboard` | User dashboard |

### Admin Routes

| Route | Description |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/claims` | Review all claims |
| `/admin/found-items` | Manage found items |
| `/admin/add-found-item` | Add a found item from admin side |
| `/admin/expired-items` | View expired items |

---

## 📡 Backend API Endpoints

The backend is mounted through `Backend/src/app.js`.

### Base URL

```text
http://localhost:5001
```

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Basic API test route |

### Found Item Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/found-items` | Get all found items |
| `POST` | `/api/found-items` | Create a found item with image upload |
| `GET` | `/api/found-items/:id` | Get a single found item |
| `PUT` | `/api/found-items/:id` | Update a found item |
| `DELETE` | `/api/found-items/:id` | Delete a found item |
| `PATCH` | `/api/found-items/:id/status` | Update item status |

### Claim Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/claims` | Submit a new claim |
| `GET` | `/api/claims/my` | View the user's claims |
| `GET` | `/api/claims` | View all claims (admin middleware applied) |
| `PATCH` | `/api/claims/:id/status` | Approve or reject a claim |

### Static Uploads

| Path | Description |
|---|---|
| `/uploads` | Serves uploaded item images |

---

## 🗃 Database Models

### Found Item Model
The found item model currently stores:

- title
- description
- category
- image
- found location
- date found
- storage location
- item status
- creator reference

### Allowed Categories
- Electronics
- Documents
- Bags
- Accessories
- Stationery
- Clothing
- Other

### Allowed Item Status Values
- `available`
- `pending_verification`
- `approved_for_return`
- `returned`
- `expired`
- `archived`

### Claim Model
The claim model currently stores:

- item ID
- full name
- student ID
- email
- phone
- reason
- lost location
- lost date
- item description
- unique feature
- contents description
- claim status

### Allowed Claim Status Values
- `pending`
- `approved`
- `rejected`

---

## 🔄 How the System Works

### Found Item Process
1. A user or admin reports a found item.
2. The item data is sent to the backend.
3. The image is uploaded and stored in `Backend/uploads/`.
4. MongoDB saves the item record.
5. The frontend displays the item in the found items list.

### Claim Process
1. A user opens a listed item.
2. The user submits a claim form.
3. Claim data is saved in MongoDB.
4. Admin reviews the claim.
5. Admin can approve or reject the request.
6. Item status can then be updated based on the claim result.

---

## 🧪 Troubleshooting

### 1. `npm install` fails
Try:

```bash
npm cache clean --force
npm install
```

Also make sure you are inside the correct folder:

- `Backend/` for backend install
- `Frontend/` for frontend install

---

### 2. MongoDB connection error
Check:

- MongoDB service is running
- `MONGO_URI` is correct
- `.env` file is placed inside `Backend/`
- there are no spelling mistakes in the variable name

---

### 3. Frontend opens but data does not load
Possible reasons:

- backend is not running
- wrong API base URL in frontend API files
- CORS issue
- MongoDB connection failed

---

### 4. Images are not showing
Check:

- image was uploaded successfully
- backend is serving `/uploads`
- the stored image path is correct
- the `uploads/` folder exists in `Backend/`

---

### 5. Admin routes are not really secured yet
At the moment, the admin middleware is a placeholder. That means the current version is useful for development and demo purposes, but it still needs proper authentication and role-based authorization for production use.

---

## 🔮 Future Improvements

This project can be extended with:

- full user authentication and registration
- real admin login and role-based protection
- lost item reporting module
- smart matching between lost and found items
- search and filter system
- email notifications
- cloud image storage
- mobile responsive UI improvements
- analytics dashboard
- audit logs and claim history

---

## 📝 Project Notes

- The frontend still includes the default Vite README inside `Frontend/README.md`.
- The backend uses `MONGO_URI` for the database connection.
- The backend server serves uploaded images statically.
- The current structure is already clean enough to scale into a larger university portal.

---

## 🙌 Final Summary

Uni-Find is a clean full-stack university project with a practical real-world use case.  
It already includes the main building blocks of a lost-and-found portal:

- item reporting
- claim handling
- admin review
- dashboards
- file uploads
- database storage

With authentication, better admin security, and a polished UI, this project can become a strong production-style academic system.

---
