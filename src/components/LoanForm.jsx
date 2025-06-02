// LoanForm.jsx
import React, { useState } from 'react';
import { createLoan } from '../api/loans';
import { useNavigate } from 'react-router-dom';
import '../style/LoanForm.css';

function LoanForm({ onLoanCreated }) {
  const [loan, setLoan] = useState({
    userId: '',
    bookId: '',
    title: '',
    status: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await createLoan({
        user: { id: loan.userId },
        book: { id: loan.bookId },
        title: loan.title,
        status: loan.status,
        borrowDate: new Date().toISOString()
      });
      setLoan({ userId: '', bookId: '', title: '', status: '' });
      if (onLoanCreated) onLoanCreated();
      alert('Loan created!');
      setTimeout(() => navigate('/loans'), 0);
    } catch (err) {
      setError(err.message || 'Failed to create loan.');
    }
  };

  return (
    <div className="loanform-root">
      <div className="loanform-container">
        <h2 className="loanform-title">Create New Loan</h2>
        <form className="loanform-form" onSubmit={handleSubmit}>
          <input
            name="userId"
            placeholder="User ID"
            value={loan.userId}
            onChange={handleChange}
            required
            className="loanform-input"
          />
          <input
            name="bookId"
            placeholder="Book ID"
            value={loan.bookId}
            onChange={handleChange}
            required
            className="loanform-input"
          />
          <input
            name="title"
            placeholder="Loan Title"
            value={loan.title}
            onChange={handleChange}
            required
            className="loanform-input"
          />
          <select
            name="status"
            value={loan.status}
            onChange={handleChange}
            required
            className="loanform-select"
          >
            <option value="">Select Status</option>
            <option value="BORROWED">BORROWED</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OVERDUE">OVERDUE</option>
            <option value="RETURNED">RETURNED</option>
          </select>
          <button
            type="submit"
            className="loanform-btn"
          >
            Create Loan
          </button>
          {error && <div className="loanform-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default LoanForm;