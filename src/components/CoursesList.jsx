import React, { useState } from 'react';
import { BookOpen, Plus, Users, Clock, Award, CheckCircle } from 'lucide-react';

export default function CoursesList({ courses, onAddCourse, currentRole }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    department: 'Computer Science',
    credits: 3,
    instructor: '',
    enrolledCount: 0,
    schedule: 'Mon/Wed 10:00 AM - 11:30 AM'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;
    onAddCourse(newCourse);
    setIsModalOpen(false);
    setNewCourse({
      code: '',
      title: '',
      department: 'Computer Science',
      credits: 3,
      instructor: '',
      enrolledCount: 0,
      schedule: 'Mon/Wed 10:00 AM - 11:30 AM'
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Catalog & Curriculum</h1>
          <p className="page-subtitle">Academic subject catalog, credit distributions, and assigned faculty.</p>
        </div>
        {currentRole === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Create Course
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {courses.map((course) => (
          <div key={course.code} className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.2rem 0.6rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
                {course.code}
              </span>
              <span className="badge badge-info">{course.credits} Credits</span>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{course.title}</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Dept: <strong style={{ color: 'var(--text-main)' }}>{course.department}</strong>
            </p>

            <div style={{ padding: '0.75rem', background: 'var(--bg-dark)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Award size={14} color="var(--primary)" /> Instructor: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{course.instructor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Clock size={14} color="var(--info)" /> Schedule: <span style={{ color: 'var(--text-main)' }}>{course.schedule}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Users size={16} /> {course.enrolledCount} Enrolled
              </span>
              <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle size={14} /> Active Term
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Add New Curriculum Course</h3>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Course Code *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. CS404" 
                      value={newCourse.code} 
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credits</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="6" 
                      value={newCourse.credits} 
                      onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 3 })}
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Distributed Cloud Systems" 
                    value={newCourse.title} 
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select 
                      value={newCourse.department} 
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                      className="form-select"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Electrical Eng">Electrical Eng</option>
                      <option value="Mechanical Eng">Mechanical Eng</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Faculty Instructor</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Jane Doe" 
                      value={newCourse.instructor} 
                      onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                      className="form-input" 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
