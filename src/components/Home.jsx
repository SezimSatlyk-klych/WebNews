import React from "react";
import {Link} from "react-router-dom";

export default function Home(props) {

    if (!props?.news?.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card mb-4 shadow-sm border-0 rounded-3">
            <Link to="/details" state={props?.news[props.num]}>
            <img src={props?.news[props.num]?.urlToImage} alt="Image of News" className="card-img-top rounded-3" />
            <div className="card-body">
                <h2 className="card-title">{props?.news[props.num]?.title}</h2>
                <p className="card-text text-muted">{props?.news[props.num]?.description}</p>
                <a href={props?.news[props.num]?.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Read full article
                </a>
            </div>
            </Link>
        </div>
    );
}
