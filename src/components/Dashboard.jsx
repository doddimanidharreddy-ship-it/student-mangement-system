import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  GraduationCap, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  UserPlus 
} from 'lucide-react';

export default function Dashboard({ students, courses, fees, setActiveTab, onAddStudent }) {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const avgGpa = (students.reduce((acc, curr) => acc + curr.gpa, 0) / (totalStudents || 1)).toFixed(2);
  const avgAttendance = Math.round(students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / (totalStudents || 1));

  const totalCollected = fees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = fees.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);

  // Department distribution count
  const deptCounts = students.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Top Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic Control Dashboard</h1>
          <p className="page-subtitle">Real-time stats on enrollment, performance, attendance, and finances.</p>
        </div>
        <button onClick={onAddStudent} className="btn btn-primary">
          <UserPlus size={18} />
          Register Student
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-label">Total Students</div>
            <div className="metric-val">{totalStudents}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <CheckCircle2 size={12} /> {activeStudents} Active Enrolled
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="metric-label">Average GPA</div>
            <div className="metric-val">{avgGpa} / 4.0</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Institutional Overall</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="metric-label">Avg Attendance</div>
            <div className="metric-val">{avgAttendance}%</div>
            <span style={{ fontSize: '0.75rem', color: avgAttendance >= 85 ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
              {avgAttendance >= 85 ? 'Above Threshold' : 'Needs Attention'}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-label">Fee Collection</div>
            <div className="metric-val">${totalCollected.toLocaleString()}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>
              ${totalPending.toLocaleString()} Pending Dues
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Department Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Department Enrollment</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('students')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / (totalStudents || 1)) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    <span>{dept}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} Students ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${pct}%`, 
                        background: 'linear-gradient(90deg, #6366f1, #10b981)',
                        borderRadius: '9999px'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick System Actions */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Quick Operational Modules</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div 
              onClick={() => setActiveTab('attendance')} 
              style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
              className="card-hover"
            >
              <div style={{ color: 'var(--info)', marginBottom: '0.5rem' }}><TrendingUp size={22} /></div>
              <h4 style={{ fontSize: '0.95rem' }}>Mark Attendance</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Record daily subject presence</p>
            </div>

            <div 
              onClick={() => setActiveTab('gradebook')} 
              style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
              className="card-hover"
            >
              <div style={{ color: 'var(--success)', marginBottom: '0.5rem' }}><GraduationCap size={22} /></div>
              <h4 style={{ fontSize: '0.95rem' }}>Update Grades</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Assign marks & generate report card</p>
            </div>

            <div 
              onClick={() => setActiveTab('fees')} 
              style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }}
              className="card-hover"
            >
              <div style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}><DollarSign size={22} /></div>
              <h4 style={{ fontSize: '0.95rem' }}>Collect Fees</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Log payments & view overdue list</p>
            </div>

            <div 
              onClick={() => setActiveTab('guide')} 
              style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-dark)', border: '1px dashed var(--primary)', cursor: 'pointer', transition: 'all 0.2s' }}
              className="card-hover"
            >
              <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><BookOpen size={22} /></div>
              <h4 style={{ fontSize: '0.95rem' }}>System Architecture</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>DB schema & API specifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3>Recently Registered Students</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('students')}>
            View All Students
          </button>
        </div>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>GPA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((stu) => (
                <tr key={stu.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{stu.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={stu.avatar} 
                        alt={stu.name} 
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{stu.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{stu.department}</td>
                  <td>{stu.year}</td>
                  <td><span style={{ fontWeight: 700 }}>{stu.gpa.toFixed(2)}</span></td>
                  <td>
                    <span className={`badge ${stu.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {stu.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
