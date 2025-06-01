import { useState } from 'react';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';

import './App.css';
function App() {
const [selectedMember, setSelectedMember] = useState(null);
const handleSelectMember = (member) => {
setSelectedMember(member);
};
const handleBack = () => {
setSelectedMember(null);
};
return (
<div className="App">
<h1>Library Management System</h1>
{selectedMember ? (
<MemberDetails member={selectedMember} onBack={handleBack} />
) : (
<MemberList onSelectMember={handleSelectMember} />
)}
</div>
);
}
export default App;

