import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Save, 
  FileCheck, 
  AlertCircle,
  GraduationCap,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FacultyDashboard({ 
  students, 
  courses, 
  grades, 
  onSaveAttendance, 
  onAddGrade,
  onViewStudent 
}) {
  // Current logged in professor persona
  const facultyInfo = {
    name: "Prof. Sarah Jenkins",
    department: "Computer Science",
    designation: "Associate Professor & Curriculum Chair",
    assignedCourses: ["CS301", "CS302"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  };

  const myCourses = courses.filter(c => facultyInfo.assignedCourses.includes(c.code) || c.instructor.includes("Jenkins") || c.department === facultyInfo.department);
  const myStudents = students.filter(s => s.department === facultyInfo.department);

  const [selectedCourse, setSelectedCourse] = useState(myCourses[0]?.code || 'CS301');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceRecords, setAttendanceRecords] = useState(
    myStudents.reduce((acc, curr) => {
      acc[curr.id] = 'Present';
      return acc;
    }, {})
  );

  // Grade Entry State
  const [gradeStudentId, setGradeStudentId] = useState(myStudents[0]?.id || '');
  const [gradeScore, setGradeScore] = useState(90);
  const [saveToast, setSaveToast] = useState('');

  const handleStatusChange = (id, status) => {
    setAttendanceRecords(prev => ({ ...prev, [id]: status }));
  };

  const handleCommitAttendance = () => {
    onSaveAttendance(selectedCourse, attendanceDate, attendanceRecords);
    setSaveToast(`Attendance committed for ${selectedCourse} on ${attendanceDate}`);
    confetti({ particleCount: 35, spread: 45 });
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    const courseObj = courses.find(c => c.code === selectedCourse);
    let letter = 'A';
    if (gradeScore >= 95) letter = 'A+';
    else if (gradeScore >= 90) letter = 'A';
    else if (gradeScore >= 85) letter = 'A-';
    else if (gradeScore >= 80) letter = 'B+';
    else if (gradeScore >= 70) letter = 'B';
    else letter = 'C';

    onAddGrade({
      studentId: gradeStudentId,
      courseCode: selectedCourse,
      courseName: courseObj?.title || selectedCourse,
      score: gradeScore,
      grade: letter,
      credits: courseObj?.credits || 3
    });

    setSaveToast(`Grade ${letter} (${gradeScore}%) recorded for student ${gradeStudentId}`);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSaveToast(''), 4000);
  };

  return (
    <div>
      {/* Faculty Hero Banner */}
      <div className="card" style={{ marginBottom: '1.75rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <img 
            src={facultyInfo.avatar} 
            alt={facultyInfo.name} 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: 'var(--shadow-md)' }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {facultyInfo.name}</h1>
              <span className="badge badge-info">{facultyInfo.designation}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Department of {facultyInfo.department} &bull; Spring Academic Semester 2026
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              {facultyInfo.assignedCourses.map(code => (
                <span key={code} style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--bg-card)', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  📖 {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {saveToast && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <CheckCircle2 size={18} /> {saveToast}
        </div>
      )}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-label">Students in My Department</div>
            <div className="metric-val">{myStudents.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Active Roster</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="metric-label">Assigned Courses</div>
            <div className="metric-val">{myCourses.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spring Semester</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="metric-label">Avg Class Attendance</div>
            <div className="metric-val">93%</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>High Engagement</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="metric-label">Department Avg GPA</div>
            <div className="metric-val">3.78</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Top Performing</span>
          </div>
        </div>
      </div>

      {/* Faculty Action Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Quick Attendance Marking Station */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="var(--success)" /> Faculty Class Attendance Station
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select your course section and record today's attendance.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleCommitAttendance}>
              <Save size={14} /> Commit Class Attendance
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Course Section</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="form-select"
              >
                {myCourses.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Lecture Date</label>
              <input 
                type="date" 
                value={attendanceDate} 
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="form-input" 
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Attendance %</th>
                  <th>Mark Today's Status</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.map(stu => {
                  const status = attendanceRecords[stu.id] || 'Present';
                  return (
                    <tr key={stu.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stu.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img src={stu.avatar} alt={stu.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600 }}>{stu.name}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: stu.attendanceRate >= 85 ? 'var(--success)' : 'var(--warning)' }}>
                          {stu.attendanceRate}%
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => handleStatusChange(stu.id, 'Present')}
                            className={`btn btn-sm ${status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                            style={status === 'Present' ? { background: 'var(--success)', color: 'white', padding: '0.2rem 0.5rem' } : { padding: '0.2rem 0.5rem' }}
                          >
                            Present
                          </button>
                          <button 
                            onClick={() => handleStatusChange(stu.id, 'Late')}
                            className={`btn btn-sm ${status === 'Late' ? 'btn-primary' : 'btn-secondary'}`}
                            style={status === 'Late' ? { background: 'var(--warning)', color: 'white', padding: '0.2rem 0.5rem' } : { padding: '0.2rem 0.5rem' }}
                          >
                            Late
                          </button>
                          <button 
                            onClick={() => handleStatusChange(stu.id, 'Absent')}
                            className={`btn btn-sm ${status === 'Absent' ? 'btn-primary' : 'btn-secondary'}`}
                            style={status === 'Absent' ? { background: 'var(--danger)', color: 'white', padding: '0.2rem 0.5rem' } : { padding: '0.2rem 0.5rem' }}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Score Desk */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--primary)" /> Submit Exam / Assignment Grade
          </h3>
          <form onSubmit={handleSubmitGrade}>
            <div className="form-group">
              <label className="form-label">Select Student</label>
              <select 
                value={gradeStudentId} 
                onChange={(e) => setGradeStudentId(e.target.value)}
                className="form-select"
              >
                {myStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="form-select"
              >
                {myCourses.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Exam Score (0 - 100%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={gradeScore} 
                onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                className="form-input" 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Plus size={16} /> Record Grade Score
            </button>
          </form>
        </div>
      </div>

      {/* Department Course Roster Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Faculty Assigned Courses & Enrolled Rosters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {myCourses.map(course => (
            <div key={course.code} style={{ padding: '1.25rem', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {course.code}
                </span>
                <span className="badge badge-info">{course.credits} Credits</span>
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{course.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor: <strong>{course.instructor}</strong></p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Schedule: {course.schedule}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.825rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{course.enrolledCount} Enrolled Students</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCourse(course.code)}>
                  Manage Roster
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
