import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import libraryImg from '../assets/library.webp';
import '../style/Dashboard.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/books?query=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-main-row">
        {/* Left: Greeting and Search */}
        <div className="dashboard-left">
          <div className="dashboard-greeting">
            {getGreeting()}
          </div>
          <div className="dashboard-title">
            Search our{' '}
            <span className="dashboard-title-highlight">
              Collections
            </span>
            <span className="dashboard-title-arrow">
              ▼
            </span>
          </div>
          <form className="dashboard-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Start your search here"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="dashboard-search-input"
            />
            <button
              type="submit"
              className="dashboard-search-btn"
            >
              Go
            </button>
          </form>
        </div>
        {/* Right: Big Image */}
        <div className="dashboard-right">
          <img
            src={libraryImg}
            alt="Library"
            className="dashboard-img"
          />
        </div>
      </div>
      <hr className="dashboard-divider" />
      <Outlet />
    </div>
  );
};

export default Dashboard;