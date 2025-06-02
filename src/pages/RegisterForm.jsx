import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Register.css';

const RegisterForm = ({ onMemberAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const newMember = { name, address, contactInfo };
      const response = await axios.post('http://localhost:8080/api/members', newMember);
      setSuccess('Member registered successfully!');
      setName('');
      setAddress('');
      setContactInfo('');
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
            <label className="register-label">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <div>
            <label className="register-label">Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <div>
            <label className="register-label">Contact Info</label>
            <input
              type="text"
              value={contactInfo}
              onChange={e => setContactInfo(e.target.value)}
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