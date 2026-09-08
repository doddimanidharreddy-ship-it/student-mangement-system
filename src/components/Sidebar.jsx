import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  GraduationCap, 
  CreditCard, 
  Code2, 
  ShieldAlert,
  School
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentRole, studentCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users, badge: studentCount },
    { id: 'courses', label: 'Course Catalog', icon: BookOpen },
    { id: 'attendance', label: 'Attendance Tracker', icon: CalendarCheck },
    { id: 'gradebook', label: 'Gradebook & GPA', icon: GraduationCap },
    { id: 'fees', label: 'Fee Management', icon: CreditCard },
    { id: 'guide', label: 'System Architecture', icon: Code2, highlight: true }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
          <School size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EduPulse
          </h2>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
            STUDENT SYSTEM v2.5
          </span>
        </div>
      </div>

      {/* Role Pill */}
      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
            Role: {currentRole}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              style={item.highlight ? { border: '1px dashed var(--primary)', marginTop: '1rem' } : {}}
            >
              <IconComponent size={20} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span style={{ fontSize: '0.75rem', background: isActive ? '#ffffff' : 'var(--bg-card-hover)', color: isActive ? 'var(--primary)' : 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Antigravity Coding Assistant &bull; Complete Reference Stack
      </div>
    </aside>
  );
}
