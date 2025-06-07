import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/UserEdit.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/users/${id}`)
      .then(res => {
        setUser(res.data);
        setUsername(res.data.username);
        setRole(res.data.role);
      })
      .catch(() => setError('Failed to fetch user details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updated = { ...user, username, role };
      await axios.put(`http://localhost:8080/api/users/${id}`, updated);
      navigate('/users');
    } catch {
      setError('Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="edit-user-container"><p>Loading...</p></div>;
  if (error) return <div className="edit-user-container"><p className="error">{error}</p></div>;

  return (
    <div className="edit-user-container">
      <form className="edit-user-form" onSubmit={handleSave}>
        <h2>Edit User</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>Save</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/users')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;