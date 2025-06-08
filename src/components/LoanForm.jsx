// LoanForm.jsx
import React, { useState } from 'react';
import { createLoan } from '../api/loans';
import { useNavigate } from 'react-router-dom';
import '../style/LoanForm.css';

function LoanForm({ onLoanCreated }) {
  const [loan, setLoan] = useState({
    username: '',
    isbn: '',
    status: 'active' // Default status
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
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
       // *** ADD THIS LINE TO TRIM THE ISBN ***
      const trimmedIsbn = loan.isbn.trim(); 

      await createLoan({
        username: loan.username,
        // *** USE THE TRIMMED ISBN HERE ***
        isbn: trimmedIsbn, 
        status: loan.status,
        borrowDate: today
      });

      setLoan({ username: '', isbn: '', status: 'active' });
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
            name="username"
            placeholder="User Name"
            value={loan.username}
            onChange={handleChange}
            required
            className="loanform-input"
          />
          <input
            name="isbn"
            placeholder="ISBN"
            value={loan.isbn}
            onChange={handleChange}
            required
            className="loanform-input"
          />
          <select
            name="status"
            value={loan.status}
            onChange={handleChange}
            className="loanform-input"
          >
            <option value="active">Active</option>
            <option value="returned">Returned</option>
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



//Jun.8:update
// The trim() method removes whitespace from both ends of a string. 
// Whitespace in this context includes spaces, tabs (\t), newlines (\n), carriage returns (\r), form feeds (\f), and vertical tabs (\v).