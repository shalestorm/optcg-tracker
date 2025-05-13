import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeader } from '../context/LeaderContext.jsx';

function LeadersMenu() {
    const [leaders, setLeaders] = useState([]);
    const [matches, setMatches] = useState([]);
    const [sortBy, setSortBy] = useState('mostPlayed');
    const { setSelectedLeader } = useLeader();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/leaders/")
            .then(res => res.json())
            .then(setLeaders)
            .catch(err => console.error("Failed to fetch leaders", err));

        fetch("http://localhost:8000/matches/")
            .then(res => res.json())
            .then(setMatches)
            .catch(err => console.error("Failed to fetch matches", err));
    }, []);

    const handleSelectLeader = (leader) => {
        setSelectedLeader(leader);
        navigate('/matches');
    };

    // Get leaders with at least one match played
    const leadersWithStats = leaders
        .map(leader => {
            const playedMatches = matches.filter(m => m.leader_id === leader.id);
            const total = playedMatches.length;
            const wins = playedMatches.filter(m => m.result === 'win').length;
            const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
            return {
                ...leader,
                totalMatches: total,
                winRate,
            };
        })
        .filter(l => l.totalMatches > 0);

    // Sort by either highest win rate or by games played
    const sortedStats = [...leadersWithStats].sort((a, b) => {
        if (sortBy === 'mostPlayed') {
            return b.totalMatches - a.totalMatches;
        } else if (sortBy === 'highestWinRate') {
            return b.winRate - a.winRate;
        }
        return 0;
    });

    return (
        <div className='leader-menu-container'>
            <h2>Select a Leader</h2>
            <div class='main-leader-select'>

                <div class='main-selection'>
                    {leaders.map((leader) => (
                        <div key={leader.id} onClick={() => handleSelectLeader(leader)} className='cards'>
                            <img src={leader.image_url} alt={leader.name} width={150} height={200} />
                            <h3>{leader.name}</h3>
                            <p>Set: {leader.set}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2>Previously Played Leaders</h2>
                <label>Sort by: </label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="mostPlayed">Most Played</option>
                    <option value="highestWinRate">Highest Win Rate</option>
                </select>

                <div className='previously-played'>
                    <div className='previously-played-scroll'>
                        {sortedStats.map((leader) => (
                            <div
                                key={leader.id}
                                onClick={() => handleSelectLeader(leader)}
                                className='played-leaders'
                            >
                                <img src={leader.image_url} alt={leader.name} width={150} height={200} />
                                <h3>{leader.name}</h3>
                                <p>Set: {leader.set}</p>
                                <p>Total Matches: {leader.totalMatches}</p>
                                <p>Win Rate: {leader.winRate}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeadersMenu;
