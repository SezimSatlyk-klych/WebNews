import React, { useState ,useEffect} from "react";
import menu from "../images/menu.png";
import search from '../images/search.png';
import moment from 'moment';
import news from '../images/news.png';
import aicon from '../images/aicon.png';

import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signOut,onAuthStateChanged  } from "firebase/auth";

const auth = getAuth();

export default function Navbar(props) {
    const [searchIcon, setSearchIcon] = useState(false);
    const navigate = useNavigate();
    
    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Logout successfully");
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error(err);
        }
    };
    const [user, setUser] = useState(null);
    const { hideCategories = false } = props;




    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                
                localStorage.setItem("email", currentUser.email);
            } else {
                
                localStorage.removeItem("email");
            }
        });
        return unsubscribe; 
    }, []);
    
  

    return (
        <>
            <ToastContainer autoClose={3000} />
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3" style={{ borderBottom: "1px solid #eaeaea" }}>
                    <div className="container-fluid d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <img src={search} onClick={() => setSearchIcon(!searchIcon)} className="Search-icon" alt="Search" style={{ height: 24, cursor: "pointer" }} />
                            {searchIcon && (
                                <>
                                    <input onChange={(e) => props?.setSearch(e.target.value)} placeholder="Search" />
                                    <button onClick={() => props?.searchRef?.current?.scrollIntoView({ behavior: "smooth" })}>Go</button>
                                </>
                            )}
                        </div>

                        <div className="text-center">
                            <h5 className="mb-0" style={{ fontWeight: "500", fontFamily: "'Inter', sans-serif" }}>
                                {moment(new Date()).format("DD-MM-YYYY")}
                            </h5>
                            <small className="text-muted">Today's Paper</small>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <Link to="/chat">
                                <img
                                    src={aicon}
                                    alt="Logo"
                                    style={{
                                        height: 64,
                                        transition: "transform 0.2s, background-color 0.2s",
                                        cursor: "pointer",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = "scale(1.1)";
                                        e.target.style.backgroundColor = "#f8f9fa";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = "scale(1)";
                                        e.target.style.backgroundColor = "transparent";
                                    }}
                                    onClick={() => {
                                        navigate("/chat");
                                    }}
                                />
                            </Link>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <img src={news} alt="Logo" style={{ height: 32 }} />
                            {auth?.currentUser ? (
                                <button onClick={logout} className="btn btn-outline-danger rounded-pill px-4 py-1">
                                    Log out
                                </button>
                            ) : (
                                <Link to="/login">
                                    <button className="btn btn-outline-dark rounded-pill px-4 py-1">
                                        Log in
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
                {!hideCategories && (
                <div className="category-section py-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="container">
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            {[
                                "U.S.", "World", "Business", "Arts", "Lifestyle",
                                "Opinion", "Audio", "Games", "Cooking", "Wirecutter", "The Athletic"
                            ].map((category) => (
                                <h6
                                    key={category}
                                    onClick={() => props?.setMenu(category)}
                                    className="category-item mb-0"
                                    style={{
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        color: "#333",
                                        padding: "6px 12px",
                                        borderRadius: "12px",
                                        transition: "transform 0.2s, background 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#e9ecef";
                                        e.target.style.transform = "scale(1.1)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.transform = "scale(1)";
                                    }}
                                >
                                    {category}
                                </h6>
                            ))}
                        </div>
                    </div>
                </div>
                )}
                
            </div>
        </>
    );
}
