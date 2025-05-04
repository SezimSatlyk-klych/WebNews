import React, { useState } from "react";
import github from '../images/github.png';
import google from '../images/google.jpg';
import facebook from '../images/facebook.png';
import news from '../images/news.png';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, gitProvider } from '../firebase/setup';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            if (isLogin) {
    
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Login successful');
            } else {
  
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success('Account created successfully!');
            }
            
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const googleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success('Login successful');

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const gitLogin = async () => {
        try {
            await signInWithPopup(auth, gitProvider);
            toast.success('Login successful');
            setTimeout(()=>{
                navigate('/');
            },2000)
        } catch (err) {
            console.log(err);
            const error = err
            toast.error(error)
        }
    };

    const facebookLogin = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            toast.success('Login successful');
            setTimeout(()=>{
                navigate('/');
            },2000)
        } catch (err) {
            console.log(err);
            const error = err
            toast.error(error)
        }
    };
    return (
        <>
            <ToastContainer autoClose={3000}/>
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light px-3 py-4">
                <div className="mb-4 text-center">
                    <img src={news} alt="News logo" style={{ height: "60px" }} />
                    <h1 className="mt-2" style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "32px" }}>
                        The Daily Report
                    </h1>
                    <p className="text-muted fst-italic" style={{ fontSize: "14px" }}>Your trusted source for breaking news</p>
                </div>

                <div className="bg-white shadow-sm p-4 rounded" style={{ width: "100%", maxWidth: "420px" }}>
                    <h4 className="text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>
                        {isLogin ? 'Sign In to Continue Reading' : 'Create a New Account'}
                    </h4>

                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="you@example.com" />
                        <label className="form-label mt-2">Password </label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="********" />
                    </div>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <button onClick={handleAuth} className="btn btn-dark w-100 mb-3">
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                    
                    <div className="text-center mb-3">
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            className="btn btn-link text-decoration-none"
                        >
                            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
                        </button>
                    </div>

                    <p className="small text-muted text-center mb-4">
                        By continuing, you agree to our
                        <u> Terms of Sale</u>, <u> Terms of Service</u>, and
                        <u> Privacy Policy</u>.
                    </p>

                    <hr />

                </div>
            </div>
        </>
    );
}

export default Login;