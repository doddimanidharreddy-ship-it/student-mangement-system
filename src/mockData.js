export const INITIAL_STUDENTS = [
  {
    id: "STU-2026-001",
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    department: "Computer Science",
    year: "3rd Year",
    semester: "Semester 6",
    status: "Active",
    gpa: 3.85,
    attendanceRate: 94,
    feeStatus: "Paid",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 234-5678",
    dob: "2003-05-14",
    address: "742 Evergreen Terrace, Springfield"
  },
  {
    id: "STU-2026-002",
    name: "Benjamin Chen",
    email: "benjamin.c@university.edu",
    department: "Computer Science",
    year: "4th Year",
    semester: "Semester 8",
    status: "Active",
    gpa: 3.92,
    attendanceRate: 98,
    feeStatus: "Paid",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 876-5432",
    dob: "2002-11-20",
    address: "100 Pine Street, Seattle, WA"
  },
  {
    id: "STU-2026-003",
    name: "Sophia Rodriguez",
    email: "sophia.r@university.edu",
    department: "Electrical Eng",
    year: "2nd Year",
    semester: "Semester 4",
    status: "Active",
    gpa: 3.45,
    attendanceRate: 88,
    feeStatus: "Pending",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 345-6789",
    dob: "2004-02-10",
    address: "456 Oak Avenue, Austin, TX"
  },
  {
    id: "STU-2026-004",
    name: "David Kim",
    email: "david.k@university.edu",
    department: "Mechanical Eng",
    year: "3rd Year",
    semester: "Semester 6",
    status: "On Leave",
    gpa: 3.20,
    attendanceRate: 76,
    feeStatus: "Overdue",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 654-3210",
    dob: "2003-09-08",
    address: "789 Maple Drive, Chicago, IL"
  },
  {
    id: "STU-2026-005",
    name: "Emily Watson",
    email: "emily.w@university.edu",
    department: "Data Science",
    year: "1st Year",
    semester: "Semester 2",
    status: "Active",
    gpa: 4.00,
    attendanceRate: 99,
    feeStatus: "Paid",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 432-1098",
    dob: "2005-01-30",
    address: "321 Cedar Lane, Boston, MA"
  },
  {
    id: "STU-2026-006",
    name: "Marcus Johnson",
    email: "marcus.j@university.edu",
    department: "Computer Science",
    year: "2nd Year",
    semester: "Semester 3",
    status: "Active",
    gpa: 3.60,
    attendanceRate: 91,
    feeStatus: "Paid",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 901-2345",
    dob: "2004-07-19",
    address: "654 Birch Boulevard, San Jose, CA"
  }
];

export const INITIAL_COURSES = [
  {
    code: "CS301",
    title: "Database Management Systems",
    department: "Computer Science",
    credits: 4,
    instructor: "Dr. Robert Vance",
    enrolledCount: 42,
    schedule: "Mon/Wed 10:00 AM - 11:30 AM"
  },
  {
    code: "CS302",
    title: "Web Application Engineering",
    department: "Computer Science",
    credits: 3,
    instructor: "Prof. Sarah Jenkins",
    enrolledCount: 58,
    schedule: "Tue/Thu 02:00 PM - 03:30 PM"
  },
  {
    code: "DS201",
    title: "Machine Learning Fundamentals",
    department: "Data Science",
    credits: 4,
    instructor: "Dr. Alan Turing Jr.",
    enrolledCount: 35,
    schedule: "Mon/Fri 01:00 PM - 03:00 PM"
  },
  {
    code: "EE105",
    title: "Digital Electronics & Circuits",
    department: "Electrical Eng",
    credits: 4,
    instructor: "Prof. Michael Faraday",
    enrolledCount: 29,
    schedule: "Wed/Fri 09:00 AM - 10:30 AM"
  },
  {
    code: "ME204",
    title: "Thermodynamics & Heat Transfer",
    department: "Mechanical Eng",
    credits: 3,
    instructor: "Dr. Nikola Tesla",
    enrolledCount: 24,
    schedule: "Tue/Thu 11:00 AM - 12:30 PM"
  }
];

export const INITIAL_GRADES = [
  { studentId: "STU-2026-001", courseCode: "CS301", courseName: "Database Management", score: 92, grade: "A", credits: 4 },
  { studentId: "STU-2026-001", courseCode: "CS302", courseName: "Web Application Eng", score: 88, grade: "A-", credits: 3 },
  { studentId: "STU-2026-001", courseCode: "DS201", courseName: "Machine Learning", score: 95, grade: "A+", credits: 4 },
  { studentId: "STU-2026-002", courseCode: "CS301", courseName: "Database Management", score: 96, grade: "A+", credits: 4 },
  { studentId: "STU-2026-002", courseCode: "CS302", courseName: "Web Application Eng", score: 94, grade: "A", credits: 3 },
  { studentId: "STU-2026-003", courseCode: "EE105", courseName: "Digital Electronics", score: 79, grade: "B+", credits: 4 },
  { studentId: "STU-2026-005", courseCode: "DS201", courseName: "Machine Learning", score: 99, grade: "A+", credits: 4 }
];

