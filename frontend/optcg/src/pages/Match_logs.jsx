import { useLeader } from '../context/LeaderContext.jsx';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MatchLogs() {
    const { selectedLeader } = useLeader();
    const [matches, setMatches] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [result, setResult] = useState('');
    const [opposingLeaderId, setOpposingLeaderId] = useState('');
    const [position, setPosition] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const matchesPerPage = 10;
    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);


    // Fetch all leaders for the opponent dropdown
    useEffect(() => {
        fetch('http://localhost:8000/leaders/')
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error('Failed to fetch leaders:', err));
    }, []);

    // Fetch matches for selected leader
    useEffect(() => {
        if (selectedLeader) {
            fetch(`http://localhost:8000/leaders/${selectedLeader.id}/matches`)
                .then(res => res.json())
                .then(data => setMatches(data))
                .catch(err => console.error('Failed to fetch matches:', err));
        }
    }, [selectedLeader]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMatch = {
            leader_id: selectedLeader.id,
            result,
            position,
            opposing_leader_id: parseInt(opposingLeaderId),
        };

        fetch('http://localhost:8000/matches/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMatch),
        })
            .then(res => res.json())
            .then(data => {
                setMatches(prev => [...prev, data]);
                setResult('');
                setPosition('');
                setOpposingLeaderId('');

            });
    };

    const wins = matches.filter(m => m.result === "win").length;
    const losses = matches.filter(m => m.result === "loss").length;
    const total = matches.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return (
        <div>
            {selectedLeader ? (
                <div class='match-container'>
                    <button><Link to="/leaders">Swap Leader</Link></button>
                    <h2>{selectedLeader.name} {selectedLeader.set}</h2>
                    <img src={selectedLeader.image_url} alt={selectedLeader.name} width={300} />

                    {/* Log Match */}
                    <h3>Log a New Match</h3>
                    <form onSubmit={handleSubmit}>
                        <select value={result} onChange={e => setResult(e.target.value)} required>
                            <option value="">Result</option>
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                        </select>
                        <select value={position} onChange={e => setPosition(e.target.value)} required>
                            <option value="">1st/2nd</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                        </select>

                        <select value={opposingLeaderId} onChange={e => setOpposingLeaderId(e.target.value)} required>
                            <option value="">Opponent</option>
                            {leaders
                                .map(l => (
                                    <option key={l.id} value={l.id}>
                                        {l.name} ({l.set})
                                    </option>
                                ))}
                        </select>

                        <button type="submit">Submit Match</button>
                    </form>

                    {/* Stats */}
                    <h3>Stats</h3>
                    <p>Wins: {wins}</p>
                    <p>Losses: {losses}</p>
                    <p>Total: {total}</p>
                    <p>Win Rate: {winRate}%</p>

                    {/* Match History */}
                    <div className="match-history">
                        <h3>Match History</h3>
                        <ul>
                            {currentMatches.map(match => {
                                const opponent = leaders.find(l => l.id === match.opposing_leader_id);
                                const opponentName = opponent ? `${opponent.name} (${opponent.set})` : `Leader #${match.opposing_leader_id}`;
                                return (
                                    <li key={match.id}>
                                        {match.result.toUpperCase()} vs {opponentName} — Going {match.position}
                                    </li>
                                );
                            })}
                        </ul>
                        <div>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >Prev</button>
                            <button
                                disabled={indexOfLastMatch >= matches.length}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >Next</button>
                        </div>
                    </div>
                    <div className='by-leader'>
                        <h3>Opponent Leader Breakdown</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                            {[...new Set(matches.map(m => m.opposing_leader_id))].map(opponentId => {
                                const opponent = leaders.find(l => l.id === opponentId);
                                const matchesVsOpponent = matches.filter(m => m.opposing_leader_id === opponentId);
                                const matchesFirst = matchesVsOpponent.filter(m => m.position === "1st");
                                const matchesSecond = matchesVsOpponent.filter(m => m.position === "2nd");

                                const winsFirst = matchesFirst.filter(m => m.result === "win").length;
                                const winsSecond = matchesSecond.filter(m => m.result === "win").length;

                                const rateFirst = matchesFirst.length > 0 ? Math.round((winsFirst / matchesFirst.length) * 100) : 0;
                                const rateSecond = matchesSecond.length > 0 ? Math.round((winsSecond / matchesSecond.length) * 100) : 0;

                                return (
                                    <div key={opponentId} style={{ textAlign: 'center', maxWidth: '200px' }}>
                                        {opponent ? (
                                            <>
                                                <img src={opponent.image_url} alt={opponent.name} width={150} />
                                                <h4>{opponent.name} {opponent.set}</h4>
                                            </>
                                        ) : (
                                            <h4>Unknown Leader #{opponentId}</h4>
                                        )}
                                        <p>Total Matches: {matchesVsOpponent.length}</p>
                                        <p>Win Rate Going 1st: {rateFirst}%</p>
                                        <p>Win Rate Going 2nd: {rateSecond}%</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            ) : (
                <h1>No leader selected. <Link to="/leaders">Pick one here.</Link></h1>
            )}

        </div>

    );
}

export default MatchLogs;
