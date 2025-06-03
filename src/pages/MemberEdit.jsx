import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/MemberEdit.css';

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/members/${id}`)
      .then(res => {
        setMember(res.data);
        setName(res.data.name);
        setContactInfo(res.data.contactInfo);
      })
      .catch(() => setError('Failed to fetch member details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updated = { ...member, name, contactInfo };
      await axios.put(`http://localhost:8080/api/members/${id}`, updated);
      navigate('/members');
    } catch {
      setError('Failed to update member.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="edit-member-container"><p>Loading...</p></div>;
  if (error) return <div className="edit-member-container"><p className="error">{error}</p></div>;

  return (
    <div className="edit-member-container">
      <form className="edit-member-form" onSubmit={handleSave}>
        <h2>Edit Member</h2>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Info</label>
          <input
            type="text"
            value={contactInfo}
            onChange={e => setContactInfo(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>Save</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/members')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditMember;