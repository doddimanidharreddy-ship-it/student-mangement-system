import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Save, 
  UserCheck, 
  GraduationCap,
  Sparkles,
  Search
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
  // Extract all unique faculty mentors from the real Excel student records
  const uniqueMentors = Array.from(
    new Set(students.map(s => s.mentor).filter(Boolean))
  ).sort();

  // Selected Faculty Mentor persona (default to SASI KUMAR or Dr. Saju Raj)
  const [selectedMentor, setSelectedMentor] = useState(
    uniqueMentors.find(m => m.toUpperCase().includes('SASI')) || uniqueMentors[0] || 'SASI KUMAR'
  );

  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.code || 'AI-301');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [mentorSearch, setMentorSearch] = useState('');

  // Filter students mentored by the selected faculty mentor
  const myStudents = students.filter(s => 
    s.mentor && s.mentor.toLowerCase() === selectedMentor.toLowerCase()
  );

  // Fallback if no specific students assigned
  const displayedStudents = myStudents.length > 0 ? myStudents : students.slice(0, 15);

  const [attendanceRecords, setAttendanceRecords] = useState(
    displayedStudents.reduce((acc, curr) => {
      acc[curr.id] = curr.attendanceRate >= 50 ? 'Present' : 'Absent';
      return acc;
    }, {})
  );

  // Grade Entry State
  const [gradeStudentId, setGradeStudentId] = useState(displayedStudents[0]?.id || '');
  const [gradeScore, setGradeScore] = useState(90);
  const [saveToast, setSaveToast] = useState('');

  const handleStatusChange = (id, status) => {
    setAttendanceRecords(prev => ({ ...prev, [id]: status }));
  };

  const handleCommitAttendance = () => {
    onSaveAttendance(selectedCourse, attendanceDate, attendanceRecords);
    setSaveToast(`Attendance committed for ${selectedCourse} under Mentor ${selectedMentor}`);
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

  const avgAttRate = Math.round(
    displayedStudents.reduce((acc, curr) => acc + (curr.attendanceRate || 0), 0) / (displayedStudents.length || 1)
  );

  return (
    <div>
      {/* Mentor Persona Selector Banner */}
      <div className="card" style={{ marginBottom: '1.75rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)', border: '1.5px solid var(--primary)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>
              Faculty Mentor Station &bull; AI Forge Roster
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>
              Mentor Dashboard: <span style={{ color: '#ffffff' }}>{selectedMentor}</span>
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Department of Artificial Intelligence &bull; Active Mentees: <strong style={{ color: 'var(--success)' }}>{myStudents.length} Students</strong>
            </p>
          </div>

          {/* Mentor Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-dark)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <UserCheck size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Switch Faculty Mentor:</div>
              <select 
                value={selectedMentor} 
                onChange={(e) => setSelectedMentor(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', outline: 'none', minWidth: '200px' }}
              >
                {uniqueMentors.map(m => (
                  <option key={m} value={m} style={{ background: '#1e293b', color: '#ffffff' }}>
                    {m} ({students.filter(s => s.mentor === m).length} Mentees)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {saveToast && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <CheckCircle2 size={18} /> {saveToast}
        </div>
      )}

      {/* Metrics Row for Selected Mentor */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-label">Assigned Mentees</div>
            <div className="metric-val">{displayedStudents.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Under {selectedMentor}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="metric-label">Active Courses</div>
            <div className="metric-val">{courses.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Forge Curriculum</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="metric-label">Mentee Avg Attendance</div>
            <div className="metric-val">{avgAttRate}%</div>
            <span style={{ fontSize: '0.75rem', color: avgAttRate >= 75 ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
              {avgAttRate >= 75 ? 'Optimal Engagement' : 'Requires Follow-up'}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="metric-label">Mentee Avg CGPA</div>
            <div className="metric-val">8.85 / 10.0</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>10-Point Scale Standing</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Attendance & Grade Entry */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Attendance Marking Station for Mentees */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="var(--success)" /> Mentee Attendance Register
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mark daily attendance for students under mentor {selectedMentor}.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleCommitAttendance}>
              <Save size={14} /> Commit Attendance
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
                {courses.map(c => (
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
                  <th>VTU Roll ID</th>
                  <th>Student Name</th>
                  <th>Contact Phone</th>
                  <th>Attendance Rate</th>
                  <th>Today's Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map(stu => {
                  const status = attendanceRecords[stu.id] || 'Present';
                  return (
                    <tr key={stu.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{stu.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{stu.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{stu.phone}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: stu.attendanceRate >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                          {stu.attendanceRate}%
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => handleStatusChange(stu.id, 'Present')}
                            className={`btn btn-sm ${status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                            style={status === 'Present' ? { background: 'var(--success)', color: 'white', padding: '0.2rem 0.5rem' } : { padding: '0.2rem 0.5rem' }}
                          >
                            Present
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

        {/* Grade Assignment Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--primary)" /> Assign Score to Mentee
          </h3>
          <form onSubmit={handleSubmitGrade}>
            <div className="form-group">
              <label className="form-label">Select Mentee Student</label>
              <select 
                value={gradeStudentId} 
                onChange={(e) => setGradeStudentId(e.target.value)}
                className="form-select"
              >
                {displayedStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course Subject</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="form-select"
              >
                {courses.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Score Percentage (0 - 100%)</label>
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
              <Plus size={16} /> Record Score & Grade
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
