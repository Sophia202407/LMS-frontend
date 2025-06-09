import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/User.css';
import memberPic from '../assets/Member.png';

const debounce = (func, delay) => {
  let timeout;
  return function executed(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

const UserList = ({ isLibrarian }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    
    console.log('🔍 Fetching users with search:', searchQuery || '(all users)');
    
    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let res;
      const trimmedSearch = searchQuery.trim();
      
      if (trimmedSearch) {
        console.log('📡 Searching for users with name:', trimmedSearch);
        // Try different search approaches in case the endpoint varies
        try {
          res = await axios.get(`http://localhost:8080/api/users/search?name=${encodeURIComponent(trimmedSearch)}`, config);
        } catch (searchErr) {
          console.log('❌ Search endpoint failed, trying filter approach...');
          // Fallback: get all users and filter client-side
          const allUsersRes = await axios.get('http://localhost:8080/api/users', config);
          const filteredUsers = allUsersRes.data.filter(user => 
            user.username?.toLowerCase().includes(trimmedSearch.toLowerCase())
          );
          res = { data: filteredUsers };
          console.log('✅ Client-side filtering applied, found:', filteredUsers.length, 'users');
        }
      } else {
        console.log('📡 Fetching all users...');
        res = await axios.get('http://localhost:8080/api/users', config);
      }
      
      console.log('✅ Users loaded:', res.data.length);
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Fetch users error:', err.response?.data || err.message);

      let errorMessage = 'Failed to fetch users.';
      if (err.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to view users.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Search endpoint not found. Please check your API configuration.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchUsers = useCallback(
    debounce((searchQuery) => fetchUsers(searchQuery), 500), 
    [fetchUsers]
  );

  // Load all users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTerm) {
      debouncedFetchUsers(searchTerm);
    } else {
      fetchUsers();
    }
  }, [searchTerm, debouncedFetchUsers, fetchUsers]);

  const handleViewAllUsers = async () => {
    console.log('🔍 View All Users button clicked');
    setSearchTerm(''); // This will trigger the useEffect to fetch all users
    setError(null);
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`, {
          withCredentials: true
        });
        
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
      } catch (err) {
        console.error('Delete error:', err.response?.data || err.message);

        let errorMessage = 'Failed to delete user.';
        if (err.response?.status === 403) {
          errorMessage = 'Access denied. You may not have permission to delete users.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (err.response?.status === 400) {
          if (err.response?.data?.message?.includes('foreign key constraint')) {
            errorMessage = 'Cannot delete user: This user has active loans or loan history. Please return all books and clear loan history first.';
          } else {
            errorMessage = err.response?.data?.message || 'Invalid request. Cannot delete user.';
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'user-role-badge user-role-admin';
      case 'LIBRARIAN':
        return 'user-role-badge user-role-librarian';
      case 'MEMBER':
      default:
        return 'user-role-badge user-role-member';
    }
  };

  return (
    <div className="user-root">
      <div className="user-header-row">
        <div className="user-left">
          <h1 className="user-title">
            <span className="user-title-highlight">User</span> Management
          </h1>
          <p className="user-subtitle">
            Manage all system users including members, librarians, and administrators.
            Search, edit, and maintain user accounts with comprehensive controls.
          </p>

          <div className="user-actions-row">
            <button
              className="user-btn user-btn-primary"
              onClick={handleViewAllUsers}
              disabled={loading}
            >
              👥 View All Users
            </button>
            {isLibrarian && (
              <button
                className="user-btn user-btn-success"
                onClick={() => navigate('/register')}
                disabled={loading}
              >
                ➕ Register New User
              </button>
            )}
          </div>
        </div>

        <img src={memberPic} alt="User Management" className="user-pic" />
      </div>

      <div className="user-table-container">
        <div className="user-table-header">
          <h2 className="user-table-title">System Users</h2>
          <div className="user-count-badge">
            {users.length} {users.length === 1 ? 'User' : 'Users'}
          </div>
        </div>

        <div className="user-search-container" style={{position: 'relative'}}>
          <div className="user-search-icon">🔍</div>
          <input
            type="text"
            className="user-search-input"
            placeholder="Search users by username"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={loading}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#666'
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {error && !loading && (
          <div className="user-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="user-loading">
            <div>⏳ Loading users...</div>
            <div style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
              Please wait while we fetch the user data...
            </div>
          </div>
        ) : error ? (
          <div className="user-error">
            <strong>Error:</strong> {error}
            <div style={{marginTop: '10px'}}>
              <button 
                className="user-btn user-btn-primary" 
                onClick={handleViewAllUsers}
                style={{fontSize: '14px', padding: '8px 16px'}}
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="user-empty-state">
            <div className="user-empty-icon">👤</div>
            <h3 className="user-empty-title">No Users Found</h3>
            <p className="user-empty-text">
              {searchTerm
                ? `No users match "${searchTerm}". Try a different search term.`
                : 'No users are currently registered in the system.'
              }
            </p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Role</th>
                {isLibrarian && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.email || '-'}</td>
                  <td>{user.name || '-'}</td>
                  <td>{user.contactInfo || '-'}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role || 'Member'}
                    </span>
                  </td>
                  {isLibrarian && (
                    <td className="user-actions-cell">
                      <button
                        className="user-btn-small user-btn-edit"
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                        title="Edit User"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="user-btn-small user-btn-delete"
                        onClick={() => handleDelete(user.id)}
                        disabled={loading}
                        title="Delete User"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;