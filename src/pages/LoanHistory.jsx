import React, { useEffect, useState } from 'react';
import { getLoans } from '../api/loans';

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLoans()
      .then(data => setLoans(data))
      .catch(() => setError('Failed to fetch loan history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#1a2236', color: '#fff', padding: 40 }}>
      <h2>My Loan History</h2>
      {loading ? (
        <p>Loading loan history...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : loans.length === 0 ? (
        <p>No loan history found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232b43', color: '#fff' }}>
          <thead>
            <tr>
              <th style={{ padding: 8, borderBottom: '1px solid #ffe600' }}>Book</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ffe600' }}>Status</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ffe600' }}>Loan Date</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ffe600' }}>Due Date</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ffe600' }}>User ID</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, idx) => (
              <tr key={loan.id} style={{ background: idx % 2 === 0 ? '#263159' : 'transparent' }}>
                <td style={{ padding: 8 }}>{loan.book?.title || loan.book?.id || 'N/A'}</td>
                <td style={{ padding: 8 }}>{loan.status}</td>
                <td style={{ padding: 8 }}>
                  {loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: 8 }}>{loan.dueDate || 'N/A'}</td>
                <td style={{ padding: 8 }}>{loan.user?.id || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanHistory;