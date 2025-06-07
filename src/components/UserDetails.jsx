const UserDetails = ({ user, onBack }) => {
  if (!user) return null;
  return (
    <div>
      <h2>User Details</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Address:</strong> {user.address || 'N/A'}</p>
      <p><strong>Contact Info:</strong> {user.contactInfo}</p>
      <p><strong>Registration Date:</strong> {user.registrationDate}</p>
      <p><strong>Membership Expiry Date:</strong> {user.membershipExpiryDate}</p>
      <button onClick={onBack}>Back to List</button>
    </div>
  );
};
export default UserDetails;