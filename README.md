Institutional Attendance Operations Platform (InnoViast)

📌 Overview

This is a full-stack, role-based attendance management system built for institutional and bootcamp environments. It allows administrators and instructors to create cohorts, track daily session attendance, and generate detailed, filterable reports with CSV export capabilities.

Built as Assignment 1 for the InnoViast Full-Stack Product Engineering Track.

🚀 Features

Role-Based Access Control (RBAC): Distinct permissions for Admin, Instructor, and Student.

JWT Authentication: Secure, stateless login and route protection.

Session Management: Upsert pattern implementation for clean, duplicate-free daily attendance records.

Advanced Reporting: Dynamic queries to filter attendance by date ranges, classes, and specific student statuses.

Data Export: Automated flattening of NoSQL data into downloadable CSV reports.

Dashboard Analytics: Concurrent data fetching for high-speed administrative summaries.

💻 Tech Stack

Backend Engine: Node.js, Express.js

Database: MongoDB, Mongoose (ODM)

Security: Bcryptjs (Password Hashing), JSON Web Tokens (JWT)

Utilities: json2csv (Data Export), CORS, Dotenv

🗄️ Database Schema Design

The application utilizes a query-first NoSQL schema design optimized for fast read operations and simple relational population.

1. Users Collection

Stores all platform users. Authentication is handled via a single collection to optimize login queries.

_id: ObjectId

name: String (Required, Trimmed)

email: String (Required, Unique)

passwordHash: String (Required)

role: String (Enum: ['Admin', 'Instructor', 'Student'], Default: Student)

timestamps: true

2. Classes Collection

Acts as the relational glue between Instructors and Students.

_id: ObjectId

className: String (Required, Unique)

instructorId: ObjectId (Ref: User)

students: [ ObjectId ] (Ref: User)

timestamps: true

3. Attendances Collection

Groups records by session/date to minimize database writes (O(1) write per class session).

_id: ObjectId

classId: ObjectId (Ref: Class)

date: Date (Required)

records: Array of Objects

studentId: ObjectId (Ref: User)

status: String (Enum: ['Present', 'Absent', 'Late'])

timestamps: true

🛠️ Local Setup Instructions

Clone the repository

git clone <your-github-repo-link>
cd ProjectName-InnoViast/backend


Install Dependencies

npm install


Environment Variables
Create a .env file in the root of the backend directory:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_signature_key


Run the Server

node server.js


The server will start on http://localhost:5000

🔑 Sample Login Credentials

For Mentor Review and Demo Video purposes, the following credentials have been seeded:

Admin Account

Email: admin@institute.com

Password: admin123

Role: Admin (Full Access)

Instructor Account

Email: instructor@institute.com

Password: teach123

Role: Instructor (Can create classes, mark attendance, view reports)

Student Account

Email: student@institute.com

Password: student123

Role: Student (Restricted Access)