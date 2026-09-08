import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, AlertCircle, Clock, Plus, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeeManager({ fees, onPayFee, students }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState(0);

  const filteredFees = fees.filter(f => filterStatus === 'All' || f.status === filterStatus);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedFee || payAmount <= 0) return;

    onPayFee(selectedFee.id, payAmount);
    confetti({ particleCount: 50, spread: 70 });
    setSelectedFee(null);
    setPayAmount(0);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tuition & Fee Financial Management</h1>
          <p className="page-subtitle">Track student fee ledger accounts, collect payments, and issue receipts.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status Filter:</span>
        {['All', 'Paid', 'Pending', 'Overdue'].map((st) => (
          <button 
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Fee Records Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Fee Ref ID</th>
              <th>Student</th>
              <th>Total Tuition</th>
              <th>Paid Amount</th>
              <th>Balance Dues</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((fee) => {
              const balance = fee.totalAmount - fee.paidAmount;
              return (
                <tr key={fee.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fee.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{fee.studentName}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fee.studentId}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${fee.totalAmount.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 700 }}>${fee.paidAmount.toLocaleString()}</td>
                  <td style={{ color: balance > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 700 }}>
                    ${balance.toLocaleString()}
                  </td>
                  <td>{fee.dueDate}</td>
                  <td>
                    <span className={`badge ${fee.status === 'Paid' ? 'badge-success' : fee.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {balance > 0 ? (
                      <button 
                        onClick={() => {
                          setSelectedFee(fee);
                          setPayAmount(balance);
                        }} 
                        className="btn btn-primary btn-sm"
                      >
                        <CreditCard size={14} /> Record Payment
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <CheckCircle2 size={14} /> Fully Settled
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {selectedFee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Record Tuition Payment</h3>
            </div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="modal-body">
                <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedFee.studentName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student ID: {selectedFee.studentId}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <span>Total Fee: <strong>${selectedFee.totalAmount}</strong></span>
                    <span>Remaining Balance: <strong style={{ color: 'var(--danger)' }}>${selectedFee.totalAmount - selectedFee.paidAmount}</strong></span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount ($)</label>
                  <input 
                    type="number" 
                    min="1"
                    max={selectedFee.totalAmount - selectedFee.paidAmount}
                    value={payAmount} 
                    onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                    className="form-input" 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setSelectedFee(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Payment Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
