import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar(props) {
    if (!props?.news?.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body">
                <h4 className="card-title mb-4">More News</h4>
                <ul className="list-unstyled">
                    {props.news.slice(1, 3).map((article, index) => (
                        <li key={index} className="mb-4">
                            <Link
                                to="/details"
                                state={article}
                                className="text-decoration-none text-dark"
                            >
                                <h6 className="fw-semibold">{article?.title}</h6>
                                <p className="text-muted small mb-1">{article?.description}</p>
                                <span className="text-primary small">Read more →</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
