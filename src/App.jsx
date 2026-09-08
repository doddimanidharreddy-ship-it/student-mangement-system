import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentsList from './components/StudentsList';
import StudentModal from './components/StudentModal';
import StudentProfileModal from './components/StudentProfileModal';
import CoursesList from './components/CoursesList';
import AttendanceTracker from './components/AttendanceTracker';
import Gradebook from './components/Gradebook';
import FeeManager from './components/FeeManager';
import ArchitectureGuide from './components/ArchitectureGuide';

import { 
  INITIAL_STUDENTS, 
  INITIAL_COURSES, 
  INITIAL_GRADES, 
  INITIAL_FEES 
} from './mockData';

const API_BASE_URL = window.location.origin.includes('localhost:3000') 
  ? 'http://localhost:5000/api/v1' 
  : '/api/v1';

export default function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [fees, setFees] = useState([]);

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [currentRole, setCurrentRole] = useState('Admin');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);

  // Initial Fetch from Backend API
  const fetchAllData = async () => {
    try {
      const [stuRes, crsRes, grdRes, feeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/students`),
        fetch(`${API_BASE_URL}/courses`),
        fetch(`${API_BASE_URL}/grades`),
        fetch(`${API_BASE_URL}/fees`)
      ]);

      if (stuRes.ok && crsRes.ok && grdRes.ok && feeRes.ok) {
        const stuData = await stuRes.json();
        const crsData = await crsRes.json();
        const grdData = await grdRes.json();
        const feeData = await feeRes.json();

        setStudents(stuData);
        setCourses(crsData);
        setGrades(grdData);
        setFees(feeData);
        setIsBackendConnected(true);
      } else {
        throw new Error('Backend returned error status');
      }
    } catch (error) {
      console.warn('Backend API connection offline, falling back to local dataset:', error);
      setIsBackendConnected(false);
      setStudents(INITIAL_STUDENTS);
      setCourses(INITIAL_COURSES);
      setGrades(INITIAL_GRADES);
      setFees(INITIAL_FEES);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Theme switcher effect
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // Student CRUD Operations
  const handleSaveStudent = async (studentData) => {
    if (studentToEdit) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${studentData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        if (res.ok) fetchAllData();
      } catch (err) {
        setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        if (res.ok) fetchAllData();
      } catch (err) {
        setStudents(prev => [studentData, ...prev]);
      }
    }
    setStudentToEdit(null);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student record?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAllData();
      } catch (err) {
        setStudents(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleViewStudentProfile = (student) => {
    setProfileStudent(student);
    setIsProfileModalOpen(true);
  };

  // Add Course
  const handleAddCourse = async (courseData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      setCourses(prev => [courseData, ...prev]);
    }
  };

  // Attendance Save
  const handleSaveAttendance = (courseCode, date, attendanceMap) => {
    setStudents(prev => prev.map(student => {
      const status = attendanceMap[student.id];
      let currentRate = student.attendanceRate || 90;
      if (status === 'Absent') currentRate = Math.max(50, currentRate - 2);
      else if (status === 'Present') currentRate = Math.min(100, currentRate + 1);
      return { ...student, attendanceRate: currentRate };
    }));
  };

  // Add Grade
  const handleAddGrade = async (gradeRecord) => {
    try {
      const res = await fetch(`${API_BASE_URL}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeRecord)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      setGrades(prev => [gradeRecord, ...prev]);
    }
  };

  // Fee Payment
  const handlePayFee = async (feeId, amount) => {
    try {
      const res = await fetch(`${API_BASE_URL}/fees/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeId, amount })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      setFees(prev => prev.map(f => {
        if (f.id === feeId) {
          const newPaid = f.paidAmount + amount;
          return { ...f, paidAmount: newPaid, status: newPaid >= f.totalAmount ? 'Paid' : 'Pending' };
        }
        return f;
      }));
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={currentRole}
        studentCount={students.length}
      />

      <div className="main-wrapper">
        {/* Top Header */}
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          onAddStudent={() => { setStudentToEdit(null); setIsStudentModalOpen(true); }}
        />

        {/* Backend Status Indicator Pill */}
        <div style={{ padding: '0.4rem 2rem', background: isBackendConnected ? 'var(--success-light)' : 'var(--warning-light)', borderBottom: '1px solid var(--border-color)', fontSize: '0.775rem', fontWeight: 600, color: isBackendConnected ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            {isBackendConnected ? '🟢 Express REST API & SQLite Database Connected (http://localhost:5000)' : '🟡 Local Sandbox Mode'}
          </span>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Active View Role: <strong style={{ color: 'var(--text-main)' }}>{currentRole}</strong>
          </span>
        </div>

        {/* Dynamic Content Views */}
        <main className="content-area">
          {activeTab === 'dashboard' && (
            currentRole === 'Teacher' ? (
              <FacultyDashboard 
                students={students}
                courses={courses}
                grades={grades}
                onSaveAttendance={handleSaveAttendance}
                onAddGrade={handleAddGrade}
                onViewStudent={handleViewStudentProfile}
              />
            ) : (
              <Dashboard 
                students={students}
                courses={courses}
                fees={fees}
                setActiveTab={setActiveTab}
                onAddStudent={() => { setStudentToEdit(null); setIsStudentModalOpen(true); }}
              />
            )
          )}

          {activeTab === 'students' && (
            <StudentsList 
              students={students}
              currentRole={currentRole}
              onAddStudent={() => { setStudentToEdit(null); setIsStudentModalOpen(true); }}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onViewStudent={handleViewStudentProfile}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesList 
              courses={courses}
              onAddCourse={handleAddCourse}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTracker 
              students={students}
              courses={courses}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'gradebook' && (
            <Gradebook 
              students={students}
              courses={courses}
              grades={grades}
              onAddGrade={handleAddGrade}
              onViewStudent={handleViewStudentProfile}
            />
          )}

          {activeTab === 'fees' && (
            <FeeManager 
              fees={fees}
              students={students}
              onPayFee={handlePayFee}
            />
          )}

          {activeTab === 'guide' && (
            <ArchitectureGuide />
          )}
        </main>
      </div>

      {/* Student Add / Edit Dialog */}
      <StudentModal 
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Student Profile Card & Report Window */}
      <StudentProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={profileStudent}
        grades={grades}
      />
    </div>
  );
}
