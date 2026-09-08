import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDb } from './db.js';
import { verifyToken, requireRole, JWT_SECRET } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

// Initialize Database connection
initDb().then((database) => {
  db = database;
  console.log('⚡ SQLite Database connected successfully!');
  
  app.listen(PORT, () => {
    console.log(`🚀 Student Management System Backend API running on http://localhost:${PORT}`);
  });
}).catch(err => console.error('Database connection failure:', err));

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid user credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid user credentials' });

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: { userId: user.user_id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. STUDENT DIRECTORY API (CRUD)
// ==========================================
app.get('/api/v1/students', async (req, res) => {
  try {
    const students = await db.all('SELECT * FROM students ORDER BY id DESC');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/students/:id', async (req, res) => {
  try {
    const student = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!student) return res.status(404).json({ error: 'Student record not found' });
    
    const grades = await db.all('SELECT * FROM grades WHERE studentId = ?', [req.params.id]);
    const feeRecord = await db.get('SELECT * FROM fees WHERE studentId = ?', [req.params.id]);

    res.json({ ...student, grades, feeRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/students', async (req, res) => {
  const { id, name, email, department, year, semester, status, gpa, attendanceRate, feeStatus, phone, dob, address, avatar } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are mandatory' });

  const studentId = id || `STU-2026-${Math.floor(100 + Math.random() * 900)}`;

  try {
    await db.run(
      `INSERT INTO students (id, name, email, department, year, semester, status, gpa, attendanceRate, feeStatus, phone, dob, address, avatar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, name, email, department || 'Computer Science', year || '1st Year', semester || 'Semester 1', status || 'Active', gpa || 3.5, attendanceRate || 95, feeStatus || 'Paid', phone || '', dob || '', address || '', avatar || '']
    );

    // Auto-create fee entry
    const feeId = `FEE-${Math.floor(800 + Math.random() * 200)}`;
    await db.run(
      'INSERT INTO fees (id, studentId, studentName, totalAmount, paidAmount, status, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [feeId, studentId, name, 4500, feeStatus === 'Paid' ? 4500 : 0, feeStatus || 'Pending', '2026-10-15']
    );

    const newStudent = await db.get('SELECT * FROM students WHERE id = ?', [studentId]);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/v1/students/:id', async (req, res) => {
  const { name, email, department, year, semester, status, gpa, attendanceRate, feeStatus, phone } = req.body;
  
  try {
    await db.run(
      `UPDATE students SET name = ?, email = ?, department = ?, year = ?, semester = ?, status = ?, gpa = ?, attendanceRate = ?, feeStatus = ?, phone = ? WHERE id = ?`,
      [name, email, department, year, semester, status, gpa, attendanceRate, feeStatus, phone, req.params.id]
    );

    const updated = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/v1/students/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student record deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. COURSE CATALOG API
// ==========================================
app.get('/api/v1/courses', async (req, res) => {
  try {
    const courses = await db.all('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/courses', async (req, res) => {
  const { code, title, department, credits, instructor, schedule } = req.body;
  try {
    await db.run(
      'INSERT INTO courses VALUES (?, ?, ?, ?, ?, 0, ?)',
      [code, title, department, credits, instructor, schedule]
    );
    const created = await db.get('SELECT * FROM courses WHERE code = ?', [code]);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. GRADEBOOK API
// ==========================================
app.get('/api/v1/grades', async (req, res) => {
  try {
    const grades = await db.all('SELECT * FROM grades ORDER BY id DESC');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/grades', async (req, res) => {
  const { studentId, courseCode, courseName, score, grade, credits } = req.body;
  try {
    await db.run(
      'INSERT INTO grades (studentId, courseCode, courseName, score, grade, credits) VALUES (?, ?, ?, ?, ?, ?)',
      [studentId, courseCode, courseName, score, grade, credits]
    );

    // Recalculate target student GPA
    const studentGrades = await db.all('SELECT * FROM grades WHERE studentId = ?', [studentId]);
    let totalPts = 0;
    let totalCreds = 0;

    studentGrades.forEach(g => {
      let pts = 4.0;
      if (g.score < 50) pts = 0.0;
      else if (g.score < 60) pts = 2.0;
      else if (g.score < 70) pts = 2.7;
      else if (g.score < 80) pts = 3.3;
      else if (g.score < 90) pts = 3.7;

      totalPts += pts * g.credits;
      totalCreds += g.credits;
    });

    const newGpa = totalCreds > 0 ? (totalPts / totalCreds).toFixed(2) : 3.5;
    await db.run('UPDATE students SET gpa = ? WHERE id = ?', [newGpa, studentId]);

    res.status(201).json({ message: 'Grade recorded & GPA updated', newGpa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. FEE MANAGEMENT API
// ==========================================
app.get('/api/v1/fees', async (req, res) => {
  try {
    const fees = await db.all('SELECT * FROM fees');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/fees/pay', async (req, res) => {
  const { feeId, amount } = req.body;
  try {
    const feeObj = await db.get('SELECT * FROM fees WHERE id = ?', [feeId]);
    if (!feeObj) return res.status(404).json({ error: 'Fee account not found' });

    const newPaid = feeObj.paidAmount + amount;
    const newStatus = newPaid >= feeObj.totalAmount ? 'Paid' : 'Pending';

    await db.run('UPDATE fees SET paidAmount = ?, status = ? WHERE id = ?', [newPaid, newStatus, feeId]);
    await db.run('UPDATE students SET feeStatus = ? WHERE id = ?', [newStatus, feeObj.studentId]);

    res.json({ message: 'Payment recorded successfully', newPaid, newStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System Health Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'UP', service: 'Student Management System API', version: '2.5.0', timestamp: new Date().toISOString() });
});
