
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,GithubAuthProvider,FacebookAuthProvider} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAs2pav0_xSMvWe-bdXJi8U7gW48CayKTc",
    authDomain: "news-6d186.firebaseapp.com",
    projectId: "news-6d186",
    storageBucket: "news-6d186.firebasestorage.app",
    messagingSenderId: "219037163360",
    appId: "1:219037163360:web:a4cc24e2250f5cf56d8805",
    measurementId: "G-RQ8NY4YNG5"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const gitProvider = new GithubAuthProvider()
export const facebookProvider = new FacebookAuthProvider();