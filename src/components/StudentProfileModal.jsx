import React from 'react';
import { X, Printer, Mail, Phone, MapPin, Calendar, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentProfileModal({ isOpen, onClose, student, grades = [] }) {
  if (!isOpen || !student) return null;

  const studentGrades = grades.filter(g => g.studentId === student.id);

  const handlePrint = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem' }}>Official Student Academic Profile</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={16} />
              Print Report Card
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem', borderRadius: '50%' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Top Profile Header */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-dark)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <img 
              src={student.avatar} 
              alt={student.name} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem' }}>{student.name}</h2>
                <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                  {student.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '0.2rem' }}>
                {student.id} &bull; {student.department}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={14} /> {student.email}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={14} /> {student.phone}</span>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CUMULATIVE GPA</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
                {student.gpa.toFixed(2)}
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATTENDANCE RATE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.2rem' }}>
                {student.attendanceRate}%
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FEE STATUS</div>
              <div style={{ marginTop: '0.4rem' }}>
                <span className={`badge ${student.feeStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                  {student.feeStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Transcripts */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--primary)" /> Course Performance & Marks Breakdown
            </h4>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Subject Title</th>
                    <th>Credits</th>
                    <th>Score (%)</th>
                    <th>Letter Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-muted)' }}>
                        No subject grades uploaded for this term yet.
                      </td>
                    </tr>
                  ) : (
                    studentGrades.map((g, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{g.courseCode}</td>
                        <td style={{ fontWeight: 600 }}>{g.courseName}</td>
                        <td>{g.credits}</td>
                        <td>{g.score}%</td>
                        <td>
                          <span style={{ fontWeight: 800, padding: '0.2rem 0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '6px' }}>
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Close Window</button>
        </div>
      </div>
    </div>
  );
}
