import React, { useEffect, useState, useContext } from 'react';
import { getLoans, deleteLoan, renewLoan } from '../api/loans'; // <-- import renewLoan
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Loans.css'; // <-- Import the CSS file

// Loans Component
const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchLoans = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLoans();
            setLoans(data);
        } catch (err) {
            setError('Error fetching loans.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteLoan(id);
            setLoans(loans.filter(l => l.id !== id));
        } catch (err) {
            setError('Failed to delete loan.');
        }
    };

    const handleRenew = async (id) => {
        setError(null);
        setLoading(true);
        try {
            await renewLoan(id);
            await fetchLoans(); // Refresh the list after renewal
        } catch (err) {
            // Debug: log the error object to inspect its structure
            console.log('Renew loan error:', err);

            let msg = 'Failed to renew loan.';
            if (err?.response) {
                if (typeof err.response.data === 'string') {
                    msg = err.response.data;
                } else if (err.response.data?.message) {
                    msg = err.response.data.message;
                }
            } else if (err?.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loans-root">
            <div className="loans-container">
                <h2 className="loans-title">Manage My Loans</h2>
                {/* Action Buttons */}
                <div className="loans-btn-row">
                    <button className="loans-btn loans-btn-list" onClick={fetchLoans}>
                        Loan List
                    </button>
                    <button className="loans-btn loans-btn-create" onClick={() => navigate('/new-loan')}>
                        Create Loan
                    </button>
                    <button className="loans-btn loans-btn-history" onClick={() => navigate('/loan-history')}>
                        Past Loan
                    </button>
                    <button className="loans-btn loans-btn-due" onClick={() => navigate('/loan-due-dates')}>
                        Check Due Dates
                    </button>
                </div>
                {/* Rules Section */}
                <div className="loans-rules-box">
                    <strong>Library Loan Rules:</strong>
                    <ul className="loans-rules-list">
                        <li>Each member can borrow up to 3 books at a time.</li>
                        <li>Loan period is 14 days, with max 2 renewals.</li>
                        <li>Overdue fine: $0.50 per day, capped at $20 per book.</li>
                        <li>Fine starts accumulating from day after due date.</li>
                        <li>Borrowing is blocked, if fines more than $10 or if having any overdue books.</li>
                        <li>Books must be returned in good condition.</li>
                    </ul>
                </div>
                {/* Loan List Section */}
                {loading ? (
                    <div>Loading loans...</div>
                ) : error ? (
                    <div className="loans-error">{error}</div>
                ) : loans.length === 0 ? (
                    <div>No loans found.</div>
                ) : (
                    <div>
                        <h3 className="loans-list-title">Loan List</h3>
                        <div className="loans-table-wrapper">
                            <table className="loans-table">
                                <thead>
                                    <tr>
                                        <th>Book</th>
                                        <th>Status</th>
                                        <th>Due Date</th>
                                        <th>User ID</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.map((loan) => (
                                        <tr key={loan.id}>
                                            <td>{loan.book?.title || loan.book?.id || 'N/A'}</td>
                                            <td>{loan.status}</td>
                                            <td>{loan.dueDate || 'N/A'}</td>
                                            <td>{loan.user?.id || 'N/A'}</td>
                                            <td>
                                                <button
                                                    className="loans-action-btn loans-renew-btn"
                                                    onClick={() => handleRenew(loan.id)}
                                                >
                                                    Renew
                                                </button>
                                                <button
                                                    className="loans-action-btn loans-delete-btn"
                                                    onClick={() => handleDelete(loan.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loans;