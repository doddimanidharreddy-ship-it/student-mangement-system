import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Save, UserCheck } from 'lucide-react';

export default function AttendanceTracker({ students, courses, onSaveAttendance }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.code || 'CS301');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState(
    students.reduce((acc, curr) => {
      acc[curr.id] = 'Present';
      return acc;
    }, {})
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    onSaveAttendance(selectedCourse, date, records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const courseObj = courses.find(c => c.code === selectedCourse);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Tracking Ledger</h1>
          <p className="page-subtitle">Batch record daily student presence, absences, and leave status.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          Commit Attendance Records
        </button>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> Attendance records committed successfully for {selectedCourse} on {date}.
        </div>
      )}

      {/* Control Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Course Section</label>
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
            <label className="form-label">Session Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="form-input" 
            />
          </div>

          <div style={{ padding: '0.75rem', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.825rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>Class Schedule:</div>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{courseObj?.schedule || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Current Rate</th>
              <th>Mark Today's Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => {
              const currentStatus = records[stu.id] || 'Present';
              return (
                <tr key={stu.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stu.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={stu.avatar} 
                        alt={stu.name} 
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontWeight: 600 }}>{stu.name}</span>
                    </div>
                  </td>
                  <td>{stu.department}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: stu.attendanceRate >= 85 ? 'var(--success)' : 'var(--warning)' }}>
                      {stu.attendanceRate}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleStatusChange(stu.id, 'Present')}
                        className={`btn btn-sm ${currentStatus === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                        style={currentStatus === 'Present' ? { background: 'var(--success)', color: 'white' } : {}}
                      >
                        <CheckCircle2 size={14} /> Present
                      </button>
                      
                      <button 
                        onClick={() => handleStatusChange(stu.id, 'Late')}
                        className={`btn btn-sm ${currentStatus === 'Late' ? 'btn-primary' : 'btn-secondary'}`}
                        style={currentStatus === 'Late' ? { background: 'var(--warning)', color: 'white' } : {}}
                      >
                        <Clock size={14} /> Late
                      </button>

                      <button 
                        onClick={() => handleStatusChange(stu.id, 'Absent')}
                        className={`btn btn-sm ${currentStatus === 'Absent' ? 'btn-primary' : 'btn-secondary'}`}
                        style={currentStatus === 'Absent' ? { background: 'var(--danger)', color: 'white' } : {}}
                      >
                        <XCircle size={14} /> Absent
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
  );
}
