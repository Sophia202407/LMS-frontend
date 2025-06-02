import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import RegisterForm from './pages/RegisterForm';
import Header from './components/Header';
import Books from './components/Books';
import Loans from './components/Loans';
import LoanForm from './pages/LoanForm';

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
          <Route path="/" element={<Loans />} />
          <Route path="/new-loan" element={<LoanForm />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/books" element={<Books />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/register" element={<RegisterForm onMemberAdded={handleMemberAdded} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

