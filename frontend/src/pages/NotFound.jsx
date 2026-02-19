import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <style>{`
                .not-found-container {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 2rem;
                }

                .not-found-card {
                    max-width: 500px;
                    padding: 3rem;
                }

                .error-code {
                    font-size: 6rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 1rem;
                    line-height: 1;
                }

                h2 {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: var(--text-main);
                }

                p {
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                    font-size: 1.125rem;
                }
            `}</style>

            <div className="card glass not-found-card">
                <div className="error-code">404</div>
                <h2>Lost in Space?</h2>
                <p>The page you are looking for doesn't exist or has been moved to another galaxy.</p>
                <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Take Me Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
