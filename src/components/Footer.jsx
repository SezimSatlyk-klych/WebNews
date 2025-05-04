import React from 'react';
import news from '../images/news.png';


export default function Footer() {
    return (
        <div className="bg-dark text-white pt-5 pb-4">
            <div className="container text-center">
                <hr className="text-white" />
                <img src={news} alt="News Logo" className="img-fluid" style={{ maxWidth: '120px' }} />
                <h1 className="mt-3 mb-4" style={{ fontSize: '2.5rem', fontWeight: '500' }}>
                    Stay Updated with the Latest News
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.125rem', fontWeight: '400' }}>
                    Your trusted source for breaking news, insights, and updates.
                </p>
                <div>
                    <a href="#privacy" className="text-white mx-3">Privacy Policy</a>
                    <a href="#terms" className="text-white mx-3">Terms of Service</a>
                    <a href="#contact" className="text-white mx-3">Contact Us</a>
                </div>
            </div>
        </div>
    );
}
