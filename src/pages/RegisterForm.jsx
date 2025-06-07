import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Register.css';

const RegisterForm = ({ onMemberAdded }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const newMember = { username, email, password };
      const response = await axios.post('http://localhost:8080/api/auth/register', newMember);
      setSuccess('Member registered successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      if (onMemberAdded) onMemberAdded(response.data);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to register member.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-box">
        <h2 className="register-title">
          Register New Member
        </h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div>
            <label className="register-label">UserName</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <div>
            <label className="register-label">Email</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <div>
            <label className="register-label">Password</label>
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}
        <div className="register-back">
          <Link to="/" className="register-link">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;