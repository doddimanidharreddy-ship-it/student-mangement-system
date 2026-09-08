import React, { useState } from 'react';
import { SYSTEM_DOCS } from '../mockData';
import { Code2, Database, Network, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';

export default function ArchitectureGuide() {
  const [activeSubTab, setActiveSubTab] = useState('schema');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Management System Blueprint & Technical Architecture</h1>
          <p className="page-subtitle">Complete architectural guide, database schema, API specifications, and stack reference.</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveSubTab('schema')} 
          className={`btn ${activeSubTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Database size={16} /> Database ER Schema (SQL)
        </button>

        <button 
          onClick={() => setActiveSubTab('api')} 
          className={`btn ${activeSubTab === 'api' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Network size={16} /> REST API Endpoints
        </button>

        <button 
          onClick={() => setActiveSubTab('architecture')} 
          className={`btn ${activeSubTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Code2 size={16} /> System Topology & Flow
        </button>

        <button 
          onClick={() => setActiveSubTab('security')} 
          className={`btn ${activeSubTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <ShieldCheck size={16} /> Security & Auth (RBAC)
        </button>
      </div>

      {/* Tab Content 1: Database Schema */}
      {activeSubTab === 'schema' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3>Relational Database DDL Schema (PostgreSQL / MySQL Compatible)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete table structures with foreign key constraints, indexes, and ENUM checks.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(SYSTEM_DOCS.sqlSchema)}>
              {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              {copied ? 'Copied SQL!' : 'Copy SQL Schema'}
            </button>
          </div>
          <pre className="code-block">{SYSTEM_DOCS.sqlSchema}</pre>
        </div>
      )}

      {/* Tab Content 2: API Specification */}
      {activeSubTab === 'api' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Core RESTful API Endpoint Definitions</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint Path</th>
                  <th>Description & Access Level</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEM_DOCS.apiEndpoints.map((ep, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`badge ${ep.method === 'GET' ? 'badge-info' : ep.method === 'POST' ? 'badge-success' : ep.method === 'PUT' ? 'badge-warning' : 'badge-danger'}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{ep.path}</td>
                    <td>{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Architecture Diagram */}
      {activeSubTab === 'architecture' && (
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>3-Tier Microservices / Monolithic Topology</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            High-level architectural blueprint separating Presentation, Application/API Gateway, Service Layer, and Persistence Store.
          </p>
          <pre className="code-block" style={{ color: '#38bdf8' }}>{SYSTEM_DOCS.architecture}</pre>
        </div>
      )}

      {/* Tab Content 4: Security & Best Practices */}
      {activeSubTab === 'security' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Production Security & Implementation Standards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>1. JWT Authentication & Refresh Tokens</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Issue signed JSON Web Tokens (HS256 or RS256) upon login. Store Access Tokens in memory and Refresh Tokens in HTTP-Only, Secure, SameSite cookies to mitigate XSS vulnerabilities.
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--success)', marginBottom: '0.5rem' }}>2. Role-Based Access Control (RBAC)</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Enforce granular permissions: Admin (Full CRUD), Teacher (Mark attendance & enter grades), Student (View own records & report cards), Parent (View child fee statements).
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--info)', marginBottom: '0.5rem' }}>3. Password Hashing & Data Encryption</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Hash all credentials using <code style={{ color: 'var(--primary)' }}>bcrypt</code> (work factor &ge; 12) or Argon2id. Encrypt sensitive personal details (PII) at rest using AES-256.
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>4. SQL Injection & CORS Prevention</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Utilize parameterized SQL queries or ORMs (Prisma, TypeORM, Hibernate) to sanitize all user inputs. Configure Strict CORS policies for authorized web origins.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
