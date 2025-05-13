import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeader } from '../context/LeaderContext.jsx';

function LeadersMenu() {
    const [leaders, setLeaders] = useState([]);
    const { setSelectedLeader } = useLeader();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/leaders/")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch leaders");
                return res.json();
            })
            .then(data => setLeaders(data))
            .catch(err => console.error(err));
    }, []);

    const handleSelectLeader = (leader) => {
        setSelectedLeader(leader);
        navigate('/matches');
    };

    return (
        <div>
            <h2>Select a Leader</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {leaders.map((leader) => (
                    <div
                        key={leader.id}
                        onClick={() => handleSelectLeader(leader)}
                        style={{
                            margin: '10px',
                            border: '1px solid #ccc',
                            padding: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        <img src={leader.image_url} alt={leader.name} width={150} height={200} />
                        <h3>{leader.name}</h3>
                        <p>Set: {leader.set}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeadersMenu;
