import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onMemberAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    console.log('Submitting:', { name, address, contactInfo }); // Add this line
    try {
      const newMember = { name, address, contactInfo };
      const response = await axios.post('http://localhost:8080/api/members', newMember);
      setSuccess('Member registered successfully!');
      setName('');
      setAddress('');
      setContactInfo('');
      if (onMemberAdded) onMemberAdded(response.data);
    } catch (err) {
      setError('Failed to register member.');
      console.error(err); // Add this line
    }
  };

  return (
    <div>
      <h2>Register New Member</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ padding: '5px', width: '250px' }}
          />
        </div>
        <div>
          <label>Address:</label><br />
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
            style={{ padding: '5px', width: '250px' }}
          />
        </div>
        <div>
          <label>Contact Info:</label><br />
          <input
            type="text"
            value={contactInfo}
            onChange={e => setContactInfo(e.target.value)}
            required
            style={{ padding: '5px', width: '250px' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RegisterForm;