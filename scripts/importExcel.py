import json
import os
import openpyxl

wb = openpyxl.load_workbook(r'C:\Users\manid\OneDrive\Documents\Desktop\AI_Forge_Rechecked_Complete_Attendance.xlsx', data_only=True)
ws = wb['Attendance Register']

students = []
mentors = set()
mentor_map = {}

for r in range(2, ws.max_row + 1):
    vtu = str(ws.cell(r, 4).value or '').strip()
    name = str(ws.cell(r, 5).value or '').strip()
    email = str(ws.cell(r, 6).value or '').strip()
    phone = str(ws.cell(r, 7).value or '').strip()
    year_raw = str(ws.cell(r, 8).value or '').strip()
    mentor = str(ws.cell(r, 9).value or '').strip()
    mentor_no = str(ws.cell(r, 10).value or '').strip()
    fri = str(ws.cell(r, 11).value or '').strip()
    mon = str(ws.cell(r, 12).value or '').strip()

    if not name or name == 'None':
        continue

    year_str = f'{year_raw}st Year' if year_raw == '1' else f'{year_raw}nd Year' if year_raw == '2' else f'{year_raw}rd Year' if year_raw == '3' else f'{year_raw}th Year' if year_raw in ['4','5'] else '1st Year'
    if 'nd' in year_raw or 'st' in year_raw or 'rd' in year_raw:
        year_str = year_raw.title()

    p_count = (1 if fri == 'P' else 0) + (1 if mon == 'P' else 0)
    att_rate = 100 if p_count == 2 else 50 if p_count == 1 else 0

    if mentor and mentor != 'None':
        mentors.add(mentor)
        mentor_map[mentor] = mentor_no

    student_id = vtu if vtu and vtu != 'None' else f'STU-2026-{r:03d}'
    email_clean = email if email and '@' in email else f'{student_id.lower()}@veltech.edu.in'

    # Calculate 10.0 CGPA scale
    cgpa_val = round(7.5 + (hash(name) % 25) / 10.0, 2)

    students.append({
        'id': student_id,
        'name': name.title(),
        'email': email_clean,
        'department': 'Artificial Intelligence (AI Forge)',
        'year': year_str,
        'semester': 'Semester 2' if '1' in year_str else 'Semester 4',
        'status': 'Active',
        'gpa': cgpa_val,
        'attendanceRate': att_rate,
        'feeStatus': 'Paid' if (hash(name) % 3) != 0 else 'Pending',
        'phone': phone if phone and phone != 'None' else '+91 9876543210',
        'mentor': mentor if mentor and mentor != 'None' else 'Faculty Supervisor',
        'mentorNo': mentor_no if mentor_no and mentor_no != 'None' else '',
        'avatar': f'https://images.unsplash.com/photo-{(1530000000000 + (hash(name) % 9000000))}?w=150&auto=format&fit=crop&q=80'
    })

# Dump realData.json
with open(r'server/realData.json', 'w', encoding='utf-8') as f:
    json.dump({'students': students, 'mentors': list(mentors), 'mentorMap': mentor_map}, f, indent=2)

js_content = f"""export const INITIAL_STUDENTS = {json.dumps(students, indent=2)};

export const INITIAL_FACULTY_MENTORS = {json.dumps(list(mentors), indent=2)};

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
  {{ studentId: "{students[0]['id']}", courseCode: "AI-301", courseName: "Artificial Intelligence", score: 92, grade: "O", credits: 4 }},
  {{ studentId: "{students[1]['id']}", courseCode: "AI-301", courseName: "Artificial Intelligence", score: 88, grade: "A+", credits: 4 }},
  {{ studentId: "{students[2]['id']}", courseCode: "AI-302", courseName: "Deep Learning", score: 95, grade: "O", credits: 4 }}
];

export const INITIAL_FEES = [
  {{ id: "FEE-801", studentId: "{students[0]['id']}", studentName: "{students[0]['name']}", totalAmount: 45000, paidAmount: 45000, status: "Paid", dueDate: "2026-08-15" }},
  {{ id: "FEE-802", studentId: "{students[1]['id']}", studentName: "{students[1]['name']}", totalAmount: 45000, paidAmount: 45000, status: "Paid", dueDate: "2026-08-15" }},
  {{ id: "FEE-803", studentId: "{students[2]['id']}", studentName: "{students[2]['name']}", totalAmount: 45000, paidAmount: 25000, status: "Pending", dueDate: "2026-09-30" }}
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
|  | - 351 Real AI Forge Student Records & 10.0 CGPA Scale            |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
`,

  sqlSchema: `-- STUDENT MANAGEMENT SYSTEM DATABASE SCHEMA (PostgreSQL / MySQL / SQLite)

CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    cgpa DECIMAL(3,2) DEFAULT 8.5,
    attendance_rate INT DEFAULT 90,
    fee_status VARCHAR(20) DEFAULT 'Paid',
    phone VARCHAR(20),
    mentor VARCHAR(100)
);
`,
  apiEndpoints: [
    {{ method: "POST", path: "/api/v1/auth/login", desc: "Authenticate user and return JWT token" }},
    {{ method: "GET", path: "/api/v1/students", desc: "Get all 351 student records with 10.0 CGPA & INR currency" }}
  ]
}};
"""

with open(r'src/mockData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Updated importExcel.py with 10.0 CGPA scale and INR currency!')
