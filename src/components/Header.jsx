import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style/Header.css';

const Header = () => (
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
        <Link to="/members" className="header-nav-link">Members</Link>
        <Link to="/books" className="header-nav-link">Books</Link>
        <Link to="/loans" className="header-nav-link">Loans</Link>
        <Link to="/register" className="header-nav-link">Register</Link>
      </nav>
    </header>
  </div>
);

export default Header;