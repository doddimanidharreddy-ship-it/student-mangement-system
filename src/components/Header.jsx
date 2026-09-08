import React from 'react';
import { Search, Moon, Sun, UserCheck, Plus, FileSpreadsheet } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  currentRole, 
  setCurrentRole, 
  onAddStudent,
  onOpenExcelModal 
}) {
  return (
    <header className="header">
      {/* Search Input */}
      <div style={{ position: 'relative', width: '320px' }}>
        <Search 
          size={18} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
        />
        <input
          type="text"
          placeholder="Search 350+ students, mentors, or IDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.4rem', height: '40px', borderRadius: '9999px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Controls Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Excel Upload Button */}
        <button 
          onClick={onOpenExcelModal} 
          className="btn btn-primary" 
          style={{ height: '40px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
          title="Upload an Excel (.xlsx / .csv) sheet"
        >
          <FileSpreadsheet size={18} />
          <span>Upload Excel Sheet</span>
        </button>

        {/* Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <UserCheck size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>View As:</span>
          <select 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="Admin">Administrator</option>
            <option value="Teacher">Professor / Faculty</option>
            <option value="Student">Student Portal</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary" 
          title="Toggle Light/Dark Theme"
          style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Quick Add Student Button */}
        {currentRole === 'Admin' && (
          <button onClick={onAddStudent} className="btn btn-secondary" style={{ height: '40px', borderRadius: '8px' }}>
            <Plus size={18} />
            <span>New Student</span>
          </button>
        )}
      </div>
    </header>
  );
}
