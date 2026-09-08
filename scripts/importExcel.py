import json
import os

with open(r'server/realData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

students = data['students']
mentors = data['mentors']

js_content = f"""export const INITIAL_STUDENTS = {json.dumps(students, indent=2)};

export const INITIAL_FACULTY_MENTORS = {json.dumps(mentors, indent=2)};

export const INITIAL_COURSES = [
  {{
    code: "AI-301",
    title: "Artificial Intelligence and Neural Networks",
    department: "Artificial Intelligence (AI Forge)",
    credits: 4,
    instructor: "Dr. Saju Raj and SASI KUMAR",
    enrolledCount: 120,
    schedule: "Mon/Wed 10:00 AM - 11:30 AM"
  }},
  {{
    code: "AI-302",
    title: "Deep Learning and Computer Vision",
    department: "Artificial Intelligence (AI Forge)",
    credits: 4,
    instructor: "Dr. Kanimozhisekar and Mahendra Kumar",
    enrolledCount: 95,
    schedule: "Tue/Thu 02:00 PM - 03:30 PM"
  }},
  {{
    code: "AI-201",
    title: "Python Data Science and Machine Learning",
    department: "Artificial Intelligence (AI Forge)",
    credits: 3,
    instructor: "Dr. F. Sheeja Mary and Dr. S. Rajiv",
    enrolledCount: 136,
    schedule: "Mon/Fri 01:00 PM - 03:00 PM"
  }},
  {{
    code: "CS301",
    title: "Database Management Systems",
    department: "Computer Science",
    credits: 4,
    instructor: "Dr. Robert Vance",
    enrolledCount: 42,
    schedule: "Wed/Fri 09:00 AM - 10:30 AM"
  }}
];

export const INITIAL_GRADES = [
  {{ studentId: "{students[0]['id']}", courseCode: "AI-301", courseName: "Artificial Intelligence", score: 92, grade: "A", credits: 4 }},
  {{ studentId: "{students[1]['id']}", courseCode: "AI-301", courseName: "Artificial Intelligence", score: 88, grade: "A-", credits: 4 }},
  {{ studentId: "{students[2]['id']}", courseCode: "AI-302", courseName: "Deep Learning", score: 95, grade: "A+", credits: 4 }}
];

export const INITIAL_FEES = [
  {{ id: "FEE-801", studentId: "{students[0]['id']}", studentName: "{students[0]['name']}", totalAmount: 4500, paidAmount: 4500, status: "Paid", dueDate: "2026-08-15" }},
  {{ id: "FEE-802", studentId: "{students[1]['id']}", studentName: "{students[1]['name']}", totalAmount: 4500, paidAmount: 4500, status: "Paid", dueDate: "2026-08-15" }},
  {{ id: "FEE-803", studentId: "{students[2]['id']}", studentName: "{students[2]['name']}", totalAmount: 4500, paidAmount: 2500, status: "Pending", dueDate: "2026-09-30" }}
];

export const SYSTEM_DOCS = {{
  architecture: `
+-----------------------------------------------------------------------+
|                           CLIENT LAYER                                |
|   +-----------------------+   +-------------------+  +------------+   |
|   | Admin Web Dashboard   |   | Faculty Portal    |  | Student App|   |
|   +-----------------------+   +-------------------+  +------------+   |
+-----------------------------------||----------------------------------+
                                    || (REST API over HTTPS)
+-----------------------------------\/----------------------------------+
|                         API GATEWAY & SECURITY                        |
|       - Rate Limiting   - CORS Policy   - JWT Authentication (RBAC)   |
+-----------------------------------||----------------------------------+
                                    ||
+-----------------------------------\/----------------------------------+
|                           BACKEND SERVICES                            |
|  +----------------+  +-----------------+  +------------------------+  |
|  | Student Service|  | Course Catalog  |  | Attendance & Grading   |  |
|  +----------------+  +-----------------+  +------------------------+  |
|  | Financial/Fees |  | Notification    |  | Analytics & Transcripts|  |
|  +----------------+  +-----------------+  +------------------------+  |
+-----------------------------------||----------------------------------+
                                    ||
+-----------------------------------\/----------------------------------+
|                          PERSISTENCE LAYER                            |
|  +-----------------------------------------------------------------+  |
|  | Pure JS Database Engine (server/database.json)                   |  |
|  | - 351 Real AI Forge Student Records & Faculty Mentors             |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
`,

  sqlSchema: `-- STUDENT MANAGEMENT SYSTEM DATABASE SCHEMA (PostgreSQL / MySQL / SQLite)

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'))
);

CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    gpa DECIMAL(3,2) DEFAULT 3.5,
    attendance_rate INT DEFAULT 90,
    fee_status VARCHAR(20) DEFAULT 'Paid',
    phone VARCHAR(20),
    mentor VARCHAR(100)
);
`,
  apiEndpoints: [
    {{ method: "POST", path: "/api/v1/auth/login", desc: "Authenticate user and return JWT token" }},
    {{ method: "GET", path: "/api/v1/students", desc: "Get all 351 student records with search and filter queries" }},
    {{ method: "POST", path: "/api/v1/students", desc: "Register a new student" }},
    {{ method: "POST", path: "/api/v1/attendance/batch", desc: "Batch mark attendance for faculty mentor class" }}
  ]
}};
"""

with open(r'src/mockData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Updated src/mockData.js with 351 real students!')
