import React, { useEffect, useState } from 'react';
import { getLoans, deleteLoan } from '../api/loans';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div style={{
            maxWidth: '600px',
            margin: '60px auto',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            background: '#fff',
            textAlign: 'center'
        }}>
            <h2 style={{ marginBottom: '32px', color: '#2d3a4b' }}>Manage My Loans</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
                <button
                    style={{
                        padding: '10px 28px',
                        fontSize: '1rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#1976d2',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onClick={fetchLoans}
                >
                    Loan List
                </button>
                <button
                    style={{
                        padding: '10px 28px',
                        fontSize: '1rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#43a047',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onClick={() => navigate('/new-loan')}
                >
                    Create Loan
                </button>
            </div>
            <p style={{ color: '#888', fontSize: '0.95rem' }}>
                Use the buttons above to view your loans or create a new one.
            </p>

            {/* Rules Section */}
            <div style={{
                background: '#f5f7fa',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                color: '#2d3a4b',
                fontSize: '0.98rem',
                textAlign: 'left'
            }}>
                <strong>Library Loan Rules:</strong>
                <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
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
                <div style={{ color: 'red' }}>{error}</div>
            ) : loans.length === 0 ? (
                <div>No loans found.</div>
            ) : (
                <div>
                    <h3 style={{ marginBottom: '16px' }}>Loan List</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {loans.map((loan) => (
                            <li key={loan.id} style={{
                                background: '#e3eafc',
                                marginBottom: '12px',
                                padding: '12px',
                                borderRadius: '6px',
                                textAlign: 'left'
                            }}>
                                <strong>{loan.title}</strong> <br />
                                Status: {loan.status} <br />
                                Book: {loan.book?.title || loan.book?.id || 'N/A'} <br />
                                Due: {loan.dueDate || 'N/A'} <br />
                                User ID: {loan.user?.id || 'N/A'}
                                <button
                                    style={{
                                        marginLeft: '16px',
                                        padding: '4px 12px',
                                        background: '#e53935',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleDelete(loan.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Loans;