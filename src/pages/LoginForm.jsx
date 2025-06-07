import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Login.css';

const LoginForm = () => {
  const { login, authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pass role along with username and password
    const success = await login({ username, password });
    if (success) {
      navigate('/');
    } 
  };

  return (
    <div className="login-root">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="login-label">Username</label>
            <input className="login-input" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="login-label">Password</label>
            <input className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn">Login</button>
          {/* Display error from AuthContext */}
          {authError && <div className="login-error">{authError}</div>}
        </form>
        <div className="login-back">
          <a href="/" className="login-link">Back to Home</a>
        </div>
        <div className="login-register">
          <span>Don't have an account?</span>
          <button
            className="login-btn"
            style={{ marginTop: 10, background: '#28a745' }}
            onClick={() => navigate('/register')}
            type="button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

//Jun.7 key changes:
// Removed local error state: You already have authError in your AuthContext. 
// It's better to use that single source of truth for authentication errors.
// Used authError from useAuth: const { login, authError } = useAuth();
// Simplified handleSubmit: The else { setError('Invalid credentials'); } block is no longer needed because AuthContext will set authError directly.
