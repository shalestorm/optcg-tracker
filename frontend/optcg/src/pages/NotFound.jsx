import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../../public/Nothing-at-all.jpeg'
import '../../public/404.png'


export default function NotFound() {
    return (
        <div className="generic-container">
            <Helmet>
                <title>404 - Page Not Found</title>
            </Helmet>
            <h1>Oh no! Zoro is lost again</h1>
            <img
                src="/404.png"
                alt="Nothing at all"
                style={{ maxWidth: '700px', width: '100%', marginBottom: '20px' }}
            />
            <h2>And what did you find Zoro?</h2>
            <img
                src="/Nothing-at-all.jpeg"
                alt="Nothing at all"
                style={{ maxWidth: '500px', width: '100%', marginBottom: '20px' }}
            />
            <h3>Help Zoro find his way back, using this link!</h3>
            <Link to="/">Go back home</Link>
        </div>
    );
}
