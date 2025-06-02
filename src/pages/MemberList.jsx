import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MemberList = ({ onSelectMember }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/members');
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch members. Please ensure the backend is running.');
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.id.toString().includes(search)
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/members/${id}`);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      setError("Failed to delete member.");
    }
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditContact(member.contactInfo);
  };

  const handleEditSave = async (id) => {
    try {
      const updated = { name: editName, contactInfo: editContact };
      await axios.put(`http://localhost:8080/api/members/${id}`, updated);
      setMembers(
        members.map((m) => (m.id === id ? { ...m, ...updated } : m))
      );
      setEditingId(null);
    } catch (err) {
      setError("Failed to update member.");
    }
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Members List</h2>
      <input
        type="text"
        placeholder="Search by name or ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      {filteredMembers.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Contact Info</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{member.id}</td>
                {editingId === member.id ? (
                  <>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <input value={editName} onChange={e => setEditName(e.target.value)} />
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <input value={editContact} onChange={e => setEditContact(e.target.value)} />
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <button onClick={() => handleEditSave(member.id)}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{member.name}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{member.contactInfo}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <button onClick={() => onSelectMember(member)}>View Details</button>
                      <button onClick={() => startEdit(member)} style={{ marginLeft: '5px' }}>Edit</button>
                      <button onClick={() => handleDelete(member.id)} style={{ marginLeft: '5px', color: 'red' }}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberList;