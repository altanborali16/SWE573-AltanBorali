import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import UserProfile from './Pages/UserProfile';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/" element={<Login/>} /> {/* Default route, e.g., for the home page */}
                <Route path="/home" element={<Home/>} />
                <Route path="/userprofile" element={<UserProfile/>} />
            </Routes>
        </Router>
    );
};

export default AppRouter;