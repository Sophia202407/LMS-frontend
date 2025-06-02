import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '40px' }}>
    <h2>Welcome to the Library Management System</h2>
    <p style={{ fontSize: '18px', margin: '20px 0' }}>Select an option:</p>
    <div style={{ marginTop: '30px' }}>
      <Link
        to="/members"
        style={{
          marginRight: '20px',
          padding: '10px 20px',
          background: '#4f8cff',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        View Members
      </Link>
      <Link
        to="/register"
        style={{
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Register New Member
      </Link>
    </div>
    <hr />
    <Outlet /> {/* This renders the matched child route */}
  </div>
);

export default Dashboard;