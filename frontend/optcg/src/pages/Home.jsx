import { Link } from 'react-router-dom'

function Home() {
    return (
        <div>
            <h1>Welcome to the One Piece Match Tracker!</h1>
            <Link to="/leaders">
                <button>Select Your Leader</button>
            </Link>
        </div>
    )
}

export default Home
