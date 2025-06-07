import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    setAuthError(null);
  try {
    const res= await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      console.log('Response status:', res.status); // Log status (e.g., 200, 401)
      console.log('Redirected:', res.redirected); // Check if redirected

      if (res.redirected) {
        const error = await res.text(); // Await the text to get the actual error message
        setAuthError(`Login failed (redirected to ${res.url}): ${error}`);
        return false;
      }

      if (res.ok) {
        const userData = await res.json(); // Await the JSON to get the actual user data
        console.log("Login successful response data:", userData); // Log the actual data
        setUser(userData); // Set the user state with the received data
        return true;
      } else {
        const errorData = await res.json().catch(() => ({})); // Await the JSON, handle potential parse errors
        setAuthError(errorData.message || 'Invalid credentials');
        return false;
      }
    } catch (err) {
      setAuthError('Network error: ' + err.message);
      return false;
    }
  };

  const logout = async () => {
    await fetch('http://localhost:8080/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  // Role-based helpers (user.role is a string, e.g. "LIBRARIAN")
  const isLibrarian = user?.role === 'LIBRARIAN';
  const isMember = user?.role === 'MEMBER';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      authError,
      loading,
      isLibrarian,
      isMember
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);