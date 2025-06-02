import React from 'react';
import { Link } from 'react-router-dom';
// You can use your own logo image here
import logo from '../assets/logo.png'; // Place your logo in src/assets/logo.png

const Header = () => (
  <div>
    {/* Top red bar */}
    <div style={{ background: '#ed1c24', height: '12px', width: '100%' }}></div>
    {/* Main header */}
    <header
      style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 40px 18px 40px',
        borderBottom: '4px solid #0a2239'
      }}
    >
      {/* Logo and App Name */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: '100px', marginRight: '16px' }}
        />
        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0050b3', letterSpacing: '1px' }}>
          My Library 
        </span>
      </div>
      {/* Navigation */}
      <nav>
        <Link
          to="/"
          style={{
            margin: '0 30px',
            textDecoration: 'none',
            color: '#0050b3',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/members"
          style={{
            margin: '0 30px',
            textDecoration: 'none',
            color: '#0050b3',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Members
        </Link>
        <Link
          to="/books"
          style={{
            margin: '0 30px',
            textDecoration: 'none',
            color: '#0050b3',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Books
        </Link>
        <Link
          to="/loans"
          style={{
            margin: '0 30px',
            textDecoration: 'none',
            color: '#0050b3',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Loans
        </Link>
        <Link
          to="/register"
          style={{
            margin: '0 30px',
            textDecoration: 'none',
            color: '#0050b3',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Register 
        </Link>
      </nav>
    </header>
  </div>
);

export default Header;