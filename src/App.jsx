import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import EditUser from './pages/UserEdit';
import LoanDueDates from './pages/LoanDueDates';
import RegisterForm from './pages/RegisterForm';
import Header from './components/Header';
import Books from './pages/Books';
import Loans from './pages/Loans';
import LoanForm from './components/LoanForm';
import LoanHistory from './pages/LoanHistory';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import RequireAuth from './components/RequireAuth';
import LoginForm from './pages/LoginForm';
import BookSearch from './pages/BookSearch';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-loan" element={<LoanForm />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/books" element={<Books />} />
            <Route path="/booksearch" element={<BookSearch />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/loan-history" element={<LoanHistory />} />
            <Route path="/loan-due-dates" element={<LoanDueDates />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

