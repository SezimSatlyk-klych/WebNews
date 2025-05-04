import React from "react";
import { Link } from "react-router-dom";

export default function News(props) {
    return (
        <div className="container py-5">
            <h1 ref={props?.searchRef}>NEWS</h1>
            <div className="row">
                {
                    props?.news
                        ?.filter((data) =>
                            data?.title?.toLowerCase().includes((props?.search || "").toLowerCase())
                        )
                        .map((data, index) => (
                            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                <div className="card shadow-sm border-0 rounded-3 h-100">
                                    <Link
                                        to="/details"
                                        state={data}
                                        className="text-decoration-none text-dark"
                                    >
                                        {data?.urlToImage && (
                                            <img
                                                src={data?.urlToImage}
                                                alt="News"
                                                className="card-img-top rounded-top-3"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">{data?.title}</h5>
                                            <p className="card-text text-muted">
                                                {data?.description?.slice(0, 100)}...
                                            </p>
                                            <span className="btn btn-outline-primary btn-sm mt-2">
                                                Read more →
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    );
}
