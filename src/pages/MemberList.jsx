import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Member.css';
import memberPic from '../assets/Member.png'; 

const MemberList = ({ onSelectMember }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showMyParticulars, setShowMyParticulars] = useState(false);
  const [myDetails, setMyDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch members only when showTable is true
  useEffect(() => {
    if (!showTable) return;
    setLoading(true);
    axios.get('http://localhost:8080/api/members')
      .then(res => setMembers(res.data))
      .catch(() => setError('Failed to fetch members.'))
      .finally(() => setLoading(false));
  }, [showTable]);

  // Example: Replace with your actual authentication/user context logic
  const loggedInMemberId = localStorage.getItem('memberId'); // Or get from context/auth

  const handleShowMyParticulars = () => {
    setShowMyParticulars(true);
    setLoading(true);
    axios.get(`http://localhost:8080/api/members/${loggedInMemberId}`)
      .then(res => setMyDetails(res.data))
      .catch(() => setError('Failed to fetch your particulars.'))
      .finally(() => setLoading(false));
  };

  const handleEdit = (member) => {
    navigate(`/edit-member/${member.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/api/members/${id}`);
        setMembers(members => members.filter(m => m.id !== id));
      } catch (err) {
        setError('Failed to delete member.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="member-root">
      <div className="member-header-row">
        <img src={memberPic} alt="Members" className="member-pic" />
        <div className="member-rules-box">
          <h3 className="member-rules-title">Membership Benefits</h3>
          <ul className="member-rules-list">
            <li>Membership valid for <b>1 year</b> from registration</li>
            <li>Max <b>3 books</b> per member at a time</li>
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
          View Members
        </button>
        <button
          className="member-btn member-btn-register"
          onClick={() => window.location.href = '/register'}
          onMouseOver={e => e.target.style.background = '#218838'}
          onMouseOut={e => e.target.style.background = '#28a745'}
        >
          Register New Member
        </button>
        <button
          className="member-btn"
          style={{ background: '#ff9800' }}
          onClick={handleShowMyParticulars}
          onMouseOver={e => e.target.style.background = '#e68900'}
          onMouseOut={e => e.target.style.background = '#ff9800'}
        >
          My Particulars
        </button>
      </div>
      {showTable && (
        <div className="member-table-box" style={{ paddingTop: 24 }}>
          <div className="member-search-row">
            <input
              type="text"
              className="member-search-input"
              placeholder="🔍 Search by ID or Name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <p>Loading members...</p>
          ) : error ? (
            <p className="member-error">{error}</p>
          ) : (
            <table className="member-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members
                  .filter(member =>
                    member.id.toString().includes(searchTerm.trim()) ||
                    member.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
                  )
                  .map((member, idx) => (
                    <tr
                      key={member.id}
                      className={idx % 2 === 0 ? 'member-row-even' : ''}
                    >
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.contactInfo}</td>
                      <td>
                        <button
                          className="member-btn member-btn-edit"
                          onClick={() => handleEdit(member)}
                          style={{ background: 'green', color: '#fff', marginRight: 8 }}
                        >
                          Edit
                        </button>
                        <button
                          className="member-btn member-btn-delete"
                          onClick={() => handleDelete(member.id)}
                          style={{ background: '#dc3545', color: '#fff' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {showMyParticulars && (
        <div className="member-table-box">
          {loading ? (
            <p>Loading your particulars...</p>
          ) : error ? (
            <p className="member-error">{error}</p>
          ) : myDetails ? (
            <table className="member-table">
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{myDetails.id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{myDetails.name}</td>
                </tr>
                <tr>
                  <th>Contact Info</th>
                  <td>{myDetails.contactInfo}</td>
                </tr>
                {/* Add more fields as needed */}
              </tbody>
            </table>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MemberList;