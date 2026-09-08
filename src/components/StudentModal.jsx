import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus } from 'lucide-react';

export default function StudentModal({ isOpen, onClose, onSave, studentToEdit }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: 'Computer Science',
    year: '1st Year',
    semester: 'Semester 1',
    status: 'Active',
    gpa: 3.5,
    attendanceRate: 90,
    feeStatus: 'Paid',
    phone: '',
    dob: '2004-01-01',
    address: '',
    avatar: ''
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      setFormData({
        id: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        email: '',
        department: 'Computer Science',
        year: '1st Year',
        semester: 'Semester 1',
        status: 'Active',
        gpa: 3.5,
        attendanceRate: 95,
        feeStatus: 'Paid',
        phone: '+1 (555) 000-0000',
        dob: '2004-05-15',
        address: 'University Campus Quad',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in both Full Name and Email Address before saving!");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserPlus size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem' }}>{studentToEdit ? 'Edit Student Profile' : 'Register New Student'}</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Quick Helper Notice */}
            <div style={{ padding: '0.75rem 1rem', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.825rem', fontWeight: 600 }}>
              💡 <strong>Tip:</strong> Click on <strong>Full Name</strong> and <strong>Email Address</strong> below to type your information!
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Student ID - Now Editable */}
              <div className="form-group">
                <label className="form-label">Student ID (Customizable)</label>
                <input 
                  type="text" 
                  value={formData.id} 
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. STU-2026-101"
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}
                />
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" style={{ color: '#f8fafc', fontWeight: 700 }}>Full Name * (Type Here)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Click here & type your full name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  style={{ border: '1.5px solid var(--primary)', background: '#1e293b' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" style={{ color: '#f8fafc', fontWeight: 700 }}>Email Address * (Type Here)</label>
                <input 
                  type="email" 
                  required
                  placeholder="Click here & type your email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  style={{ border: '1.5px solid var(--primary)', background: '#1e293b' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  value={formData.department} 
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-select"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Electrical Eng">Electrical Eng</option>
                  <option value="Mechanical Eng">Mechanical Eng</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <select 
                  value={formData.year} 
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="form-select"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Semester</label>
                <input 
                  type="text" 
                  placeholder="e.g. Semester 1" 
                  value={formData.semester} 
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">CGPA Score (0.0 - 10.0)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.gpa} 
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attendance Rate (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.attendanceRate} 
                  onChange={(e) => setFormData({ ...formData, attendanceRate: parseInt(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input 
                type="text" 
                placeholder="+1 (555) 123-4567" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', fontWeight: 800 }}>
              <Save size={16} />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
