import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');
const REAL_DATA_FILE = path.join(__dirname, 'realData.json');

class PureJsDatabase {
  constructor() {
    this.data = {
      users: [],
      students: [],
      courses: [],
      grades: [],
      fees: []
    };
  }

  async load() {
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      this.data = JSON.parse(content);
    } catch (e) {
      await this.save();
    }
  }

  async save() {
    await fs.writeFile(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  async exec(sql) {
    // Schema creation no-op for JSON DB
  }

  async get(query, params = []) {
    await this.load();
    const q = query.toLowerCase();

    if (q.includes('from users')) {
      if (q.includes('count(*)')) return { count: this.data.users.length };
      if (q.includes('where email =')) return this.data.users.find(u => u.email === params[0]);
    }
    if (q.includes('from students')) {
      if (q.includes('where id =')) return this.data.students.find(s => s.id === params[0]);
    }
    if (q.includes('from courses')) {
      if (q.includes('where code =')) return this.data.courses.find(c => c.code === params[0]);
    }
    if (q.includes('from fees')) {
      if (q.includes('where id =')) return this.data.fees.find(f => f.id === params[0]);
      if (q.includes('where studentid =')) return this.data.fees.find(f => f.studentId === params[0]);
    }
    return null;
  }

  async all(query, params = []) {
    await this.load();
    const q = query.toLowerCase();

    if (q.includes('from students')) return [...this.data.students];
    if (q.includes('from courses')) return [...this.data.courses];
    if (q.includes('from fees')) return [...this.data.fees];
    if (q.includes('from grades')) {
      if (q.includes('where studentid =')) return this.data.grades.filter(g => g.studentId === params[0]);
      return [...this.data.grades];
    }
    return [];
  }

  async run(query, params = []) {
    await this.load();
    const q = query.toLowerCase();

    if (q.includes('insert into users')) {
      this.data.users.push({ user_id: params[0], email: params[1], password_hash: params[2], role: params[3] });
    } else if (q.includes('insert into students')) {
      const stuObj = Array.isArray(params[0]) ? {
        id: params[0][0], name: params[0][1], email: params[0][2], department: params[0][3], year: params[0][4], semester: params[0][5], status: params[0][6], gpa: params[0][7], attendanceRate: params[0][8], feeStatus: params[0][9], phone: params[0][10], dob: params[0][11], address: params[0][12], avatar: params[0][13], mentor: params[0][14] || 'Faculty Supervisor'
      } : (typeof params[0] === 'object' ? params[0] : {
        id: params[0], name: params[1], email: params[2], department: params[3], year: params[4], semester: params[5], status: params[6], gpa: params[7], attendanceRate: params[8], feeStatus: params[9], phone: params[10], dob: params[11], address: params[12], avatar: params[13], mentor: params[14] || 'Faculty Supervisor'
      });
      
      const existingIdx = this.data.students.findIndex(s => s.id === stuObj.id);
      if (existingIdx !== -1) this.data.students[existingIdx] = stuObj;
      else this.data.students.unshift(stuObj);
    } else if (q.includes('update students set name =')) {
      const idx = this.data.students.findIndex(s => s.id === params[10]);
      if (idx !== -1) {
        this.data.students[idx] = {
          ...this.data.students[idx],
          name: params[0], email: params[1], department: params[2], year: params[3], semester: params[4], status: params[5], gpa: params[6], attendanceRate: params[7], feeStatus: params[8], phone: params[9]
        };
      }
    } else if (q.includes('update students set gpa =')) {
      const idx = this.data.students.findIndex(s => s.id === params[1]);
      if (idx !== -1) this.data.students[idx].gpa = parseFloat(params[0]);
    } else if (q.includes('update students set feestatus =')) {
      const idx = this.data.students.findIndex(s => s.id === params[1]);
      if (idx !== -1) this.data.students[idx].feeStatus = params[0];
    } else if (q.includes('delete from students where id =')) {
      this.data.students = this.data.students.filter(s => s.id !== params[0]);
    } else if (q.includes('insert into courses')) {
      const courseObj = Array.isArray(params[0]) ? {
        code: params[0][0], title: params[0][1], department: params[0][2], credits: params[0][3], instructor: params[0][4], enrolledCount: params[0][5], schedule: params[0][6]
      } : {
        code: params[0], title: params[1], department: params[2], credits: params[3], instructor: params[4], enrolledCount: 0, schedule: params[5]
      };
      this.data.courses.push(courseObj);
    } else if (q.includes('insert into grades')) {
      this.data.grades.unshift({
        id: Date.now(), studentId: params[0], courseCode: params[1], courseName: params[2], score: params[3], grade: params[4], credits: params[5]
      });
    } else if (q.includes('insert into fees')) {
      const feeObj = Array.isArray(params[0]) ? {
        id: params[0][0], studentId: params[0][1], studentName: params[0][2], totalAmount: params[0][3], paidAmount: params[0][4], status: params[0][5], dueDate: params[0][6]
      } : {
        id: params[0], studentId: params[1], studentName: params[2], totalAmount: params[3], paidAmount: params[4], status: params[5], dueDate: params[6]
      };
      this.data.fees.push(feeObj);
    } else if (q.includes('update fees set paidamount =')) {
      const idx = this.data.fees.findIndex(f => f.id === params[2]);
      if (idx !== -1) {
        this.data.fees[idx].paidAmount = params[0];
        this.data.fees[idx].status = params[1];
      }
    }

    await this.save();
  }
}

export async function initDb() {
  const db = new PureJsDatabase();
  await db.load();

  // Load Real Excel Data
  try {
    const rawReal = await fs.readFile(REAL_DATA_FILE, 'utf-8');
    const realObj = JSON.parse(rawReal);
    db.data.students = realObj.students;
    await db.save();
  } catch (err) {
    console.warn('Real data file load notice:', err.message);
  }

  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const studentHash = await bcrypt.hash('student123', 10);

    await db.run('INSERT INTO users VALUES (?, ?, ?, ?)', ['U-001', 'admin@university.edu', adminHash, 'ADMIN']);
    await db.run('INSERT INTO users VALUES (?, ?, ?, ?)', ['U-002', 'teacher@university.edu', teacherHash, 'TEACHER']);
    await db.run('INSERT INTO users VALUES (?, ?, ?, ?)', ['U-003', 'student@university.edu', studentHash, 'STUDENT']);

    // Seed Courses
    const initialCourses = [
      ['AI-301', 'Artificial Intelligence & Neural Networks', 'Artificial Intelligence (AI Forge)', 4, 'Dr. Saju Raj & SASI KUMAR', 120, 'Mon/Wed 10:00 AM - 11:30 AM'],
      ['AI-302', 'Deep Learning & Computer Vision', 'Artificial Intelligence (AI Forge)', 4, 'Dr. Kanimozhisekar & Mahendra Kumar', 95, 'Tue/Thu 02:00 PM - 03:30 PM'],
      ['AI-201', 'Python Data Science & Machine Learning', 'Artificial Intelligence (AI Forge)', 3, 'Dr. F. Sheeja Mary & Dr. S. Rajiv', 136, 'Mon/Fri 01:00 PM - 03:00 PM'],
      ['CS301', 'Database Management Systems', 'Computer Science', 4, 'Dr. Robert Vance', 42, 'Wed/Fri 09:00 AM - 10:30 AM']
    ];

    for (const c of initialCourses) {
      await db.run('INSERT INTO courses VALUES (?, ?, ?, ?, ?, ?, ?)', [c]);
    }

    // Seed Fees for top students
    for (let i = 0; i < Math.min(20, db.data.students.length); i++) {
      const s = db.data.students[i];
      await db.run('INSERT INTO fees VALUES (?, ?, ?, ?, ?, ?, ?)', [
        `FEE-${801 + i}`, s.id, s.name, 4500, s.feeStatus === 'Paid' ? 4500 : 2500, s.feeStatus, '2026-08-15'
      ]);
    }
  }

  return db;
}
