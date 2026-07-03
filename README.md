# Innoviast Attendance Management System

## Overview

This is a full-stack, role-based digital attendance management system built for institutional, bootcamp, and office team environments. Developed as a core task during my internship at Innoviast, this platform bridges a secure REST API with a modern React frontend. It allows administrators and instructors to provision user identities, compile cohorts, track daily session attendance, and extract filterable data logs through a high-contrast, glassmorphism-styled UI.

## Features

- Role-Based Access Control (RBAC): Distinct routing, UI rendering, and database permissions for three tiers: Admin, Instructor, and Student.

- Identity Access Management: Admins can provision, modify, and terminate user credentials, with strict backend rules preventing the deletion of other Admins.

- Dynamic Cohort Configuration: Assign specific Lead Instructors to classes and toggle live student enrollments.

- Frictionless Roll Call: Upsert pattern implementation for clean, duplicate-free daily attendance records (Present, Absent, Late).

- Advanced Reporting & Extraction: Dynamic queries to filter attendance logs by date ranges, specific cohorts, and student statuses, coupled with token-authenticated CSV exports.

- Student Hub: A secure, read-only dashboard where students can only query their specific attendance records.

## Tech Stack

### Frontend:

- React.js

- Tailwind CSS (Custom glassmorphism & dark theme UI)

- Lucide-React (Icons)

### Backend:

- Node.js & Express.js

- MongoDB & Mongoose (ODM)

- JSON Web Tokens (JWT) for stateless authentication

- Bcryptjs for password hashing

- json2csv for automated data flattening and export

## Setup Steps

### 1. Clone the repository
```bash
git clone <your-github-repo-link>
cd <repository-folder>
```

### 2. Backend Initialization

Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a .env file in the root of the backend directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_signature_key
```

Start the server:
```bash
node server.js
```

## 3. Frontend Initialization

Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm run dev
```

The application will now be running on http://localhost:5173.

## Schema

The application utilizes a query-first NoSQL schema design optimized for fast read operations and simple relational population.

### 1. Users Collection

Stores all platform users. Authentication is handled via a single collection to optimize login queries.

- _id: ObjectId

- name: String (Required, Trimmed)

- email: String (Required, Unique)

- passwordHash: String (Required)

- role: String (Enum: ['Admin', 'Instructor', 'Student'], Default: Student)

### 2. Classes Collection

Acts as the relational glue between Instructors and Students.

- _id: ObjectId

- className: String (Required, Unique)

- instructorId: ObjectId (Ref: User)

- students: [ ObjectId ] (Ref: User)

### 3. Attendances Collection

Groups records by session/date to minimize database writes (O(1) write per class session).

- _id: ObjectId

- classId: ObjectId (Ref: Class)

- date: Date (Required)

- records: Array of Objects

- studentId: ObjectId (Ref: User)

- status: String (Enum: ['Present', 'Absent', 'Late'])

## Deployment Link

[Insert Your Live Vercel/Render/Heroku Link Here]

### Author: Muhammad Rayyan — Lahore, Pakistan.
