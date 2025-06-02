// LoanForm.jsx
import React, { useState } from 'react';
import { createLoan } from '../api/loans';
import { useNavigate } from 'react-router-dom';

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
      // Adjust the payload structure as needed by your backend
      await createLoan({
        user: { id: loan.userId }, // <-- send user as object
        book: { id: loan.bookId },
        title: loan.title,
        status: loan.status
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
    <form onSubmit={handleSubmit}>
      <input
        name="userId"
        placeholder="User ID"
        value={loan.userId}
        onChange={handleChange}
        required
      />
      <input
        name="bookId"
        placeholder="Book ID"
        value={loan.bookId}
        onChange={handleChange}
        required
      />
      <input
        name="title"
        placeholder="Loan Title"
        value={loan.title}
        onChange={handleChange}
        required
      />
      <select
        name="status"
        value={loan.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="BORROWED">BORROWED</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="OVERDUE">OVERDUE</option>
        <option value="RETURNED">RETURNED</option>
      </select>
      <button type="submit">Create Loan</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default LoanForm;