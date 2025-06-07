import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/User.css'; // You can rename this to User.css if you want
import memberPic from '../assets/Member.png'; 

const UserList = ({ isLibrarian }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch users when showTable is true
  useEffect(() => {
    if (!showTable) return;
    fetchUsers();
    // eslint-disable-next-line
  }, [showTable]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (searchTerm.trim()) {
        res = await axios.get(`http://localhost:8080/api/users/search?name=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        res = await axios.get('http://localhost:8080/api/users');
      }
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        setUsers(users => users.filter(u => u.id !== id));
      } catch (err) {
        setError('Failed to delete user.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fetch users when search term changes and table is shown
  useEffect(() => {
    if (showTable) fetchUsers();
    // eslint-disable-next-line
  }, [searchTerm]);

  return (
    <div className="member-root">
      <div className="member-header-row">
        <img src={memberPic} alt="Users" className="member-pic" />
        <div className="member-rules-box">
          <h3 className="member-rules-title">User Management</h3>
          <ul className="member-rules-list">
            <li>Manage all users (members, librarians, etc.)</li>
            <li>Search, edit, or delete users as needed</li>
          </ul>
        </div>
      </div>
      <div className="member-btn-row">
        <button
          className="member-btn member-btn-view"
          onClick={() => setShowTable(true)}
          onMouseOver={e => e.target.style.background = '#1976d2'}
          onMouseOut={e => e.target.style.background = '#4f8cff'}
        >
          View Users
        </button>
        {isLibrarian && (
          <button
            className="member-btn member-btn-register"
            onClick={() => navigate('/register')}
            onMouseOver={e => e.target.style.background = '#218838'}
            onMouseOut={e => e.target.style.background = '#28a745'}
          >
            Register New User
          </button>
        )}
      </div>
      {showTable && (
        <div className="member-table-box" style={{ paddingTop: 24 }}>
          <div className="member-search-row">
            <input
              type="text"
              className="member-search-input"
              placeholder="🔍 Search by Name"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="member-error">{error}</p>
          ) : (
            <table className="member-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={idx % 2 === 0 ? 'member-row-even' : ''}
                  >
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.contactInfo}</td>
                    <td>
                      {isLibrarian && (
                        <>
                          <button
                            className="member-btn member-btn-edit"
                            onClick={() => handleEdit(user)}
                            style={{ background: 'green', color: '#fff', marginRight: 8 }}
                          >
                            Edit
                          </button>
                          <button
                            className="member-btn member-btn-delete"
                            onClick={() => handleDelete(user.id)}
                            style={{ background: '#dc3545', color: '#fff' }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;