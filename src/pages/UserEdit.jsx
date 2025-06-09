import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/UserEdit.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',       // Full Name
    contactInfo: '', // Contact
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // This state isn't used for displaying, only for navigating

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
          withCredentials: true // Add this for session-based auth
        });
        setUser(res.data);
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          name: res.data.name || '',
          contactInfo: res.data.contactInfo || '',
          role: res.data.role || 'MEMBER'
        });
      } catch (err) {
        console.error('Fetch user error:', err);
        setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Corrected line: Send formData directly
      await axios.put(`http://localhost:8080/api/users/${id}`, formData, { 
        withCredentials: true, // Add this for session-based auth
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Optional: Show success message before navigating
      // If you want to show a success message on this page, you'd set setSuccess(true) here
      navigate('/users');
    } catch (err) {
      console.error('Update user error:', err.response?.data || err.message);
      console.error('Status:', err.response?.status);
      
      let errorMessage = 'Failed to update user.';
      if (err.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to update users.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid user data provided.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Username already exists. Please choose a different username.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="edit-user-container"><p>Loading...</p></div>;
  if (error && !user) return ( // Only show error if user data couldn't be fetched initially
    <div className="edit-user-container">
      <p className="error">{error}</p>
      <button onClick={() => navigate('/users')} className="cancel-btn">
        Back to Users
      </button>
    </div>
  );

  return (
    <div className="edit-user-container">
      <form className="edit-user-form" onSubmit={handleSave}>
        <h2>Edit User</h2>
        
        {error && <p className="error">{error}</p>}
        
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username" // Add name attribute
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Contact Information</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="MEMBER">Member</option>
            <option value="LIBRARIAN">Librarian</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;