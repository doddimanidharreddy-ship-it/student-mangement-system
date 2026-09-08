import React, { useState } from 'react';
import { GraduationCap, Award, Plus, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Gradebook({ students, courses, grades, onAddGrade, onViewStudent }) {
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.code || '');
  const [score, setScore] = useState(88);

  const calculateGradeDetails = (numScore) => {
    if (numScore >= 90) return { grade: 'O', gpa: 10.0 };
    if (numScore >= 80) return { grade: 'A+', gpa: 9.0 };
    if (numScore >= 70) return { grade: 'A', gpa: 8.0 };
    if (numScore >= 60) return { grade: 'B+', gpa: 7.0 };
    if (numScore >= 50) return { grade: 'B', gpa: 6.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    const courseObj = courses.find(c => c.code === selectedCourse);
    const { grade } = calculateGradeDetails(score);

    onAddGrade({
      studentId: selectedStudent,
      courseCode: selectedCourse,
      courseName: courseObj?.title || selectedCourse,
      score: score,
      grade: grade,
      credits: courseObj?.credits || 3
    });

    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gradebook & CGPA Management (10.0 Scale)</h1>
          <p className="page-subtitle">Record subject scores, auto-calculate letter grades (O, A+, A, B+), and 10-point CGPA scores.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Score Entry Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="var(--primary)" /> Assign Grade Score
          </h3>
          <form onSubmit={handleGradeSubmit}>
            <div className="form-group">
              <label className="form-label">Student</label>
              <select 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="form-select"
              >
                {students.map(s => (
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
              <label className="form-label">Numerical Score (0 - 100%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={score} 
                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                className="form-input" 
              />
            </div>

            {/* Live Grade Preview Pill */}
            <div style={{ padding: '0.85rem', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PROJECTED GRADE:</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {calculateGradeDetails(score).grade}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CGPA POINTS:</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
                  {calculateGradeDetails(score).gpa.toFixed(1)} / 10.0
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle2 size={16} /> Record Grade Score
            </button>
          </form>
        </div>

        {/* Grades Log Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={18} color="var(--info)" /> Transcripts & Recorded Grades
          </h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Transcript</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, idx) => {
                  const studentObj = students.find(s => s.id === g.studentId);
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>
                        {studentObj ? studentObj.name : g.studentId}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{g.courseName}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{g.courseCode}</div>
                      </td>
                      <td><span style={{ fontWeight: 700 }}>{g.score}%</span></td>
                      <td>
                        <span className="badge badge-success">{g.grade}</span>
                      </td>
                      <td>
                        {studentObj && (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => onViewStudent(studentObj)}
                          >
                            View Report
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
