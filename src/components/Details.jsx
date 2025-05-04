
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./Footer";
import news from '../images/news.png';
import axios from 'axios';

export default function Details() {
    const location = useLocation();
    const data = location.state;
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');

    if (!data) {
        return <div className="text-center mt-5 text-muted">No data available</div>;
    }
    console.log(data);
    const getSummary = async () => {
        setLoading(true);
        setError("");
        
        try {
            const prompt = `Please provide a concise summary of the following article: 
            Title: ${data.title}
            Description: ${data.description}
            Content: ${data.content}`;
            
            const res = await fetch('https://serverless-ai-beige.vercel.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: userEmail,
                    prompt: prompt 
                }),
            });
            
            if (!res.ok) throw new Error('Network response was not ok');
            
            const responseData = await res.json();
            setSummary(responseData.answer);
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to get summary. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <nav
                className="d-flex align-items-center justify-content-between px-4 py-3"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #eaeaea',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                <a href="/" className="d-flex align-items-center text-decoration-none">
                    <img
                        src={news}
                        alt="Logo"
                        style={{ height: '32px', objectFit: 'contain', marginRight: '12px' }}
                    />
                    <span style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: '#222',
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '-0.2px'
                    }}>
                        NewsFlow
                    </span>
                </a>
                <Link to="/">
                    <button className="btn btn-outline-dark rounded-pill px-4 py-1">
                        Go to Main Page
                    </button>
                </Link>
            </nav>


            <div style={{ backgroundColor: '#fcfafa', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#2c2c2c' }}>
                {data.urlToImage && (
                    <div style={{ height: '50vh', overflow: 'hidden' }}>
                        <img
                            src={data.urlToImage}
                            alt="Article Banner"
                            className="w-100"
                            style={{ objectFit: 'cover', height: '100%', filter: 'brightness(96%)' }}
                        />
                    </div>
                )}

                <div className="px-4 px-md-5 py-5" style={{ maxWidth: '960px', margin: '0 auto' }}>
                    <h2 className="fw-bold mb-4" style={{ fontSize: '2.3rem', letterSpacing: '-0.5px' }}>
                        {data.title}
                    </h2>

                    <p className="text-secondary mb-4" style={{ fontSize: '1.25rem', fontWeight: '300' }}>
                        {data.description}
                    </p>

                    <article style={{ fontSize: '1.15rem', lineHeight: '1.8' }}>
                        {data.content}
                    </article>

                    {summary && (
                        <div className="mt-4 p-4 bg-light border rounded">
                            <h4 className="mb-3">AI Summary</h4>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{summary}</p>
                        </div>
                    )}
                    
                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                    <div className="d-flex flex-wrap justify-content-between text-muted mt-5 small">
                        <span><strong>Author:</strong> {data.author}</span>
                        <span><strong>Published:</strong> {new Date(data.publishedAt).toLocaleDateString()}</span>
                        <span><strong>Source:</strong> {data.source?.name}</span>
                    </div>

                    <div className="mt-5 d-flex gap-3 flex-wrap">
                        <a
                            href={data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn px-4 py-2"
                            style={{
                                borderRadius: '999px',
                                backgroundColor: '#2c2c2c',
                                color: '#fff',
                                fontWeight: '500',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease-in-out'
                            }}
                            onMouseOver={e => e.target.style.opacity = 0.9}
                            onMouseOut={e => e.target.style.opacity = 1}
                        >
                            Read Full Article
                        </a>
                        
                        <button
                            onClick={getSummary}
                            disabled={loading || !userEmail}
                            className="btn px-4 py-2"
                            style={{
                                borderRadius: '999px',
                                backgroundColor: '#4a6fa5',
                                color: '#fff',
                                fontWeight: '500',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease-in-out'
                            }}
                            onMouseOver={e => e.target.style.opacity = 0.9}
                            onMouseOut={e => e.target.style.opacity = 1}
                        >
                            {loading ? 'Generating...' : 'Get AI Summary'}
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
