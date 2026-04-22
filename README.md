# Uni-Find

**University Lost & Found Management System**

Uni-Find is a full-stack university lost-and-found management system built to digitize item reporting, browsing, claims, and admin-side item management. The system supports both **Found Portal** and **Lost Portal** workflows through separate user and admin interfaces.

![Status](https://img.shields.io/badge/Status-Active%20Development-gold)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Testing](https://img.shields.io/badge/Testing-Playwright-45ba63?logo=playwright&logoColor=white)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Current Features](#current-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [How to Run the Project](#how-to-run-the-project)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Frontend Routes](#frontend-routes)
- [Backend API Route Groups](#backend-api-route-groups)
- [Core Modules](#core-modules)
- [Testing](#testing)
- [How the System Works](#how-the-system-works)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

---

## About the Project

Uni-Find is designed to reduce the confusion and delays of manual lost-and-found handling inside a university environment.

Instead of depending only on notice boards, security desks, or word of mouth, the system provides a centralized platform where users can:

- browse found items
- report found items
- report lost items
- view lost item details
- manage their own lost reports
- submit claims for found items
- track their claims
- use user and admin dashboards
- manage item records through an admin panel

The repository is organized into two main parts:

- **Frontend** — React + Vite client application
- **Backend** — Express + MongoDB REST API

---

## Current Features

### User Features

- Browse found items
- Browse lost item reports
- View found item details
- View lost item details
- Report a found item with image upload
- Report a lost item with image upload
- Edit personal lost reports
- View personal lost reports
- Submit a claim for a found item
- View personal claim history
- Access a user dashboard
- Access a user profile page

### Admin Features

- Access admin dashboard
- Manage found items
- Manage lost items
- Review submitted claims
- View claim reports
- Add found items manually
- View expired items
- Open admin-side lost item detail views

### System Features

- Separate user and admin layouts
- Protected user routes
- Admin-only routes
- REST API for authentication, claims, found items, and lost items
- MongoDB database integration
- Static image serving through the `uploads/` folder
- Session-based authentication support
- Playwright end-to-end testing scripts in the frontend
- Reusable page structure for future scaling

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, React Router DOM, Axios, React Icons, Recharts |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Multer, CORS, Dotenv, Express Session, Bcrypt |
| **Testing** | Playwright |
| **Development Tools** | npm, Nodemon, ESLint, VS Code, Git, GitHub |

---

## System Architecture

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
      ├── Auth Routes
      ├── Claim Routes
      ├── Found Item Routes
      ├── Lost Item Routes
      └── Static Uploads
      │
      ▼
MongoDB Database
```

### Flow Summary

1. The frontend sends requests to the Express backend.
2. The backend processes the request using routes, controllers, and middleware.
3. MongoDB stores authentication, claim, found-item, and lost-item data.
4. Uploaded images are stored in the `Backend/uploads/` folder.
5. Users and admins interact with different layouts and route groups.
6. Admins manage found items, lost items, and claim-related workflows.

---

## Project Structure

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
│   ├── tests/
│   ├── playwright.config.js
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## How to Run the Project

### 1. Prerequisites

Make sure these are installed on your computer:

- **Node.js** (latest LTS recommended)
- **npm**
- **MongoDB** (local or Atlas)
- **Git**
- A code editor such as **VS Code**

---

### 2. Clone the Repository

```bash
git clone https://github.com/Rakimnr/Uni-Find.git
cd Uni-Find
```

---

### 3. Set Up the Backend

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
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret_here
```

Then start the backend server:

```bash
npm run dev
```

### Expected backend output

```bash
Server is started on PORT 5001
```

If MongoDB is not running or the connection string is incorrect, the backend will fail to start.

---

### 4. Set Up the Frontend

Open a new terminal and run:

```bash
cd Frontend
npm install
npm run dev
```

Because the frontend uses Vite with `--open`, it should open automatically in your browser.

### Expected frontend output

```bash
VITE v...
Local: http://localhost:5173/
```

If it does not open automatically, open this URL manually:

```text
http://localhost:5173/
```

---

### 5. Run Both at the Same Time

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

### 6. First Things to Check After Running

Once both servers are running:

- open the public home page
- check the found items page
- check the lost items page
- test reporting a found item
- test reporting a lost item
- test claim submission
- test my claims
- test my lost reports
- test admin pages

---

## Environment Variables

Create this file:

```text
Backend/.env
```

Use:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/unifind
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret_here
```

### Variable Explanation

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express backend |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `SESSION_SECRET` | Secret used by express-session |

---

## Available Scripts

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

```bash
npm run test:e2e
```

Runs Playwright end-to-end tests.

```bash
npm run test:e2e:headed
```

Runs Playwright tests with a visible browser.

```bash
npm run test:e2e:ui
```

Opens Playwright UI mode.

```bash
npm run test:e2e:report
```

Opens the Playwright HTML report.

---

## Frontend Routes

The current frontend routes are defined in `Frontend/src/App.jsx`.

### Public Routes

| Route | Description |
|---|---|
| `/` | Home browse page |
| `/about` | About page |
| `/login` | Login page |
| `/register` | Register page |

### User Routes

| Route | Description |
|---|---|
| `/found-items` | Browse found items |
| `/lost-items` | Browse lost item reports |
| `/report-found-item` | Report a found item |
| `/report-lost` | Report a lost item |
| `/claims/new/:itemId` | Submit a claim for a found item |
| `/my-claims` | View personal claims |
| `/dashboard` | User dashboard |
| `/profile` | User profile |
| `/lost-reports` | View and manage the user's lost reports |
| `/lost-reports/:id` | View a lost report in detail |
| `/lost-reports/edit/:id` | Edit a lost report |

### Admin Routes

| Route | Description |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/claims` | Review claims |
| `/admin/claim-report` | View claim report page |
| `/admin/found-items` | Manage found items |
| `/admin/lost-items` | Manage lost items |
| `/admin/lost-items/:id` | View lost item details in admin flow |
| `/admin/add-found-item` | Add found item manually |
| `/admin/expired-items` | View expired items |
| `/admin/profile` | Admin profile |

---

## Backend API Route Groups

The backend mounts these main API groups:

| Base Route | Description |
|---|---|
| `/api/auth` | Authentication routes |
| `/api/claims` | Claim routes |
| `/api/found-items` | Found item routes |
| `/api/lost-items` | Lost item routes |
| `/uploads` | Static uploaded images |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Basic API test route |

---

## Core Modules

### 1. Authentication Module

Handles login, registration, and session-based auth flow.

### 2. Found Portal

Covers:

- found item reporting
- found item browsing
- item claim submission
- claim history
- admin found item management

### 3. Lost Portal

Covers:

- lost item reporting
- lost item browsing
- lost item detail viewing
- personal lost report management
- lost report editing
- admin lost item management

### 4. Claim Management

Covers:

- claim creation
- my claims page
- admin claim review
- admin claim reporting

### 5. Dashboard and Profile Module

Covers:

- user dashboard
- admin dashboard
- user profile
- admin profile

---

## Testing

The frontend includes Playwright scripts for end-to-end testing.

### Example commands

```bash
cd Frontend
npm run test:e2e
```

```bash
cd Frontend
npm run test:e2e:headed
```

```bash
cd Frontend
npm run test:e2e:ui
```

```bash
cd Frontend
npm run test:e2e:report
```

### Suggested areas to test

- login and registration flow
- browsing found items
- browsing lost items
- reporting lost items
- reporting found items
- my claims page
- my lost reports page
- admin found item management
- admin lost item management

---

## How the System Works

### Found Item Process

1. A user or admin reports a found item.
2. The frontend sends the item data to the backend.
3. The image is uploaded and stored in `Backend/uploads/`.
4. MongoDB saves the item record.
5. Users can browse the item list.
6. A user can submit a claim for ownership.
7. Admin reviews and manages the claim process.

### Lost Item Process

1. A user reports a lost item.
2. The report is saved in the database.
3. The lost item becomes visible in the lost catalog.
4. The owner can view, edit, and manage their own lost reports.
5. Admin can review lost records from the admin panel.
6. Status changes such as open, possible match, and closed can be managed through the workflow.

### Claim Process

1. A user opens a found item.
2. The user submits a claim form.
3. Claim data is stored in MongoDB.
4. Admin reviews the claim.
5. Admin can approve or reject the request.
6. Item status can be updated based on the claim outcome.

---

## Troubleshooting

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
- variable names are spelled correctly

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

### 5. Session or login issue

Check:

- backend is running on the expected port
- `CLIENT_URL` matches the frontend URL
- `SESSION_SECRET` exists in `.env`
- browser cookies are not being blocked
- frontend and backend are both running together

---

### 6. Playwright tests fail to open the app

Check:

- frontend is running on `http://localhost:5173`
- backend is running if the test needs authentication
- Playwright browsers are installed

Install browsers if needed:

```bash
cd Frontend
npx playwright install
```

---

## Future Improvements

This project can be extended with:

- stronger role-based authorization
- email notifications
- smarter lost/found item matching
- cloud image storage
- more analytics and reporting
- improved mobile responsiveness
- audit logs
- advanced search and filtering
- production deployment configuration

---

## Final Summary

Uni-Find is a practical university software project with a clear real-world use case.

It already includes the major building blocks of a campus lost-and-found system:

- authentication flow
- found item reporting
- lost item reporting
- claims
- user dashboards
- admin dashboards
- file uploads
- database storage
- testing support

With continued refinement in security, testing, and deployment, it can become a strong production-style academic system.
