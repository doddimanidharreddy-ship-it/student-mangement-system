import json
import random

with open(r'server/realData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

students = data['students']
mentors = set(data['mentors'])

first_names = [
  "Aarav", "Kavya", "Rohan", "Priya", "Vikram", "Ananya", "Karthik", "Sneha", "Aditya", "Divya",
  "Rahul", "Meera", "Siddharth", "Pooja", "Arjun", "Neha", "Varun", "Isha", "Yash", "Tanvi",
  "Abhinav", "Riya", "Nikhil", "Shreya", "Gautam", "Swati", "Manish", "Deepika", "Pranav", "Tarun",
  "Harsh", "Bhavna", "Kunal", "Archana", "Vijay", "Aakanksha", "Suresh", "Gayathri", "Rajesh", "Nandini"
]

last_names = [
  "Sharma", "Reddy", "Verma", "Patel", "Singh", "Iyer", "Raju", "Kulkarni", "Nair", "Deshmukh",
  "Gupta", "Rao", "Joshi", "Choudhury", "Pillai", "Mehta", "Bhat", "Agarwal", "Mishra", "Pandey",
  "Thakur", "Saxena", "Shetty", "Venkatesh", "Kapoor", "Mukherjee", "Das", "Menon", "Trivedi", "Banerjee"
]

depts_info = [
  {
    "dept": "Computer Science",
    "prefix": "CS",
    "mentors": ["Dr. Robert Vance", "Prof. Sarah Jenkins", "Dr. Alan Turing Jr.", "Prof. E. Codd", "Dr. Grace Hopper"]
  },
  {
    "dept": "Mechanical Eng",
    "prefix": "ME",
    "mentors": ["Dr. Nikola Tesla", "Prof. James Watt", "Dr. Rudolf Diesel", "Prof. Henry Ford", "Dr. Carnot"]
  },
  {
    "dept": "Electrical Eng",
    "prefix": "EE",
    "mentors": ["Prof. Michael Faraday", "Dr. Thomas Edison", "Prof. Gustav Kirchhoff", "Dr. Andre Ampere", "Prof. Georg Ohm"]
  }
]

years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
semesters = {"1st Year": "Semester 2", "2nd Year": "Semester 4", "3rd Year": "Semester 6", "4th Year": "Semester 8"}

added_count = 0

for d_info in depts_info:
    dept_name = d_info["dept"]
    prefix = d_info["prefix"]
    dept_mentors = d_info["mentors"]
    for m in dept_mentors:
        mentors.add(m)

    for i in range(1, 41):  # 40 students per department = 120 total
        first = random.choice(first_names)
        last = random.choice(last_names)
        full_name = f"{first} {last}"
        stu_id = f"VTU-{prefix}-2026-{100 + i}"
        email = f"vtu_{prefix.lower()}{100 + i}@veltech.edu.in"
        year = random.choice(years)
        sem = semesters[year]
        cgpa = round(random.uniform(6.8, 9.8), 2)
        att = random.choice([95, 90, 85, 80, 100, 70, 60])
        fee_st = random.choice(["Paid", "Paid", "Paid", "Pending"])
        phone = f"+91 {random.randint(6000000000, 9999999999)}"
        mentor = random.choice(dept_mentors)

        students.append({
            "id": stu_id,
            "name": full_name,
            "email": email,
            "department": dept_name,
            "year": year,
            "semester": sem,
            "status": "Active",
            "gpa": cgpa,
            "attendanceRate": att,
            "feeStatus": fee_st,
            "phone": phone,
            "mentor": mentor,
            "mentorNo": f"+91 {random.randint(9000000000, 9999999999)}",
            "avatar": f"https://images.unsplash.com/photo-{(1530000000000 + random.randint(1000, 9000000))}?w=150&auto=format&fit=crop&q=80"
        })
        added_count += 1

# Save updated server/realData.json
with open(r'server/realData.json', 'w', encoding='utf-8') as f:
    json.dump({'students': students, 'mentors': list(mentors)}, f, indent=2)

# Update src/mockData.js
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
    code: "CS301",
    title: "Database Management Systems",
    department: "Computer Science",
    credits: 4,
    instructor: "Dr. Robert Vance and Prof. Sarah Jenkins",
    enrolledCount: 88,
    schedule: "Wed/Fri 09:00 AM - 10:30 AM"
  }},
  {{
    code: "ME204",
    title: "Thermodynamics and Heat Transfer",
    department: "Mechanical Eng",
    credits: 3,
    instructor: "Dr. Nikola Tesla and Prof. James Watt",
    enrolledCount: 65,
    schedule: "Tue/Thu 11:00 AM - 12:30 PM"
  }},
  {{
    code: "EE105",
    title: "Digital Electronics and Circuit Analysis",
    department: "Electrical Eng",
    credits: 4,
    instructor: "Prof. Michael Faraday and Dr. Thomas Edison",
    enrolledCount: 72,
    schedule: "Mon/Wed 02:00 PM - 03:30 PM"
  }}
];

export const INITIAL_GRADES = [
  {{ studentId: "{students[0]['id']}", courseCode: "AI-301", courseName: "Artificial Intelligence", score: 92, grade: "O", credits: 4 }},
  {{ studentId: "{students[1]['id']}", courseCode: "CS301", courseName: "Database Systems", score: 88, grade: "A+", credits: 4 }},
  {{ studentId: "{students[2]['id']}", courseCode: "ME204", courseName: "Thermodynamics", score: 95, grade: "O", credits: 3 }}
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
|  | - {len(students)} Student Records across AI, CS, ME, & EE        |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
`,

  sqlSchema: `-- STUDENT MANAGEMENT SYSTEM DATABASE SCHEMA

CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
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
    {{ method: "GET", path: "/api/v1/students", desc: "Get all {len(students)} student records with search and filter queries" }}
  ]
}};
"""

with open(r'src/mockData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully added {added_count} department student records! Total students: {len(students)}")