export const INITIAL_FEES = [
  { id: "FEE-801", studentId: "STU-2026-001", studentName: "Alex Morgan", totalAmount: 4500, paidAmount: 4500, status: "Paid", dueDate: "2026-08-15" },
  { id: "FEE-802", studentId: "STU-2026-002", studentName: "Benjamin Chen", totalAmount: 4500, paidAmount: 4500, status: "Paid", dueDate: "2026-08-15" },
  { id: "FEE-803", studentId: "STU-2026-003", studentName: "Sophia Rodriguez", totalAmount: 4500, paidAmount: 2500, status: "Pending", dueDate: "2026-09-30" },
  { id: "FEE-804", studentId: "STU-2026-004", studentName: "David Kim", totalAmount: 4500, paidAmount: 0, status: "Overdue", dueDate: "2026-07-01" },
  { id: "FEE-805", studentId: "STU-2026-005", studentName: "Emily Watson", totalAmount: 4800, paidAmount: 4800, status: "Paid", dueDate: "2026-08-15" },
  { id: "FEE-806", studentId: "STU-2026-006", studentName: "Marcus Johnson", totalAmount: 4500, paidAmount: 4500, status: "Paid", dueDate: "2026-08-15" }
];

export const SYSTEM_DOCS = {
  architecture: `
+-----------------------------------------------------------------------+
|                           CLIENT LAYER                                |
|   +-----------------------+   +-------------------+  +------------+   |
|   | Admin Web Dashboard   |   | Student Portal    |  | Mobile App |   |
|   +-----------------------+   +-------------------+  +------------+   |
+-----------------------------------||----------------------------------+
                                    || (REST / GraphQL API over HTTPS)
+-----------------------------------\/----------------------------------+
|                         API GATEWAY & AUTH                            |
|       - Rate Limiting   - CORS Policy   - JWT Authentication          |
+-----------------------------------||----------------------------------+
                                    ||
+-----------------------------------\/----------------------------------+
|                           BACKEND SERVICES                            |
|  +----------------+  +-----------------+  +------------------------+  |
|  | Student Service|  | Academic/Course |  | Attendance & Grading   |  |
|  +----------------+  +-----------------+  +------------------------+  |
|  | Finance/Fees   |  | Notification    |  | Reports & Analytics    |  |
|  +----------------+  +-----------------+  +------------------------+  |
+-----------------------------------||----------------------------------+
                                    ||
+-----------------------------------\/----------------------------------+
|                          DATABASE & STORAGE                           |
|  +-----------------------------+     +-----------------------------+  |
|  | Relational DB (PostgreSQL)  |     | Cache/Session (Redis)       |  |
|  | - Core entities & ACID ops  |     | - Fast token lookup         |  |
|  +-----------------------------+     +-----------------------------+  |
+-----------------------------------------------------------------------+
`,

  sqlSchema: `-- STUDENT MANAGEMENT SYSTEM DATABASE SCHEMA (PostgreSQL / MySQL)

-- 1. USERS & ROLES TABLE
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. STUDENTS TABLE
CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10),
    phone VARCHAR(20),
    address TEXT,
    department VARCHAR(100) NOT NULL,
    enrollment_year INT NOT NULL,
    current_semester INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'GRADUATED', 'SUSPENDED', 'ON_LEAVE'))
);

-- 3. COURSES TABLE
CREATE TABLE courses (
    course_code VARCHAR(20) PRIMARY KEY,
    course_title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT NOT NULL CHECK (credits > 0),
    description TEXT
);

-- 4. ENROLLMENTS TABLE (Many-to-Many relationship)
CREATE TABLE enrollments (
    enrollment_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(student_id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL,
    semester INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_code, academic_year, semester)
);

-- 5. ATTENDANCE TABLE
CREATE TABLE attendance (
    attendance_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(student_id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    remarks VARCHAR(255),
    UNIQUE(student_id, course_code, date)
);

-- 6. GRADES TABLE
CREATE TABLE grades (
    grade_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(student_id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    grade_letter VARCHAR(2) NOT NULL,
    gpa_points DECIMAL(3,2) NOT NULL,
    semester INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL
);

-- 7. FEE TRANSACTIONS TABLE
CREATE TABLE fees (
    fee_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(student_id) ON DELETE CASCADE,
    fee_type VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'OVERDUE', 'PARTIAL'))
);
`,

  apiEndpoints: [
    { method: "POST", path: "/api/v1/auth/login", desc: "Authenticate user and return JWT bearer token" },
    { method: "GET", path: "/api/v1/students", desc: "Get paginated list of students with filter/search queries" },
    { method: "POST", path: "/api/v1/students", desc: "Create a new student record (Admin only)" },
    { method: "GET", path: "/api/v1/students/:id", desc: "Get full profile, enrollments, and academic summary of a student" },
    { method: "PUT", path: "/api/v1/students/:id", desc: "Update student profile details" },
    { method: "DELETE", path: "/api/v1/students/:id", desc: "Soft delete or archive student record" },
    { method: "POST", path: "/api/v1/attendance/batch", desc: "Mark bulk attendance for a course section" },
    { method: "GET", path: "/api/v1/students/:id/report-card", desc: "Generate semester GPA and official grade summary transcript" },
    { method: "POST", path: "/api/v1/fees/pay", desc: "Record fee payment and issue receipt transaction" }
  ]
};
