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
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import RequireAuth from './components/RequireAuth';
import LoginForm from './pages/LoginForm';
import BookSearch from './pages/BookSearch';

// Create a wrapper component to access auth context
const AppRoutes = () => {
  const { user, isLibrarian, loading } = useAuth(); // Get auth data from context
  
  // Show loading while auth is being determined
  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center'}}>Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/new-loan" element={<LoanForm />} />
      {/* Pass isLibrarian prop to UserList */}
      <Route path="/users" element={<UserList isLibrarian={isLibrarian} />} />
      <Route path="/edit-user/:id" element={<EditUser />} />
      <Route path="/books" element={<Books />} />
      <Route path="/booksearch" element={<BookSearch />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/loan-history" element={<LoanHistory />} />
      <Route path="/loan-due-dates" element={<LoanDueDates />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;


//Jun.9 update with AuthProvider and useAuth
// This allows us to access the current user and their role throughout the app
// The App component wraps the entire application in the AuthProvider, making auth context available to all components