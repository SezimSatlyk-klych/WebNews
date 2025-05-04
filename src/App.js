
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Main from './components/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Router, Routes} from "react-router-dom";
import Home from "./components/Home";
import Details from "./components/Details";
import SummarizeForm from "./components/SummarizeForm";
import GeminiChat from "./components/GeminiChat";
import Chat from "./components/Chat";



function App() {
  return (
    <>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Main />} />
            <Route path="/details" element={<Details />} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
        {/*<SummarizeForm />*/}
        {/* <GeminiChat/> */}
    </>
  );
}

export default App;
