import { useLeader } from '../context/LeaderContext.jsx'
import { Link } from 'react-router-dom'

function MatchLogs() {
    const { selectedLeader } = useLeader()

    return (
        <div>
            {selectedLeader ? (
                <>
                    <button>
                        <Link to="/leaders">Swap Leader</Link>
                    </button>
                    <h2>Current Leader: {selectedLeader.name} {selectedLeader.set}</h2>
                    <img src={selectedLeader.image_url} alt={selectedLeader.name} width={450} height={600} />
                    {/* Log Match form, Match History, Stats Breakdown go here */}
                </>
            ) : (
                <h1>No leader selected. <Link to="/leaders">Pick one here.</Link></h1>
            )}
        </div>
    )
}

export default MatchLogs
