import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

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
        id: params[0][0], name: params[0][1], email: params[0][2], department: params[0][3], year: params[0][4], semester: params[0][5], status: params[0][6], gpa: params[0][7], attendanceRate: params[0][8], feeStatus: params[0][9], phone: params[0][10], dob: params[0][11], address: params[0][12], avatar: params[0][13]
      } : {
        id: params[0], name: params[1], email: params[2], department: params[3], year: params[4], semester: params[5], status: params[6], gpa: params[7], attendanceRate: params[8], feeStatus: params[9], phone: params[10], dob: params[11], address: params[12], avatar: params[13]
      };
      
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
      await db.run('INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [stu]);
    }

    // Seed Courses
    const initialCourses = [
      ['CS301', 'Database Management Systems', 'Computer Science', 4, 'Dr. Robert Vance', 42, 'Mon/Wed 10:00 AM - 11:30 AM'],
      ['CS302', 'Web Application Engineering', 'Computer Science', 3, 'Prof. Sarah Jenkins', 58, 'Tue/Thu 02:00 PM - 03:30 PM'],
      ['DS201', 'Machine Learning Fundamentals', 'Data Science', 4, 'Dr. Alan Turing Jr.', 35, 'Mon/Fri 01:00 PM - 03:00 PM'],
      ['EE105', 'Digital Electronics & Circuits', 'Electrical Eng', 4, 'Prof. Michael Faraday', 29, 'Wed/Fri 09:00 AM - 10:30 AM']
    ];

    for (const c of initialCourses) {
      await db.run('INSERT INTO courses VALUES (?, ?, ?, ?, ?, ?, ?)', [c]);
    }

    // Seed Fees
    const initialFees = [
      ['FEE-801', 'STU-2026-001', 'Alex Morgan', 4500, 4500, 'Paid', '2026-08-15'],
      ['FEE-802', 'STU-2026-002', 'Benjamin Chen', 4500, 4500, 'Paid', '2026-08-15'],
      ['FEE-803', 'STU-2026-003', 'Sophia Rodriguez', 4500, 2500, 'Pending', '2026-09-30'],
      ['FEE-804', 'STU-2026-004', 'David Kim', 4500, 0, 'Overdue', '2026-07-01']
    ];

    for (const f of initialFees) {
      await db.run('INSERT INTO fees VALUES (?, ?, ?, ?, ?, ?, ?)', [f]);
    }
  }

  return db;
}
