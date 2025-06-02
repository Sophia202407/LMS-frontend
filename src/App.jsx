import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import RegisterForm from './pages/RegisterForm';
import Header from './components/Header';
import Books from './pages/Books';
import Loans from './pages/Loans';
import LoanForm from './components/LoanForm';
import LoanHistory from './pages/LoanHistory';
import LoanDueDates from './pages/LoanDueDates';

import './App.css';
const App = () => {
  const [members, setMembers] = useState([]);

  const handleMemberAdded = (newMember) => {
    setMembers((prev) => [...prev, newMember]);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-loan" element={<LoanForm />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/books" element={<Books />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/register" element={<RegisterForm onMemberAdded={handleMemberAdded} />} />
          <Route path="/loan-history" element={<LoanHistory />} />
          <Route path="/loan-due-dates" element={<LoanDueDates />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

