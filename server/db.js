import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDb() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Enable Foreign Keys
  await db.run('PRAGMA foreign_keys = ON;');

  // Create Tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'))
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      year TEXT NOT NULL,
      semester TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      gpa REAL DEFAULT 3.5,
      attendanceRate INTEGER DEFAULT 90,
      feeStatus TEXT DEFAULT 'Paid',
      phone TEXT,
      dob TEXT,
      address TEXT,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      code TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      credits INTEGER NOT NULL,
      instructor TEXT NOT NULL,
      enrolledCount INTEGER DEFAULT 0,
      schedule TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId TEXT NOT NULL,
      courseCode TEXT NOT NULL,
      courseName TEXT NOT NULL,
      score INTEGER NOT NULL,
      grade TEXT NOT NULL,
      credits INTEGER NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fees (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      studentName TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      paidAmount REAL DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      dueDate TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // Seed Default Users & Initial Data if empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const studentHash = await bcrypt.hash('student123', 10);

    await db.run('INSERT INTO users VALUES (?, ?, ?, ?)', ['U-001', 'admin@university.edu', adminHash, 'ADMIN']);
    await db.run('INSERT INTO users VALUES (?, ?, ?, ?)', ['U-002', 'teacher@university.edu', teacherHash, 'TEACHER']);
    await db.run('INSERT INTO users VALUES (?, ?, ?, ?)', ['U-003', 'student@university.edu', studentHash, 'STUDENT']);

    // Seed Initial Students
    const initialStudents = [
      ['STU-2026-001', 'Alex Morgan', 'alex.morgan@university.edu', 'Computer Science', '3rd Year', 'Semester 6', 'Active', 3.85, 94, 'Paid', '+1 (555) 234-5678', '2003-05-14', '742 Evergreen Terrace', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'],
      ['STU-2026-002', 'Benjamin Chen', 'benjamin.c@university.edu', 'Computer Science', '4th Year', 'Semester 8', 'Active', 3.92, 98, 'Paid', '+1 (555) 876-5432', '2002-11-20', '100 Pine Street', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'],
      ['STU-2026-003', 'Sophia Rodriguez', 'sophia.r@university.edu', 'Electrical Eng', '2nd Year', 'Semester 4', 'Active', 3.45, 88, 'Pending', '+1 (555) 345-6789', '2004-02-10', '456 Oak Avenue', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'],
      ['STU-2026-004', 'David Kim', 'david.k@university.edu', 'Mechanical Eng', '3rd Year', 'Semester 6', 'On Leave', 3.20, 76, 'Overdue', '+1 (555) 654-3210', '2003-09-08', '789 Maple Drive', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'],
      ['STU-2026-005', 'Emily Watson', 'emily.w@university.edu', 'Data Science', '1st Year', 'Semester 2', 'Active', 4.00, 99, 'Paid', '+1 (555) 432-1098', '2005-01-30', '321 Cedar Lane', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80']
    ];

    for (const stu of initialStudents) {
      await db.run(
        `INSERT INTO students (id, name, email, department, year, semester, status, gpa, attendanceRate, feeStatus, phone, dob, address, avatar) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        stu
      );
    }

    // Seed Courses
    const initialCourses = [
      ['CS301', 'Database Management Systems', 'Computer Science', 4, 'Dr. Robert Vance', 42, 'Mon/Wed 10:00 AM - 11:30 AM'],
      ['CS302', 'Web Application Engineering', 'Computer Science', 3, 'Prof. Sarah Jenkins', 58, 'Tue/Thu 02:00 PM - 03:30 PM'],
      ['DS201', 'Machine Learning Fundamentals', 'Data Science', 4, 'Dr. Alan Turing Jr.', 35, 'Mon/Fri 01:00 PM - 03:00 PM'],
      ['EE105', 'Digital Electronics & Circuits', 'Electrical Eng', 4, 'Prof. Michael Faraday', 29, 'Wed/Fri 09:00 AM - 10:30 AM']
    ];

    for (const c of initialCourses) {
      await db.run('INSERT INTO courses VALUES (?, ?, ?, ?, ?, ?, ?)', c);
    }

    // Seed Fees
    const initialFees = [
      ['FEE-801', 'STU-2026-001', 'Alex Morgan', 4500, 4500, 'Paid', '2026-08-15'],
      ['FEE-802', 'STU-2026-002', 'Benjamin Chen', 4500, 4500, 'Paid', '2026-08-15'],
      ['FEE-803', 'STU-2026-003', 'Sophia Rodriguez', 4500, 2500, 'Pending', '2026-09-30'],
      ['FEE-804', 'STU-2026-004', 'David Kim', 4500, 0, 'Overdue', '2026-07-01']
    ];

    for (const f of initialFees) {
      await db.run('INSERT INTO fees VALUES (?, ?, ?, ?, ?, ?, ?)', f);
    }
  }

  return db;
}
