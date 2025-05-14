import { Link } from 'react-router-dom';
import nothingAtAllImage from '../assets/Nothing-at-all.jpeg';
import notFoundImage from '../assets/404.png';
import { useEffect } from 'react';



export default function NotFound() {
    useEffect(() => {
        document.title = "🙃404 - ZORO IS LOST🙃"; // Helmet absolutely hates me
    }, [])

    return (
        <div className="generic-container">
            <h1>Oh no! Zoro is lost again</h1>
            <img
                src={notFoundImage}
                alt="Nothing at all"
                style={{ maxWidth: '700px', width: '100%', marginBottom: '20px' }}
            />
            <h2>And what did you find Zoro?</h2>
            <img
                src={nothingAtAllImage}
                alt="Nothing at all"
                style={{ maxWidth: '500px', width: '100%', marginBottom: '20px' }}
            />
            <Link to="/"><h3>Help Zoro find his way back, using this link!</h3></Link>

        </div>
    );
}
