import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  FileSpreadsheet
} from 'lucide-react';

export default function StudentsList({ 
  students, 
  currentRole, 
  onAddStudent, 
  onEditStudent, 
  onDeleteStudent, 
  onViewStudent,
  onOpenExcelModal,
  searchQuery,
  setSearchQuery
}) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter logic
  const filteredStudents = students.filter((stu) => {
    const matchesSearch = 
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stu.mentor && stu.mentor.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDept = selectedDept === 'All' || stu.department === selectedDept;
    const matchesYear = selectedYear === 'All' || stu.year === selectedYear;
    const matchesStatus = selectedStatus === 'All' || stu.status === selectedStatus;

    return matchesSearch && matchesDept && matchesYear && matchesStatus;
  });

  // CSV Export feature
  const exportToCSV = () => {
    const headers = ["Student ID", "Name", "Email", "Department", "Year", "GPA", "Attendance %", "Mentor", "Fee Status", "Phone"];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.name}"`,
      s.email,
      `"${s.department}"`,
      s.year,
      s.gpa,
      s.attendanceRate,
      `"${s.mentor || 'Faculty Supervisor'}"`,
      s.feeStatus,
      `"${s.phone}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory ({students.length} Total Enrolled)</h1>
          <p className="page-subtitle">Real student records, roll numbers, faculty mentor assignments, and attendance logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenExcelModal} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <FileSpreadsheet size={16} />
            Upload Excel Sheet
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <Download size={16} />
            Export CSV
          </button>
          {currentRole === 'Admin' && (
            <button className="btn btn-secondary" onClick={onAddStudent}>
              <UserPlus size={16} />
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Dept:</span>
            <select 
              value={selectedDept} 
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-select"
              style={{ width: '220px', padding: '0.4rem 0.6rem' }}
            >
              <option value="All">All Departments</option>
              <option value="Artificial Intelligence (AI Forge)">Artificial Intelligence (AI Forge)</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Electrical Eng">Electrical Eng</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
            </select>
          </div>

          {/* Year Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Year:</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-select"
              style={{ width: '140px', padding: '0.4rem 0.6rem' }}
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ width: '140px', padding: '0.4rem 0.6rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>VTU Roll ID</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Faculty Mentor</th>
              <th>Attendance</th>
              <th>Fee Dues</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No student records match the selected search/filter criteria. Click "Upload Excel Sheet" to import new records.
                </td>
              </tr>
            ) : (
              filteredStudents.map((stu) => (
                <tr key={stu.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{stu.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={stu.avatar} 
                        alt={stu.name} 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{stu.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{stu.department}</td>
                  <td>{stu.year}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {stu.mentor || 'Faculty Supervisor'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: stu.attendanceRate >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                        {stu.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${stu.feeStatus === 'Paid' ? 'badge-success' : stu.feeStatus === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {stu.feeStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${stu.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {stu.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      <button 
                        onClick={() => onViewStudent(stu)} 
                        className="btn btn-secondary btn-sm" 
                        title="View Full Profile"
                      >
                        <Eye size={14} />
                      </button>

                      {currentRole === 'Admin' && (
                        <>
                          <button 
                            onClick={() => onEditStudent(stu)} 
                            className="btn btn-secondary btn-sm" 
                            title="Edit Student"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => onDeleteStudent(stu.id)} 
                            className="btn btn-danger btn-sm" 
                            title="Delete Student"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
