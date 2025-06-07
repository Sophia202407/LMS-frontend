import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style/Header.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isLibrarian } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      {/* Top red bar */}
      <div className="header-top-bar"></div>
      {/* Main header */}
      <header className="header-main">
        {/* Logo and App Name */}
        <Link to="/" className="header-logo-link">
          <img
            src={logo}
            alt="Logo"
            className="header-logo-img"
          />
          <span className="header-app-name">
            My Library
          </span>
        </Link>
        {/* Navigation */}
        <nav>
          <Link to="/" className="header-nav-link">Dashboard</Link>
          <Link to="/books" className="header-nav-link">Books</Link>
          {isLibrarian && (
            <Link to="/users" className="header-nav-link">Users</Link>
          )}
          <Link to="/loans" className="header-nav-link">Loans</Link>
          <Link to="/register" className="header-nav-link">Register</Link>
          {!user ? (
            <button className="header-nav-link" onClick={handleLogin} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Log In
            </button>
          ) : (
            <button className="header-nav-link" onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;