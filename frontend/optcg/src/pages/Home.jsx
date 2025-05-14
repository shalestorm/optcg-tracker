import { Link } from 'react-router-dom'
import { useEffect } from 'react';


// simple landing
function Home() {
    useEffect(() => {
        document.title = "Welcome!"; // Helmet absolutely hates me
    }, [])
    return (
        <div className='generic-container'>
            <h1>Welcome to the One Piece Match Tracker!</h1>
            <Link to="/leaders">
                <button>Select Your Leader</button>
            </Link>
        </div>

    )
}

export default Home
