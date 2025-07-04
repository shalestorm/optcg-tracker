import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../config'


function MatchLogs() {
    // O_O wall of vars
    const { leaderId } = useParams();
    const [matches, setMatches] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [result, setResult] = useState('');
    const [opposingLeaderId, setOpposingLeaderId] = useState('');
    const [position, setPosition] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const matchesPerPage = 8;
    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    const sortedMatches = [...matches].sort((a, b) => b.id - a.id);
    const currentMatches = sortedMatches.slice(indexOfFirstMatch, indexOfLastMatch);
    const [leaderSearch, setLeaderSearch] = useState('');
    const selectedLeader = leaders.find(l => l.id === parseInt(leaderId));


    // Grabs every leader for the match logging form
    useEffect(() => {
        fetch(`${API_BASE_URL}/leaders/`)
            .then(res => res.json())
            .then(data => setLeaders(data))
            .catch(err => console.error('Failed to fetch leaders:', err));
    }, []);

    // Grabs matches for where the selected leader was played as the selected leader
    useEffect(() => {
        if (selectedLeader) {
            fetch(`${API_BASE_URL}/leaders/${selectedLeader.id}/matches`)
                .then(res => res.json())
                .then(data => setMatches(data))
                .catch(err => console.error('Failed to fetch matches:', err));
        }
    }, [selectedLeader]);


    // Submit handling for the match logging form
    const handleSubmit = (e) => {
        e.preventDefault();
        const newMatch = {
            leader_id: selectedLeader.id,
            result,
            position,
            opposing_leader_id: parseInt(opposingLeaderId),
        };

        fetch(`${API_BASE_URL}/matches/`, {
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


    // Vars used for showing the amoung of wins losses total games played and some math for getting percentages
    const wins = matches.filter(m => m.result === "win").length;
    const losses = matches.filter(m => m.result === "loss").length;
    const total = matches.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;


    useEffect(() => {
        document.title = "⚔️Matchup Stats⚔️"; // Helmet absolutely hates me
    }, [])

    return (
        <div>
            {selectedLeader && leaderId ? (
                <div className='match-container'>
                    <div className='button-container'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                //deletion method, mostly because of testing - and also to show i know how to use the method
                                if (confirm(`Delete all matches where ${selectedLeader.set} ${selectedLeader.name} was the active leader?`)) {
                                    fetch(`${API_BASE_URL}/matches/leader/${selectedLeader.id}`, {
                                        method: 'DELETE'
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            alert(`Deleted ${data.deleted_count} match(es).`);
                                            // refect in case we delete match history, otherwise element get janked up
                                            fetch(`${API_BASE_URL}/leaders/${selectedLeader.id}/matches`)
                                                .then(res => res.json())
                                                .then(data => setMatches(data));
                                        })
                                        .catch(err => {
                                            console.error("Failed to delete match history", err);
                                            alert("Something went wrong while deleting match history.");
                                        });
                                }
                            }}
                            className="delete-match-history"
                        >
                            Delete Match History
                        </button>

                        <button><Link to="/leaders">Swap Leader</Link></button>
                    </div>
                    <h2>{selectedLeader.name} {selectedLeader.set}</h2>
                    <div className='active-leader-container'>
                        <div className='leader-and-stats'>
                            <img src={selectedLeader.image_url} alt={selectedLeader.name} width={300} />
                            {/* Stats breakdown*/}
                            <div className='active-stat-breakdown'>
                                <h3>Stats</h3>
                                <p>Wins: {wins} -- Losses: {losses}</p>
                                <p>Games Played: {total}</p>
                                <p>Overall Win Rate: {total > 0 ? `${winRate}%` : "N/A"}</p>
                            </div>
                        </div>
                        {/* view of breakdowns per leader - of which we hide if the total i.e. games played is 0*/}
                        {total > 0 ? (
                            <div className='by-leader'>
                                <h3>Opponent Leader Breakdown</h3>
                                <div className='sorted-leader-cards'>
                                    {/* new set construction via looking at matches table*/}
                                    {[...new Set(matches.map(m => m.opposing_leader_id))].map(opponentId => {
                                        //we map out said set via looking at the opponent leader id in the table
                                        const opponent = leaders.find(l => l.id === opponentId);
                                        const matchesVsOpponent = matches.filter(m => m.opposing_leader_id === opponentId);
                                        //we then set up some variables to build out cards by looking at the position
                                        //in the table
                                        const matchesFirst = matchesVsOpponent.filter(m => m.position === "1st");
                                        const matchesSecond = matchesVsOpponent.filter(m => m.position === "2nd");

                                        const winsFirst = matchesFirst.filter(m => m.result === "win").length;
                                        const winsSecond = matchesSecond.filter(m => m.result === "win").length;
                                        //just calculating win percentage For each individually going first  or secon
                                        const rateFirst = matchesFirst.length > 0 ? Math.round((winsFirst / matchesFirst.length) * 100) : 0;
                                        const rateSecond = matchesSecond.length > 0 ? Math.round((winsSecond / matchesSecond.length) * 100) : 0;

                                        return (
                                            <div key={opponentId} className='opp-leaders'>
                                                {opponent ? (
                                                    <>
                                                        <img src={opponent.image_url} alt={opponent.name} width={150} />
                                                        <h4>{opponent.name} {opponent.set}</h4>
                                                    </>
                                                ) : (
                                                    <h4>Unknown Leader #{opponentId}</h4>
                                                )}
                                                <p>Total Matches: {matchesVsOpponent.length}</p>
                                                {/* since winning 3 times going first, and never going second
                                                would show the same result as winning once going first and losing going 2nd twice
                                                we check if the length of matches played in either position is greater than 0
                                                so that instead of 0% we show N/A if applicable - thanks to my homie gavin for spotting that*/}
                                                <p>Win Rate Going 1st: {matchesFirst.length > 0 ? `${rateFirst}%` : "N/A"}</p>
                                                <p>Win Rate Going 2nd: {matchesSecond.length > 0 ? `${rateSecond}%` : "N/A"}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            // place holder if no games have been played with this leader before
                            <h2>No matches found for this leader.</h2>
                        )}
                    </div>
                    {/* Log Match */}
                    <div className='bottom-section'>
                        <div className='log-match-container'>
                            <h3>Log a New Match</h3>
                            <h4>Select Opposing Leader:</h4>
                            <input
                                type="text"
                                placeholder="search leaders..."
                                value={leaderSearch}
                                onChange={(e) => setLeaderSearch(e.target.value)}
                                className="search-bar"
                            />
                            <form onSubmit={handleSubmit}>

                                <div className='form-buttons'>
                                    {/* Result Buttons */}

                                    <div className="button-toggle-group">
                                        <button
                                            type="button"
                                            className={`toggle-btn ${result === 'win' ? 'selected' : ''}`}
                                            onClick={() => setResult('win')}
                                        >
                                            Win
                                        </button>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${result === 'loss' ? 'selected' : ''}`}
                                            onClick={() => setResult('loss')}
                                        >
                                            Loss
                                        </button>
                                    </div>

                                    {/* Position Buttons */}
                                    <div className="button-toggle-group">
                                        <button
                                            type="button"
                                            className={`toggle-btn ${position === '1st' ? 'selected' : ''}`}
                                            onClick={() => setPosition('1st')}
                                        >
                                            1st
                                        </button>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${position === '2nd' ? 'selected' : ''}`}
                                            onClick={() => setPosition('2nd')}
                                        >
                                            2nd
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!result || !position || !opposingLeaderId}
                                    >
                                        Submit Match
                                    </button>
                                </div>

                                {/* Opposing Leader Selector */}
                                <div className='form-leader-select'>
                                    <div className="opposing-leader-grid">
                                        {leaders
                                            .filter(l =>
                                                l.name.toLowerCase().includes(leaderSearch.toLowerCase()) ||
                                                l.set.toLowerCase().includes(leaderSearch.toLowerCase())
                                            )
                                            .map((l) => (
                                                <div
                                                    key={l.id}
                                                    className={`opposing-leader-tile ${parseInt(opposingLeaderId) === l.id ? 'selected' : ''}`}
                                                    onClick={() => setOpposingLeaderId(l.id)}
                                                >
                                                    <img src={l.image_url} alt={l.name} width={80} />
                                                    <div>{l.name} {l.set}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Match History  window with pagnation - of which we hide if the total i.e. games played is 0*/}
                        {total > 0 ? (
                            <div className="match-history">
                                <h3>Match History</h3>
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
                                <ul>
                                    {currentMatches.map(match => {
                                        const opponent = leaders.find(l => l.id === match.opposing_leader_id);
                                        const opponentName = opponent ? `${opponent.name} ${opponent.set}` : `Leader #${match.opposing_leader_id}`;
                                        const resultClass = match.result === 'win' ? 'result-win' : 'result-loss'
                                        return (
                                            <li key={match.id} className='match-row'>
                                                <div className='match-left'>
                                                    <span className={resultClass}>{match.result.toUpperCase()}</span> vs <strong>{opponentName}</strong>
                                                </div>
                                                <div className='match-right'>
                                                    Going <strong>{match.position}</strong> --- {new Date(match.date).toISOString().split('T')[0]}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : (
                            // place holder if no games have been played with this leader before
                            <h2>No matches found for this leader.</h2>
                        )}
                    </div>
                </div>
                //default if there is not leader selected at all but we land on the page
            ) : (
                <h1>No leader selected. <Link to="/leaders">Pick one here.</Link></h1>
            )}

        </div>

    );
}

export default MatchLogs;
