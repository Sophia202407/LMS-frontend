// src/components/LoanHistory.jsx
import React, { useEffect, useState } from 'react';
// Import renewLoan and returnLoan for button actions
import { getMyLoans, renewLoan, returnLoan } from '../api/loans';
import '../style/LoanHistory.css'; // Import the CSS file

const LoanHistory = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch loans, useful for refreshing the list after actions
    const fetchLoans = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyLoans();
            setLoans(data);
        } catch (err) {
            console.error("Error fetching loan history:", err);
            setError('Failed to fetch your loan history. Please ensure you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans(); // Call fetchLoans on component mount
    }, []);

    const handleRenew = async (loanId) => {
        try {
            await renewLoan(loanId);
            alert('Loan renewed successfully!');
            fetchLoans(); // Refresh the list to show updated due date/status
        } catch (err) {
            console.error("Error renewing loan:", err);
            alert(`Failed to renew loan: ${err.message || 'Unknown error'}`);
        }
    };

    const handleReturn = async (loanId) => {
        // Optional: Add a confirmation dialog
        if (!window.confirm("Are you sure you want to mark this book as returned?")) {
            return;
        }

        try {
            await returnLoan(loanId);
            alert('Book returned successfully!');
            fetchLoans(); // Refresh the list to show updated status/return date
        } catch (err) {
            console.error("Error returning book:", err);
            alert(`Failed to return book: ${err.message || 'Unknown error'}`);
        }
    };

    if (loading) {
        return <div className="loan-history-container">Loading loan history...</div>;
    }

    if (error) {
        return <div className="loan-history-container error-message">{error}</div>;
    }

    return (
        <div className="loan-history-container">
            <h2>My Loan History</h2>
            {loans.length === 0 ? (
                <p>No loan history found.</p>
            ) : (
                <table className="loan-table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Username</th>
                            <th>ISBN</th>
                            <th>Loan Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Actions</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.id}>
                                <td>{loan.id}</td>
                                <td>{loan.user?.username || 'N/A'}</td>
                                <td>{loan.book?.isbn || 'N/A'}</td>
                                <td>
                                    {loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</td>
                                <td>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Not Returned'}</td>
                                <td>
                                    {/* Conditionally render buttons based on loan status */}
                                    {loan.status === 'ACTIVE' && (
                                        <>
                                            <button 
                                                className="action-button renew-button" 
                                                onClick={() => handleRenew(loan.id)}
                                            >
                                                Renew
                                            </button>
                                            <button 
                                                className="action-button return-button" 
                                                onClick={() => handleReturn(loan.id)}
                                            >
                                                Return
                                            </button>
                                        </>
                                    )}
                                    {loan.status === 'RETURNED' && (
                                        <span className="loan-status-returned">Returned</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoanHistory;